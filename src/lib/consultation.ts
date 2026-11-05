import { CALENDAR_TIME_ZONE, localDate, weekBounds } from './calendar-slots';

export type ConsultationState = {
  name?: string;
  contact?: string;
  messenger?: string;
  details?: string;
  date?: string;
  time?: string;
  status?: 'collecting' | 'awaiting_confirmation' | 'booked';
  confirmedSummary?: string;
};
export type Turn = { role: 'user' | 'assistant'; content: string };

export function summaryKey(state: ConsultationState): string {
  return JSON.stringify([state.name, state.contact, state.date, state.time]);
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function consultationIntent(text: string): boolean {
  return /consult|sched|book|appointment|meeting|meet with|talk to|talk with|availab|kailan|kelan|anong.*(day|araw|oras)/i.test(text);
}

export function asksAvailability(text: string): boolean {
  return /availab|\bwhen\b|which.*days?|what.*days?|anong.*(day|araw|oras)|kailan|kelan|what.*time/i.test(text);
}

export function isConfirmation(text: string): boolean {
  if (/\b(?:don't|do not|not yet|cancel|wag|huwag)\b/i.test(text)) return false;
  return /^(?:yes|yes please|oo|sige|tuloy|confirm(?:ed)?|book it|go ahead|proceed|ituloy|i-book mo|confirm it|just confirm it)[.!\s]*$/i.test(text.trim()) || /\b(?:just confirm it|please confirm|i confirm|go ahead and book)\b/i.test(text);
}

function readName(text: string): string | undefined {
  const match = text.match(/(?:\b(?:full\s+)?name\s*(?:is|:)|\bmy name is|\bi(?:'m| am)|\bako(?:\s+nga)?\s+si)\s+([\p{L}][\p{L}'’ .-]{1,70})/iu);
  const value = match?.[1]?.split(/\s+(?:and|at|tapos|po|i will|ang)\b/i)[0]?.replace(/[.!\s]+$/, '').trim();
  if (!value || /^(?:looking|interested|available|calling|booking|trying|ready|not|a developer|planning|asking|free|going|here|sure|sorry)\b/i.test(value)) return;
  return value;
}

function readDate(text: string, now: Date, nextWeek: boolean): string | undefined {
  const iso = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (iso) return iso[1];
  const month = text.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:[\s,]+(20\d{2}))?\b/i);
  if (month) return `${month[3] ?? localDate(now).slice(0, 4)}-${String(MONTHS.indexOf(month[1].slice(0, 3).toLowerCase()) + 1).padStart(2, '0')}-${month[2].padStart(2, '0')}`;
  if (/\btomorrow\b|\bbukas\b/i.test(text)) return localDate(new Date(now.getTime() + 86400000));
  if (/\btoday\b|\bngayong araw\b/i.test(text)) return localDate(now);
  const day = text.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (day) return localDate(new Date(weekBounds(now, nextWeek ? 1 : 0).start.getTime() + WEEKDAYS.indexOf(day[1].toLowerCase()) * 86400000));
}

function readTime(text: string): string | undefined {
  const clock = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/i);
  if (clock) {
    const hour = Number(clock[1]), minute = Number(clock[2] ?? 0);
    if (hour < 1 || hour > 12 || minute > 59) return;
    return `${String(hour % 12 + (/p/i.test(clock[3]) ? 12 : 0)).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
  const military = text.match(/\b([01]\d|2[0-3]):([0-5]\d)\b/);
  if (military) return `${military[1]}:${military[2]}`;
}

// Recover details from USER turns, including old conversations predating structured state.
// Earlier assistant claims of confirmation or guessed names are never booking evidence.
export function recoverConsultation(turns: Turn[], saved: ConsultationState | undefined, now: Date): ConsultationState {
  const state: ConsultationState = { ...saved };
  // Once structured memory exists, only parse the new user turn (with its preceding prompt).
  // Replaying old relative dates every turn would silently move a saved booking to a new week.
  if (saved && (saved.name || saved.contact || saved.date || saved.time)) turns = turns.slice(-2);
  let nextWeek = false;
  for (let index = 0; index < turns.length; index++) {
    const turn = turns[index];
    if (turn.role !== 'user') continue;
    const text = turn.content;
    if (/next week|susunod na linggo/i.test(text)) nextWeek = true;
    else if (/this week|ngayong linggo/i.test(text)) nextWeek = false;
    const name = readName(text);
    if (name) state.name = name;
    else if (!state.name && /^[\p{L}][\p{L}'’ -]{2,59}$/u.test(text.trim()) && /(?:full name|your name|what name|pangalan)/i.test(turns[index - 1]?.content ?? '') && !/\b(confirm|yes|no|hello|hi|consult|schedule|crm|details)\b/i.test(text)) state.name = text.trim();
    const contact = text.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0] ?? text.match(/(?<!\d)(?:\+?63|0)9\d(?:[\s-]?\d){8}(?!\d)/)?.[0];
    if (contact) state.contact = contact.replace(/\s/g, '');
    const messenger = text.match(/(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|m\.me|messenger\.com)\/[^\s,]+/i)?.[0];
    if (messenger) { state.messenger = messenger; state.contact ??= messenger; }
    const date = readDate(text, now, nextWeek);
    const time = readTime(text);
    if (date) state.date = date;
    if (time) state.time = time;
    if (/discuss.*(?:personally|meeting|consult|later|there)|details.*(?:later|personally|meeting|consult)|sa meeting|sa consultation/i.test(text)) state.details = 'Project details to be discussed during the consultation.';
  }
  // A changed name/contact/date/time needs a new summary and explicit confirmation.
  if (saved?.confirmedSummary && saved.confirmedSummary !== summaryKey(state)) {
    state.status = 'collecting';
    state.confirmedSummary = undefined;
  }
  return state;
}

export function consultationLabel(state: ConsultationState): string {
  return new Date(`${state.date}T${state.time}:00+08:00`).toLocaleString('en-US', { timeZone: CALENDAR_TIME_ZONE, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function consultationPlan(state: ConsultationState, currentMessage: string) {
  if (state.status === 'booked' && state.confirmedSummary === summaryKey(state)) return { action: 'reply' as const, reply: `Your consultation is already booked for ${consultationLabel(state)}, Philippine time. You can discuss the project details during the meeting. No need to send your details again.` };
  if (!state.date || !state.time) return { action: 'need_slot' as const };
  if (!state.name) return { action: 'reply' as const, reply: 'What name should I put on the consultation? Project details can wait until the meeting.' };
  if (!state.contact) return { action: 'reply' as const, reply: `Thanks, ${state.name}. What email, mobile number, or Messenger link can Reyca use to contact you? Just one is enough; project details are optional.` };
  if (state.status === 'awaiting_confirmation' && state.confirmedSummary === summaryKey(state) && isConfirmation(currentMessage)) return { action: 'book' as const };
  return { action: 'summary' as const, reply: `I have your details, ${state.name}.\n\nConsultation: ${consultationLabel(state)} (Philippine time)\nContact: ${state.contact}\nProject details: to be discussed during the meeting.\n\nThis slot is not booked yet. Reply Confirm to save it to Reyca's calendar. You don't need to send your details again.` };
}
