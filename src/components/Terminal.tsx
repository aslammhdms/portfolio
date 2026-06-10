import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const base = import.meta.env.BASE_URL;

type Kind = 'cmd' | 'out' | 'err';
interface Line {
  kind: Kind;
  text: string;
}

const SUGGESTIONS = ['help', 'projects', 'resume', 'sudo hire-me'];

/**
 * A real, typeable terminal for the hero. All content it surfaces also exists
 * in the page itself, so it's a delight layer — not the only path to anything.
 */
export default function Terminal() {
  const reduce = useReducedMotion();
  const { theme, toggleTheme } = useTheme();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  // While non-null, the intro `whoami` is auto-typing and the input is hidden.
  const [introTyped, setIntroTyped] = useState<string | null>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);

  // Auto-type `whoami` once on mount, then hand the prompt to the visitor.
  useEffect(() => {
    const intro = 'whoami';
    const finish = () => {
      setIntroTyped(null);
      setLines([
        { kind: 'cmd', text: intro },
        { kind: 'out', text: 'Aslam Muhammed — .NET Developer & IT Systems Engineer' },
        { kind: 'out', text: "this prompt is real. type 'help' to look around." },
      ]);
    };
    if (reduce) {
      finish();
      return;
    }
    setIntroTyped('');
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setIntroTyped(intro.slice(0, i));
      if (i >= intro.length) {
        window.clearInterval(t);
        window.setTimeout(finish, 350);
      }
    }, 90);
    return () => window.clearInterval(t);
  }, [reduce]);

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
    const err = (text: string) => out.push({ kind: 'err', text });

    switch (name) {
      case 'help':
        say('available commands:');
        say('  whoami · projects · stack · resume · contact');
        say('  linkedin · theme [dark|light] · clear');
        say('…and a few hidden ones. sudo at your own risk.');
        break;
      case 'whoami':
        say('Aslam Muhammed');
        say('.NET Developer & IT Systems Engineer — Abu Dhabi');
        say('4+ yrs · enterprise retail · full-stack · infrastructure');
        break;
      case 'projects':
      case 'work':
        say('almadinahypermarket.ae   live retail site (React)');
        say('helpdesk-portal          IT ops platform, 80+ outlets (.NET 10)');
        say('madina-insight           competitor pricing intel (.NET 10)');
        say('assetcore                asset lifecycle + audit (.NET 10)');
        say('retail-mobile            Zebra price-checker (React Native)');
        say('skien.suite              ERP for SMEs (.NET 6)');
        say('→ scrolling to work…');
        window.setTimeout(() => {
          window.location.hash = '#projects';
        }, 600);
        break;
      case 'stack':
      case 'skills':
        say('.NET Core / .NET 10 · C# · ASP.NET MVC · EF Core');
        say('SQL Server · T-SQL · REST · React · React Native');
        say('Azure DevOps · CI/CD · Docker · IIS · Git');
        break;
      case 'resume':
      case 'cv': {
        say('fetching Aslam_Muhammed_Resume.pdf … saved ✓');
        const a = document.createElement('a');
        a.href = `${base}doc/Aslam_Muhammed_Resume.pdf`;
        a.download = 'Aslam_Muhammed_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        break;
      }
      case 'contact':
      case 'email':
        say('email   aslammhdms@gmail.com');
        say('phone   +971 50 802 4425');
        say('place   Abu Dhabi, UAE');
        break;
      case 'linkedin':
        say('opening linkedin.com/in/aslammhdms ↗');
        window.open('https://www.linkedin.com/in/aslammhdms', '_blank', 'noopener');
        break;
      case 'theme': {
        const want = rest[0];
        if (want === 'dark' || want === 'light') {
          if (want !== theme) toggleTheme();
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
          say('access granted ✓ — excellent decision.');
          say('opening mail client…');
          window.setTimeout(() => {
            window.location.href = 'mailto:aslammhdms@gmail.com?subject=Let%27s%20talk';
          }, 900);
        } else {
          err('visitor is not in the sudoers file. this incident will be reported.');
        }
        break;
      }
      case 'ls':
        say('about/   stack/   work/   contact/   resume.pdf');
        break;
      case 'pwd':
        say('~/abu-dhabi-uae');
        break;
      case 'uptime':
        say('4+ years in production · zero unplanned downtime');
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
      className="card overflow-hidden font-mono text-[13px] leading-relaxed"
      role="group"
      aria-label="Interactive terminal — type help for commands"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-elevated px-4 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <span className="ml-1 text-xs text-faint">aslam@auh: ~</span>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-faint">interactive</span>
      </div>

      {/* Output + prompt */}
      <div
        ref={outRef}
        className="h-44 space-y-0.5 overflow-y-auto px-4 py-3"
        role="log"
        aria-live="polite"
      >
        {lines.map((l, i) =>
          l.kind === 'cmd' ? (
            <p key={i} className="text-fg">
              <span className="select-none text-signal">$ </span>
              {l.text}
            </p>
          ) : (
            <p
              key={i}
              className={`whitespace-pre-wrap ${l.kind === 'err' ? 'text-red-400' : 'text-muted'}`}
            >
              {l.text}
            </p>
          )
        )}

        {introTyped !== null ? (
          <p className="text-fg">
            <span className="select-none text-signal">$ </span>
            {introTyped}
            <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-signal" aria-hidden="true" />
          </p>
        ) : (
          <div className="flex items-center gap-0">
            <span className="select-none text-signal">$&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal command input"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="flex-1 bg-transparent text-fg caret-accent outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        )}
      </div>

      {/* Tap-to-run suggestions (esp. for mobile) */}
      <div className="flex flex-wrap gap-1.5 border-t border-line bg-elevated/50 px-3 py-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={(e) => {
              e.stopPropagation();
              run(s);
              inputRef.current?.focus();
            }}
            className="chip transition-colors hover:border-accent/50 hover:text-fg"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
