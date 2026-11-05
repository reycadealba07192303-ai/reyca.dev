import nodemailer from 'nodemailer';
import { Booking, connectDb } from './db';
import { assertBookingAvailable, calendarClient, calendarId } from './calendar';
import { CONSULTATION_MINUTES } from './calendar-slots';
import { createHash } from 'node:crypto';

export type BookingData = {
  name: string;
  contact: string;
  messenger: string;
  details: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm, Philippine time
};

const BOOKING_BLOCK = /```BOOKING_DATA\s*([\s\S]*?)```/;

// Returns the booking the model appended to its reply, if it is complete.
export function extractBooking(reply: string): BookingData | null {
  const match = reply.match(BOOKING_BLOCK);
  if (!match) return null;
  try {
    const data = JSON.parse(match[1].trim());
    const complete = ['name', 'contact', 'messenger', 'details', 'date', 'time'].every(
      (key) => typeof data[key] === 'string' && data[key].trim()
    );
    if (!complete || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !/^\d{2}:\d{2}$/.test(data.time)) return null;
    return data as BookingData;
  } catch {
    return null;
  }
}

export function stripBookingBlock(reply: string): string {
  return reply.replace(BOOKING_BLOCK, '').trim();
}

// The server runs in UTC, so pin the requested time to Philippine time explicitly
function scheduledAt(b: BookingData): Date {
  return new Date(`${b.date}T${b.time}:00+08:00`);
}

function scheduleLabel(b: BookingData): string {
  return scheduledAt(b).toLocaleString('en-US', { timeZone: 'Asia/Manila', dateStyle: 'full', timeStyle: 'short' });
}

async function saveToDb(b: BookingData, bookingKey?: string) {
  await connectDb();
  const data = {
    name: b.name,
    contact: b.contact,
    messenger: b.messenger,
    projectDetails: b.details,
    status: 'scheduled' as const,
    scheduledAt: scheduledAt(b),
    ...(bookingKey ? { bookingKey } : {}),
  };
  if (bookingKey) await Booking.updateOne({ bookingKey }, { $setOnInsert: data }, { upsert: true });
  else await Booking.create(data);
}

async function createCalendarEvent(b: BookingData, eventId?: string) {
  const calendar = calendarClient();

  const start = scheduledAt(b);
  const end = new Date(start.getTime() + CONSULTATION_MINUTES * 60 * 1000);
  await calendar.events.insert({
    calendarId: calendarId(),
    requestBody: {
      ...(eventId ? { id: eventId } : {}),
      summary: `Portfolio Inquiry: ${b.name}`,
      description: `Name: ${b.name}\nContact: ${b.contact}\nMessenger: ${b.messenger}\nProject: ${b.details}`,
      start: { dateTime: start.toISOString(), timeZone: 'Asia/Manila' },
      end: { dateTime: end.toISOString(), timeZone: 'Asia/Manila' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
          { method: 'email', minutes: 60 },
        ],
      },
    },
  }, { timeout: 10000, retry: false });
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function sendEmail(b: BookingData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  const row = (label: string, value: string) =>
    `<tr><td style="padding: 8px 0; font-weight: bold; color: #555;">${label}:</td><td style="padding: 8px 0;">${escapeHtml(value)}</td></tr>`;

  await transporter.sendMail({
    from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🔔 New Portfolio Booking: ${b.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📩 New Client Inquiry</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${row('Name', b.name)}
          ${row('Contact', b.contact)}
          ${row('Messenger', b.messenger)}
          ${row('Project', b.details)}
          ${row('Schedule', scheduleLabel(b))}
        </table>
      </div>
    `,
  });
}

// Sends a message from Reyca's Facebook Page to her own Messenger account.
// Needs MESSENGER_PAGE_ACCESS_TOKEN and MESSENGER_RECIPIENT_ID (see scripts/get-messenger-id.mjs).
async function notifyMessenger(b: BookingData) {
  const token = process.env.MESSENGER_PAGE_ACCESS_TOKEN;
  const recipient = process.env.MESSENGER_RECIPIENT_ID;
  if (!token || !recipient) throw new Error('Messenger not configured');

  const text = [
    '🔔 New portfolio booking',
    `Name: ${b.name}`,
    `Contact: ${b.contact}`,
    `Messenger: ${b.messenger}`,
    `Project: ${b.details}`,
    `Schedule: ${scheduleLabel(b)}`,
  ].join('\n');

  const res = await fetch(`https://graph.facebook.com/me/messages?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipient },
      // Standard messaging window only; the recipient must have recently messaged the Page.
      // This is an outbound booking alert, not an incoming-message auto-reply handler.
      messaging_type: 'RESPONSE',
      message: { text },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
}

// Verify and reserve the calendar slot before saving or notifying about a booking.
// A successful email/database write alone must never mean the appointment is confirmed.
export async function processBooking(b: BookingData, bookingKey?: string): Promise<boolean> {
  const eventId = bookingKey ? createHash('sha256').update(bookingKey).digest('hex') : undefined;
  const alreadySaved = async () => {
    if (!eventId) return false;
    try {
      const event = await calendarClient().events.get({ calendarId: calendarId(), eventId }, { timeout: 10000, retry: false });
      return event.data.status !== 'cancelled' && typeof event.data.start?.dateTime === 'string' && Date.parse(event.data.start.dateTime) === scheduledAt(b).getTime();
    } catch (error) {
      if ((error as { code?: number }).code === 404) return false;
      throw error;
    }
  };
  try {
    if (await alreadySaved()) return true;
    await assertBookingAvailable(b.date, b.time);
    await createCalendarEvent(b, eventId);
  } catch (error) {
    // A retried confirmation may race the first calendar insert. Never send duplicate alerts.
    try { if (await alreadySaved()) return true; } catch { /* report the original failure */ }
    console.warn('Booking calendar failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
  const channels = { database: (booking: BookingData) => saveToDb(booking, bookingKey), email: sendEmail, messenger: notifyMessenger };
  const results = await Promise.allSettled(Object.values(channels).map((run) => run(b)));

  Object.keys(channels).forEach((name, i) => {
    const r = results[i];
    if (r.status === 'rejected') console.warn(`Booking ${name} failed:`, r.reason instanceof Error ? r.reason.message : r.reason);
  });
  return true;
}
