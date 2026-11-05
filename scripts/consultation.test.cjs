const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, filename);
const { recoverConsultation, consultationPlan, summaryKey, isConfirmation } = require('../src/lib/consultation.ts');
const now = new Date('2026-11-04T12:00:00+08:00');
const user = content => ({ role: 'user', content });
const bot = content => ({ role: 'assistant', content });

test('recover a long conversation and defer project details without repeating name/contact questions', () => {
  const turns = [user('Can I book a consultation?'), bot('What is your full name?'), user('Rey De Alba'), user('09123456789, https://www.facebook.com/example')];
  for (let i = 0; i < 20; i++) turns.push(user('CRM for a car rental business'), bot('Please provide project details.'));
  turns.push(user('i will discuss it personally the project details. and yes, correct date by nov 6, 2pm.'));
  turns.push(bot('Your slot is confirmed. Please provide Messenger and project details.'));
  turns.push(user('pucha, paulit ulit. ako nga si rey de alba! and i will discuss the other details of the system once i get there by my schedule!'));
  const state = recoverConsultation(turns, undefined, now);
  assert.equal(state.name.toLowerCase(), 'rey de alba');
  assert.equal(state.contact, '09123456789');
  assert.equal(state.messenger, 'https://www.facebook.com/example');
  assert.equal(state.date, '2026-11-06');
  assert.equal(state.time, '14:00');
  const plan = consultationPlan(state, turns.at(-1).content);
  assert.equal(plan.action, 'summary');
  assert.match(plan.reply, /not booked yet/);
  assert.doesNotMatch(plan.reply, /Please provide|What name|What email/);
  assert.match(plan.reply, /discussed during the meeting/);
});

test('one contact method is enough; an old assistant confirmation never counts as booking', () => {
  const state = recoverConsultation([user('My name is Jane Doe'), user('jane@example.com; Friday 2pm'), bot('Your slot is confirmed')], undefined, now);
  assert.equal(state.contact, 'jane@example.com');
  assert.equal(state.messenger, undefined);
  assert.equal(consultationPlan(state, 'confirm').action, 'summary');
  state.status = 'awaiting_confirmation';
  state.confirmedSummary = summaryKey(state);
  assert.equal(consultationPlan(state, 'confirm').action, 'book');
  assert.equal(consultationPlan(state, 'yes').action, 'book');
  assert.equal(consultationPlan(state, 'I will discuss details during the meeting').action, 'summary');
});

test('saved fields survive later turns, and changed slots require a fresh summary', () => {
  const state = { name: 'Jane Doe', contact: 'jane@example.com', date: '2026-11-06', time: '14:00', status: 'awaiting_confirmation' };
  state.confirmedSummary = summaryKey(state);
  const updated = recoverConsultation([user('Make it Friday 3pm instead')], state, now);
  assert.equal(updated.name, 'Jane Doe');
  assert.equal(updated.time, '15:00');
  assert.equal(updated.status, 'collecting');
  assert.equal(consultationPlan(updated, 'confirm').action, 'summary');
  assert.equal(isConfirmation("don't confirm yet"), false);
});

test('repeated confirmation after a successful save does not book again', () => {
  const state = { name: 'Jane Doe', contact: 'jane@example.com', date: '2026-11-06', time: '14:00', status: 'booked' };
  state.confirmedSummary = summaryKey(state);
  const plan = consultationPlan(state, 'confirm');
  assert.equal(plan.action, 'reply');
  assert.match(plan.reply, /already booked/);
});

test('calendar save is idempotent and failures send no booking notifications (all services mocked)', async () => {
  const { google } = require('googleapis');
  const nodemailer = require('nodemailer');
  const db = require('../src/lib/db.ts');
  const original = { calendar: google.calendar, transport: nodemailer.createTransport, connect: db.connectDb, update: db.Booking.updateOne, fetch: global.fetch };
  Object.assign(process.env, { GOOGLE_CLIENT_ID: 'test', GOOGLE_CLIENT_SECRET: 'test', GOOGLE_REFRESH_TOKEN: 'test', GOOGLE_CALENDAR_ID: 'primary', MESSENGER_PAGE_ACCESS_TOKEN: 'test', MESSENGER_RECIPIENT_ID: 'test' });
  const events = new Map();
  let inserts = 0, emails = 0, messages = 0, database = 0, busy = [];
  try {
    google.calendar = () => ({ events: {
      get: async ({ eventId }) => { if (!events.has(eventId)) throw Object.assign(new Error('not found'), { code: 404 }); return { data: events.get(eventId) }; },
      insert: async ({ requestBody }) => { inserts++; events.set(requestBody.id, requestBody); return { data: requestBody }; },
    }, freebusy: { query: async () => ({ data: { calendars: { primary: { busy } } } }) } });
    db.connectDb = async () => {};
    db.Booking.updateOne = async () => { database++; };
    nodemailer.createTransport = () => ({ sendMail: async () => { emails++; } });
    global.fetch = async url => { assert.match(String(url), /^https:\/\/graph.facebook.com\/me\/messages/); messages++; return { ok: true }; };
    const { processBooking } = require('../src/lib/booking.ts');
    const date = new Date(Date.now() + 86400000 * 14);
    while ([0, 6].includes(date.getUTCDay())) date.setUTCDate(date.getUTCDate() + 1);
    const booking = { name: 'Test Visitor', contact: 'test@example.com', messenger: 'Not provided', details: 'To be discussed during consultation', date: date.toISOString().slice(0, 10), time: '14:00' };
    assert.equal(await processBooking(booking, 'test-confirmation'), true);
    assert.equal(await processBooking(booking, 'test-confirmation'), true);
    assert.deepEqual([inserts, emails, messages, database], [1, 1, 1, 1]);
    busy = [{ start: `${booking.date}T13:00:00+08:00`, end: `${booking.date}T16:00:00+08:00` }];
    assert.equal(await processBooking(booking, 'different-visitor'), false);
    assert.deepEqual([inserts, emails, messages, database], [1, 1, 1, 1]);
  } finally {
    google.calendar = original.calendar; nodemailer.createTransport = original.transport; db.connectDb = original.connect; db.Booking.updateOne = original.update; global.fetch = original.fetch;
  }
});
