import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { TERMINAL_FOCUS_EVENT } from '../lib/terminal';
import { featuredProjects, alsoBuilt, mailtoHref, profile, resumeHref, skillGroups, telHref, toolbox } from '../content';

type Kind = 'cmd' | 'out' | 'err';
interface Line {
  kind: Kind;
  text: string;
}

const SUGGESTIONS = ['help', 'work', 'resume', 'sudo hire-me'];
const INTRO = 'whoami';
const INTRO_LINES: Line[] = [
  { kind: 'cmd', text: INTRO },
  { kind: 'out', text: `${profile.name} — ${profile.title}` },
  { kind: 'out', text: "this prompt is real. type 'help' to look around." },
];

/**
 * A real, typeable terminal (the Prompt band, after Work). Everything it shows
 * also exists on the page, so it is a delight layer, never the only path. The
 * output and the input render the same on the server and the first client
 * render; the intro types itself after mount.
 */
export default function Terminal() {
  const reduce = usePrefersReducedMotion();
  const { theme, setTheme, toggleTheme } = useTheme();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  // While non-null, the intro `whoami` is auto-typing and the input is hidden.
  const [introTyped, setIntroTyped] = useState<string | null>('');
  const [wantsFocus, setWantsFocus] = useState(false);
  // The log stays silent until the visitor reaches into the terminal (focus or pointer),
  // so the auto-typed intro is never announced; after that it announces their commands.
  const [live, setLive] = useState(false);
  const goLive = () => setLive(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  // Set when the visitor asks for the prompt before the intro has finished typing.
  const introSkipped = useRef(false);

  // Auto-type `whoami` once, then hand the prompt to the visitor.
  useEffect(() => {
    const finish = () => {
      setIntroTyped(null);
      setLines((prev) => (prev.length ? prev : INTRO_LINES));
    };
    if (reduce || introSkipped.current) {
      finish();
      return;
    }
    let i = 0;
    let doneTimer = 0;
    const timer = window.setInterval(() => {
      if (introSkipped.current) {
        window.clearInterval(timer);
        return;
      }
      i += 1;
      setIntroTyped(INTRO.slice(0, i));
      if (i >= INTRO.length) {
        window.clearInterval(timer);
        doneTimer = window.setTimeout(finish, 350);
      }
    }, 90);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(doneTimer);
    };
  }, [reduce]);

  // The status bar's '>_' button (and later the palette) asks for focus.
  useEffect(() => {
    const onFocusRequest = () => {
      introSkipped.current = true;
      setIntroTyped(null);
      setLines((prev) => (prev.length ? prev : INTRO_LINES));
      setWantsFocus(true);
    };
    window.addEventListener(TERMINAL_FOCUS_EVENT, onFocusRequest);
    return () => window.removeEventListener(TERMINAL_FOCUS_EVENT, onFocusRequest);
  }, []);

  useEffect(() => {
    if (wantsFocus && introTyped === null) {
      inputRef.current?.focus({ preventScroll: true });
      setWantsFocus(false);
    }
  }, [wantsFocus, introTyped]);

  // Keep the latest line visible.
  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, introTyped]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [...h, cmd].slice(-50));
    setHistIdx(-1);

    const lower = cmd.toLowerCase();
    const [name, ...rest] = lower.split(/\s+/);

    if (name === 'clear' || name === 'cls') {
      setLines([]);
      return;
    }

    const out: Line[] = [{ kind: 'cmd', text: cmd }];
    const say = (text: string) => out.push({ kind: 'out', text });
    const err = (text: string) => out.push({ kind: 'err', text: `error: ${text}` });

    switch (name) {
      case 'help':
        say('available commands:');
        say('  whoami · work · stack · resume · contact');
        say('  linkedin · theme [dark|light] · clear');
        say('…and a few hidden ones. sudo at your own risk.');
        break;
      case 'whoami':
        say(profile.name);
        say(`${profile.title} — ${profile.location.city}`);
        say(`${profile.yearsOfExperience} years · ERP, retail and internal systems`);
        break;
      case 'projects':
      case 'work': {
        const width = Math.max(...[...featuredProjects, ...alsoBuilt].map((p) => p.id.length)) + 3;
        [...featuredProjects, ...alsoBuilt].forEach((p) => say(`${p.id.padEnd(width)}${p.name} (${p.years})`));
        say('→ scrolling to work…');
        window.setTimeout(() => {
          window.location.hash = '#work';
        }, 600);
        break;
      }
      case 'stack':
      case 'skills': {
        // From src/content/skills.ts, so the terminal and the Stack section never drift apart.
        const width = Math.max(...skillGroups.map((g) => g.title.length)) + 3;
        skillGroups.forEach((g) => say(`${g.title.toLowerCase().padEnd(width)}${g.skills.map((s) => s.name).join(' · ')}`));
        say(`${'toolbox'.padEnd(width)}${toolbox.join(' · ')}`);
        break;
      }
      case 'resume':
      case 'cv': {
        say(`fetching ${profile.resume.fileName} …`);
        const a = document.createElement('a');
        a.href = resumeHref;
        a.download = profile.resume.fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        break;
      }
      case 'contact':
      case 'email':
        say(`email   ${profile.email}`);
        say(`phone   ${profile.phone.display}`);
        say(`place   ${profile.location.short}`);
        break;
      case 'linkedin':
        say(`opening ${profile.linkedin.label} …`);
        window.open(profile.linkedin.url, '_blank', 'noopener');
        break;
      case 'call':
        say(`calling ${profile.phone.display} …`);
        window.location.href = telHref;
        break;
      case 'theme': {
        const want = rest[0];
        if (want === 'dark' || want === 'light') {
          setTheme(want);
          say(`theme → ${want}`);
        } else {
          toggleTheme();
          say(`theme → ${theme === 'dark' ? 'light' : 'dark'}`);
        }
        break;
      }
      case 'sudo': {
        if (rest.join(' ').includes('hire')) {
          say('[sudo] password for visitor: ********');
          say('access granted — excellent decision.');
          say('opening mail client…');
          window.setTimeout(() => {
            window.location.href = mailtoHref;
          }, 900);
        } else {
          say('visitor is not in the sudoers file. This incident will be reported.');
        }
        break;
      }
      case 'ls':
        say('work/   experience/   stack/   contact/   resume.pdf');
        break;
      case 'pwd':
        say('~/abu-dhabi-uae');
        break;
      case 'uptime':
        say(`${profile.yearsOfExperience} years shipping production systems`);
        break;
      case 'echo':
        say(cmd.slice(4).trim());
        break;
      default:
        err(`command not found: ${name} — try 'help'`);
    }

    setLines((prev) => [...prev, ...out].slice(-120));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[history.length - 1 - next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput('');
        return;
      }
      const next = histIdx - 1;
      setHistIdx(next);
      setInput(history[history.length - 1 - next]);
    }
  };

  return (
    <div
      // The input itself has no outline, so the whole panel shows the focus ring.
      className="border border-rule bg-surface font-mono text-[13.5px] leading-[1.6] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[rgb(var(--focus))]"
      role="group"
      aria-label="Interactive terminal. Type help for commands."
      onClick={() => inputRef.current?.focus()}
      onFocus={goLive}
      onPointerDown={goLive}
    >
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2 text-[11.5px] text-ink-3">
        <span>aslam@auh ~</span>
        <span>type help</span>
      </div>

      <div
        ref={outRef}
        className="h-44 space-y-0.5 overflow-y-auto px-4 py-3"
        role="log"
        aria-live={live ? 'polite' : 'off'}
      >
        {lines.map((l, i) =>
          l.kind === 'cmd' ? (
            <p key={i} className="text-ink">
              <span className="select-none text-ink-3">$ </span>
              {l.text}
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap text-ink-2">
              {l.text}
            </p>
          )
        )}

        {introTyped !== null ? (
          <p className="text-ink">
            <span className="select-none text-ink-3">$ </span>
            {introTyped}
            <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-accent-ink" aria-hidden="true" />
          </p>
        ) : (
          <div className="flex items-center">
            <span className="select-none text-ink-3">$&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal command"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="min-w-0 flex-1 bg-transparent text-ink caret-accent-ink outline-none focus-visible:outline-none"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-rule px-3 py-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              run(s);
              inputRef.current?.focus();
            }}
            className="chip min-h-[32px] transition-colors hover:border-rule-strong hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
