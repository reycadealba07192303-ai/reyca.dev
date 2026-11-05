export const CALENDAR_TIME_ZONE = 'Asia/Manila';
export const CONSULTATION_MINUTES = 60;
const DAY_MS = 86400000;
const OFFSET_MS = 8 * 3600000;

export type BusyInterval = { start: string; end: string };
export type AvailableDay = { date: string; label: string; starts: string[] };

export function availabilityReply(days: AvailableDay[], tagalog: boolean): string {
  if (!days.length) return tagalog
    ? 'Wala nang available na 1-hour consultation slot sa linggong ito ayon sa Google Calendar ni Reyca. Gusto mo bang i-check ang next week?'
    : "Reyca's Google Calendar has no remaining one-hour consultation slots in that week. Would you like to check another week?";
  const options = days.map(day => {
    const starts = [...new Set([day.starts[0], day.starts[Math.floor(day.starts.length / 2)], day.starts[day.starts.length - 1]])];
    const times = starts.map(time => {
      const [hour, minute] = time.split(':').map(Number);
      return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
    });
    return `${day.label}: ${times.join(', ')}`;
  }).join('\n');
  return tagalog
    ? `Base sa Google Calendar ni Reyca, ito ang ilang available consultation slots:\n\n${options}\n\nPhilippine time lahat; 1 hour bawat consultation. Aling araw at oras ang gusto mo? Iche-check ulit ang slot bago ma-confirm ang booking.`
    : `Here are some available consultation slots from Reyca's Google Calendar:\n\n${options}\n\nAll times are Philippine time; each consultation lasts one hour. Which day and time would you prefer? The slot will be rechecked before booking is confirmed.`;
}

export function localDate(now: Date): string {
  return new Date(now.getTime() + OFFSET_MS).toISOString().slice(0, 10);
}

export function weekBounds(now: Date, offset = 0) {
  const midnight = new Date(`${localDate(now)}T00:00:00+08:00`);
  const day = new Date(midnight.getTime() + OFFSET_MS).getUTCDay();
  const start = new Date(midnight.getTime() - ((day + 6) % 7) * DAY_MS + offset * 7 * DAY_MS);
  return { start, end: new Date(start.getTime() + 7 * DAY_MS) };
}

export function slotIsFree(start: Date, busy: BusyInterval[], now: Date): boolean {
  if (!Number.isFinite(start.getTime()) || start <= now) return false;
  const local = new Date(start.getTime() + OFFSET_MS);
  const minute = local.getUTCHours() * 60 + local.getUTCMinutes();
  if (local.getUTCDay() === 0 || local.getUTCDay() === 6 || minute < 9 * 60 || minute + CONSULTATION_MINUTES > 17 * 60) return false;
  const end = start.getTime() + CONSULTATION_MINUTES * 60000;
  return !busy.some(interval => start.getTime() < Date.parse(interval.end) && end > Date.parse(interval.start));
}

export function availableDays(now: Date, busy: BusyInterval[], offset = 0): AvailableDay[] {
  const { start } = weekBounds(now, offset);
  const days: AvailableDay[] = [];
  for (let day = 0; day < 5; day++) {
    const midnight = new Date(start.getTime() + day * DAY_MS);
    const date = localDate(midnight);
    const starts: string[] = [];
    // Offer half-hour start times, allowing a full one-hour consultation before closing.
    for (let minute = 9 * 60; minute <= 16 * 60; minute += 30) {
      const time = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
      if (slotIsFree(new Date(`${date}T${time}:00+08:00`), busy, now)) starts.push(time);
    }
    if (starts.length) days.push({ date, label: midnight.toLocaleDateString('en-US', { timeZone: CALENDAR_TIME_ZONE, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), starts });
  }
  return days;
}
