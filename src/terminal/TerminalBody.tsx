import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useReducedMotion } from '../lib/prefs';
import { INTRO_COMMAND, append, arm, clearLines, finishIntro, getTerm, setCols, submit, useTerm, type Line } from './store';
import { complete } from './engine';
import { FontsSample, Neofetch } from './widgets';

interface TerminalBodyProps {
  placement: 'band' | 'drawer';
  /** The element whose visibility starts the auto-typed intro (the band). */
  introTarget?: HTMLElement | null;
}

function LogLine({ line }: { line: Line }) {
  switch (line.kind) {
    case 'cmd':
      return (
        <p className="t-line t-cmd">
          <span className="t-prompt" aria-hidden="true">
            ${' '}
          </span>
          {line.text}
        </p>
      );
    case 'err':
      return <p className="t-line t-err">{line.text}</p>;
    case 'dim':
      return <p className="t-line t-dim">{line.text}</p>;
    case 'pre':
      return <p className="t-line t-pre">{line.text}</p>;
    case 'widget':
      return <div className="t-line">{line.widget === 'neofetch' ? <Neofetch /> : <FontsSample />}</div>;
    default:
      return <p className="t-line t-out">{line.text}</p>;
  }
}

/**
 * The interactive half of the terminal, used by both placements. The log is a
 * role=log that stays silent until the visitor reaches into the terminal (focus or
 * pointer), so the auto-typed intro is never announced; after that it announces the
 * output of their commands. History is the session's, shared with the other placement.
 */
export default function TerminalBody({ placement, introTarget }: TerminalBodyProps) {
  const term = useTerm();
  const reduce = useReducedMotion();
  const [input, setInput] = useState('');
  const [histIdx, setHistIdx] = useState(-1);
  const [typed, setTyped] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const lastTab = useRef('');
  const active = placement === 'drawer' ? term.drawerOpen : !term.drawerOpen;

  // The auto-typed `whoami` runs once, when the band is half visible; reduced motion prints it at once.
  useEffect(() => {
    if (placement !== 'band' || !introTarget || getTerm().introDone) return;
    let timer = 0;
    let done = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || getTerm().introDone) return;
        observer.disconnect();
        if (reduce) {
          finishIntro();
          return;
        }
        let i = 0;
        setTyped('');
        timer = window.setInterval(() => {
          if (getTerm().introDone) {
            window.clearInterval(timer);
            setTyped(null);
            return;
          }
          i += 1;
          setTyped(INTRO_COMMAND.slice(0, i));
          if (i >= INTRO_COMMAND.length) {
            window.clearInterval(timer);
            done = window.setTimeout(() => {
              setTyped(null);
              finishIntro();
            }, 350);
          }
        }, 90);
      },
      { threshold: 0.5 }
    );
    observer.observe(introTarget);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(done);
    };
  }, [placement, introTarget, reduce]);

  // Keep the newest line in view.
  useLayoutEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [term.lines, typed]);

  // How many characters fit on a line, so `work` can choose a table or a list.
  useEffect(() => {
    const el = logRef.current;
    const probe = measureRef.current;
    if (!el || !probe || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      if (!active) return;
      const charW = probe.getBoundingClientRect().width / 10;
      const style = getComputedStyle(el);
      const inner = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      if (charW > 0 && inner > 0) setCols(Math.floor(inner / charW));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    const { history } = getTerm();
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = input;
      setInput('');
      setHistIdx(-1);
      void submit(value);
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
    } else if (e.key === 'Tab' && !e.shiftKey && input.trim() !== '') {
      // Complete the command or its first argument; a second Tab lists the candidates.
      e.preventDefault();
      const c = complete(input);
      if (c.value !== input) {
        setInput(c.value);
        lastTab.current = '';
      } else if (c.options.length > 1 && lastTab.current === input) {
        append({ kind: 'dim', text: c.options.join('   ') });
      } else {
        lastTab.current = input;
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      clearLines();
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      setInput('');
      setHistIdx(-1);
    }
  };

  return (
    <div
      className="t-body"
      onClick={(e) => {
        // A click on the empty log focuses the prompt, unless it is a text selection or a control.
        if (window.getSelection()?.toString()) return;
        if ((e.target as HTMLElement).closest('input, button, a, label')) return;
        inputRef.current?.focus({ preventScroll: true });
      }}
      onFocusCapture={() => setLive(true)}
      onPointerDownCapture={() => {
        setLive(true);
        arm();
      }}
    >
      <div ref={logRef} className="t-log" role="log" aria-live={live || term.interacted ? 'polite' : 'off'} aria-label="Terminal output" tabIndex={0}>
        <span ref={measureRef} className="t-measure" aria-hidden="true">
          0000000000
        </span>
        {term.lines.map((line) => (
          <LogLine key={line.id} line={line} />
        ))}
        {typed !== null ? (
          <p className="t-line t-cmd">
            <span className="t-prompt" aria-hidden="true">
              ${' '}
            </span>
            {typed}
            <span className="t-caret" aria-hidden="true" />
          </p>
        ) : (
          <label className="t-line t-input">
            <span className="t-prompt" aria-hidden="true">
              ${' '}
            </span>
            <input
              ref={inputRef}
              id={`term-input-${placement}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal command"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              enterKeyHint="go"
            />
          </label>
        )}
      </div>
    </div>
  );
}
