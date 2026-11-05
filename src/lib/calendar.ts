import { google } from 'googleapis';
import { availableDays, CALENDAR_TIME_ZONE, CONSULTATION_MINUTES, slotIsFree, weekBounds, type BusyInterval } from './calendar-slots';

export function calendarClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) throw new Error('Google Calendar is not configured');
  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: 'v3', auth });
}

export const calendarId = () => process.env.GOOGLE_CALENDAR_ID || 'primary';

async function readBusy(start: Date, end: Date): Promise<BusyInterval[]> {
  const id = calendarId();
  const response = await calendarClient().freebusy.query({ requestBody: {
    timeMin: start.toISOString(), timeMax: end.toISOString(), timeZone: CALENDAR_TIME_ZONE, items: [{ id }],
  } }, { timeout: 10000, retry: false });
  const result = response.data.calendars?.[id];
  // Missing calendar data and per-calendar API errors must never count as free time.
  if (!result || result.errors?.length || !Array.isArray(result.busy)) throw new Error('Calendar availability could not be verified');
  return result.busy.map(interval => {
    if (!interval.start || !interval.end || !Number.isFinite(Date.parse(interval.start)) || !Number.isFinite(Date.parse(interval.end))) throw new Error('Invalid calendar busy interval');
    return { start: interval.start, end: interval.end };
  });
}

export async function getCalendarAvailability(now: Date, offset = 0) {
  const { start, end } = weekBounds(now, offset);
  const heading = `LIVE CALENDAR AVAILABILITY: ${start.toLocaleDateString('en-CA', { timeZone: CALENDAR_TIME_ZONE })} through ${new Date(end.getTime() - 1).toLocaleDateString('en-CA', { timeZone: CALENDAR_TIME_ZONE })}. All times Asia/Manila. Consultations last ${CONSULTATION_MINUTES} minutes. Office hours Mon-Fri 09:00-17:00 are only a filter, not proof of availability.`;
  try {
    const busy = await readBusy(start, end);
    const days = availableDays(now, busy, offset);
    const context = `${heading}\nCalendar checked at ${now.toISOString()}.\n${days.length ? days.map(day => `${day.label} (${day.date}): available START times ${day.starts.join(', ')}.`).join('\n') : 'No remaining one-hour consultation slots in this week.'}\nOnly offer these dates and start times. Give two or three options first. Availability can change; the server rechecks before booking. Never reveal private calendar event details.`;
    return { verified: true, days, context };
  } catch (error) {
    console.warn('Calendar availability unavailable:', error instanceof Error ? error.message : 'Unknown error');
    return { verified: false, days: [], context: `${heading}\nCALENDAR_UNAVAILABLE: Live availability could not be checked. Do not offer or invent available days or times, even from earlier conversation history. Say you cannot verify Reyca's calendar right now and suggest contacting her directly. Do not claim a booking is confirmed.` };
  }
}

export async function calendarAvailabilityPrompt(now: Date, offset = 0): Promise<string> {
  return (await getCalendarAvailability(now, offset)).context;
}

export async function assertBookingAvailable(date: string, time: string, now = new Date()): Promise<void> {
  const start = new Date(`${date}T${time}:00+08:00`);
  if (!Number.isFinite(start.getTime()) || !slotIsFree(start, [], now) || start.toLocaleDateString('en-CA', { timeZone: CALENDAR_TIME_ZONE }) !== date) {
    throw new Error('Choose a future one-hour slot within Monday-Friday, 9 AM-5 PM Philippine time.');
  }
  const end = new Date(start.getTime() + CONSULTATION_MINUTES * 60000);
  const busy = await readBusy(start, end);
  if (!slotIsFree(start, busy, now)) throw new Error('That consultation slot is already busy. Please choose another time.');
}
