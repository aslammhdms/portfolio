import { profile } from '../content';

/**
 * Abu Dhabi time helpers. Only call these after mount (in effects or event
 * handlers): they read the clock and the visitor's time zone, which would make
 * the prerendered HTML disagree with the first client render.
 */

let formatter: Intl.DateTimeFormat | null = null;

function getFormatter(): Intl.DateTimeFormat {
  formatter ??= new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: profile.timeZone.iana,
  });
  return formatter;
}

export interface ClockParts {
  hh: string;
  mm: string;
  ss: string;
  hour: number;
}

export function abuDhabiTime(date = new Date()): ClockParts {
  const parts = getFormatter().formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '00';
  const hh = get('hour') === '24' ? '00' : get('hour');
  return { hh, mm: get('minute'), ss: get('second'), hour: Number(hh) };
}

/**
 * 'N h ahead of you' / 'N h behind you' from the visitor's own offset, or null
 * when the visitor is already on Abu Dhabi time.
 */
export function offsetFromVisitor(date = new Date()): string | null {
  const visitorOffset = -date.getTimezoneOffset(); // minutes east of UTC
  const diff = profile.timeZone.utcOffsetMinutes - visitorOffset;
  if (diff === 0) return null;
  const abs = Math.abs(diff);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  const amount = [hours ? `${hours} h` : '', minutes ? `${minutes} min` : ''].filter(Boolean).join(' ');
  return `${amount} ${diff > 0 ? 'ahead of' : 'behind'} you`;
}
