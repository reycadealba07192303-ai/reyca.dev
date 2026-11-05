const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, filename);
const { availableDays, slotIsFree, weekBounds, availabilityReply } = require('../src/lib/calendar-slots.ts');

test('availability responses use only verified starts, plain text, and exact dates', () => {
  const days = [{ date: '2026-11-05', label: 'Thursday, November 5, 2026', starts: ['10:30', '14:00', '16:00'] }];
  const reply = availabilityReply(days, true);
  assert.match(reply, /Thursday, November 5, 2026: 10:30 AM, 2:00 PM, 4:00 PM/);
  assert.equal(reply.includes('*'), false);
  assert.equal(reply.includes('9:00 AM'), false);
  assert.match(availabilityReply([], false), /no remaining/);
});

test('this week uses Manila Monday through Sunday, including UTC date boundaries', () => {
  const range = weekBounds(new Date('2026-11-01T16:30:00Z'));
  assert.equal(range.start.toISOString(), '2026-11-01T16:00:00.000Z');
  assert.equal(range.end.toISOString(), '2026-11-08T16:00:00.000Z');
});

test('busy intervals block overlapping consultations but allow touching boundaries', () => {
  const now = new Date('2026-11-04T08:00:00+08:00');
  const busy = [{ start: '2026-11-04T10:00:00+08:00', end: '2026-11-04T11:00:00+08:00' }];
  const [day] = availableDays(now, busy);
  assert.equal(day.date, '2026-11-04');
  assert.ok(day.starts.includes('09:00'));
  assert.ok(!day.starts.includes('09:30'));
  assert.ok(!day.starts.includes('10:00'));
  assert.ok(!day.starts.includes('10:30'));
  assert.ok(day.starts.includes('11:00'));
  assert.ok(day.starts.includes('16:00'));
  assert.ok(!day.starts.includes('16:30'));
});

test('all-day events, past times, and weekends are excluded', () => {
  const now = new Date('2026-11-04T13:10:00+08:00');
  const busy = [{ start: '2026-11-05T00:00:00+08:00', end: '2026-11-06T00:00:00+08:00' }];
  const days = availableDays(now, busy);
  assert.deepEqual(days.map(d => d.date), ['2026-11-04', '2026-11-06']);
  assert.equal(days[0].starts[0], '13:30');
  assert.deepEqual(availableDays(new Date('2026-11-07T12:00:00+08:00'), []), []);
  assert.equal(slotIsFree(new Date('2026-11-04T16:30:00+08:00'), [], now), false);
});

test('next week advances to the next Manila week', () => {
  const [day] = availableDays(new Date('2026-11-04T12:00:00+08:00'), [], 1);
  assert.equal(day.date, '2026-11-09');
});

test('calendar errors fail closed and booking conflicts reject', async () => {
  const { google } = require('googleapis');
  const original = google.calendar;
  Object.assign(process.env, { GOOGLE_CLIENT_ID: 'test', GOOGLE_CLIENT_SECRET: 'test', GOOGLE_REFRESH_TOKEN: 'test', GOOGLE_CALENDAR_ID: 'primary' });
  const { calendarAvailabilityPrompt, assertBookingAvailable } = require('../src/lib/calendar.ts');
  const now = new Date('2026-11-04T08:00:00+08:00');
  try {
    google.calendar = () => ({ freebusy: { query: async () => ({ data: { calendars: { primary: { errors: [{ reason: 'notFound' }] } } } }) } });
    assert.match(await calendarAvailabilityPrompt(now), /CALENDAR_UNAVAILABLE/);
    await assert.rejects(assertBookingAvailable('2026-11-04', '10:00', now), /could not be verified/);
    google.calendar = () => ({ freebusy: { query: async () => ({ data: { calendars: { primary: { busy: [{ start: '2026-11-04T10:00:00+08:00', end: '2026-11-04T11:00:00+08:00' }] } } } }) } });
    await assert.rejects(assertBookingAvailable('2026-11-04', '10:00', now), /already busy/);
    await assertBookingAvailable('2026-11-04', '11:00', now);
  } finally { google.calendar = original; }
});
