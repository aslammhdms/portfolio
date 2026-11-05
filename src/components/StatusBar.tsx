import { useEffect, useRef, useState } from 'react';
import { profile, sections } from '../content';
import useActiveSection from '../hooks/useActiveSection';
import useActiveWorkRow from '../hooks/useActiveWorkRow';
import { abuDhabiTime, offsetFromVisitor, type ClockParts } from '../lib/time';
import { isApplePlatform } from '../lib/platform';
import { focusTerminal } from '../lib/terminal';
import { CommandIcon } from './icons';

interface StatusBarProps {
  onOpenPalette: () => void;
}

/** Saved when the visitor hides the clock (WCAG 2.2.2: auto-updating content can be hidden). */
const CLOCK_KEY = 'am:clock';

/**
 * Fixed, tmux-style bar. Left: a path that follows the section in view and, in
 * Work, the project row being read (~/work/helpdesk). Right: the Abu Dhabi clock
 * (a button with a small popover: the time difference and a Hide clock toggle),
 * a '>_' button for the terminal and a Ctrl K button for the palette. No uptime,
 * host or availability. Everything time-based renders after mount; only the
 * ticking digits are hidden from screen readers. The phone and reduced-motion
 * variants (HH:MM, no 'GST') are pure CSS, so the prerendered bar already has the
 * right shape on every screen.
 */
export default function StatusBar({ onOpenPalette }: StatusBarProps) {
  const active = useActiveSection();
  const activeRow = useActiveWorkRow();
  const [time, setTime] = useState<ClockParts | null>(null);
  const [clockOn, setClockOn] = useState(true);
  const [apple, setApple] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const [offset, setOffset] = useState<string | null>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(CLOCK_KEY) === 'hidden') setClockOn(false);
    } catch {
      /* storage blocked: keep the default */
    }
  }, []);

  useEffect(() => {
    if (!clockOn) return;
    const tick = () => setTime(abuDhabiTime());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [clockOn]);

  useEffect(() => setApple(isApplePlatform()), []);

  // The popover closes on Escape or a click/focus outside it.
  useEffect(() => {
    if (!popOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopOpen(false);
    };
    const onPointer = (e: Event) => {
      if (!clockRef.current?.contains(e.target as Node)) setPopOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('focusin', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('focusin', onPointer);
    };
  }, [popOpen]);

  const toggleClock = () => {
    const next = !clockOn;
    setClockOn(next);
    try {
      if (next) localStorage.removeItem(CLOCK_KEY);
      else localStorage.setItem(CLOCK_KEY, 'hidden');
    } catch {
      /* storage blocked: the choice lasts for this page view */
    }
  };

  const section = sections.find((s) => s.id === active);
  const showTime = clockOn && time;
  // Inside Work, the path names the project row being read: ~/work/helpdesk.
  const row = section?.id === 'work' ? activeRow : null;

  return (
    <div className="statusbar" role="region" aria-label="Status bar">
      <div className="shell statusbar-inner">
        <span className="sb-path">
          {section ? (
            row ? (
              <>
                ~/{section.id}/<span className="cur">{row}</span>
              </>
            ) : (
              <>
                ~/<span className="cur">{section.id}</span>
              </>
            )
          ) : (
            <span className="cur">~</span>
          )}
        </span>

        <div className="sb-right">
          <div className="sb-clock-wrap" ref={clockRef}>
            <button
              type="button"
              className="sb-btn sb-clock"
              aria-expanded={popOpen}
              aria-controls="sb-clock-pop"
              onClick={() => {
                // Worked out on open (the visitor's offset can change with DST), and in the
                // same update as the popover, so it never paints without the difference.
                setOffset(offsetFromVisitor());
                setPopOpen((o) => !o);
              }}
            >
              <span className="sb-clock-label">
                {profile.timeZone.code}
                {clockOn && (
                  <>
                    {' '}
                    <span className="sb-digits" aria-hidden="true">
                      {time && (
                        <>
                          {time.hh}:{time.mm}
                          <span className="sb-secs">:{time.ss}</span>
                        </>
                      )}
                    </span>
                  </>
                )}
                <span className="sb-tz"> {profile.timeZone.abbr}</span>
              </span>
              {showTime && <span className="sr-only">{`${time.hh}:${time.mm} in Abu Dhabi`}</span>}
            </button>
            <div id="sb-clock-pop" className="sb-pop" hidden={!popOpen}>
              <p role="status">
                {profile.timeZone.label}
                {offset && ` · ${offset}`}
              </p>
              <button type="button" className="sb-pop-toggle" aria-pressed={!clockOn} onClick={toggleClock}>
                Hide clock
              </button>
            </div>
          </div>

          <button type="button" className="sb-btn" aria-label="Open the terminal" onClick={focusTerminal}>
            &gt;_
          </button>

          <button
            type="button"
            className="sb-btn sb-palette"
            aria-label={`Search (${apple ? '⌘' : 'Ctrl'} K)`}
            aria-haspopup="dialog"
            onClick={onOpenPalette}
          >
            {apple ? (
              <>
                <CommandIcon />K
              </>
            ) : (
              'Ctrl K'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
