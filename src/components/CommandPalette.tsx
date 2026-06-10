import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const base = import.meta.env.BASE_URL;

interface PaletteAction {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

/** VS Code-style ⌘K palette: navigation + quick actions. */
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<PaletteAction[]>(
    () => [
      { id: 'nav-home', label: 'Go to Home', group: 'Navigate', hint: '~', run: () => { window.location.hash = '#home'; onClose(); } },
      { id: 'nav-about', label: 'Go to About', group: 'Navigate', hint: '~/about', run: () => { window.location.hash = '#about'; onClose(); } },
      { id: 'nav-stack', label: 'Go to Stack', group: 'Navigate', hint: '~/stack', run: () => { window.location.hash = '#skills'; onClose(); } },
      { id: 'nav-work', label: 'Go to Work', group: 'Navigate', hint: '~/work', run: () => { window.location.hash = '#projects'; onClose(); } },
      { id: 'nav-contact', label: 'Go to Contact', group: 'Navigate', hint: '~/contact', run: () => { window.location.hash = '#contact'; onClose(); } },
      {
        id: 'act-theme',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        group: 'Actions',
        run: () => { toggleTheme(); onClose(); },
      },
      {
        id: 'act-copy',
        label: 'Copy email address',
        group: 'Actions',
        hint: 'aslammhdms@gmail.com',
        run: () => {
          navigator.clipboard?.writeText('aslammhdms@gmail.com').catch(() => {});
          setCopied(true);
          window.setTimeout(onClose, 700);
        },
      },
      {
        id: 'act-resume',
        label: 'Download résumé',
        group: 'Actions',
        hint: 'pdf',
        run: () => {
          const a = document.createElement('a');
          a.href = `${base}doc/Aslam_Muhammed_Resume.pdf`;
          a.download = 'Aslam_Muhammed_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          onClose();
        },
      },
      {
        id: 'act-linkedin',
        label: 'Open LinkedIn ↗',
        group: 'Actions',
        run: () => { window.open('https://www.linkedin.com/in/aslammhdms', '_blank', 'noopener'); onClose(); },
      },
      {
        id: 'act-email',
        label: 'Send an email',
        group: 'Actions',
        run: () => { window.location.href = 'mailto:aslammhdms@gmail.com'; onClose(); },
      },
    ],
    [theme, toggleTheme, onClose]
  );

  const filtered = useMemo(
    () => actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [actions, query]
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setSel(0);
      setCopied(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    document.getElementById(`palette-opt-${sel}`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[sel]?.run();
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  let lastGroup = '';

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-canvas/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-[15vh] w-[min(560px,92vw)] overflow-hidden rounded-card border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4">
          <span className="select-none font-mono text-signal">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            spellCheck={false}
            autoComplete="off"
            className="h-12 flex-1 bg-transparent font-mono text-sm text-fg outline-none placeholder:text-faint focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <kbd className="chip">esc</kbd>
        </div>

        <ul className="max-h-72 overflow-y-auto py-2" role="listbox" aria-label="Commands">
          {filtered.length === 0 && (
            <li className="px-4 py-3 font-mono text-sm text-faint">no matching commands</li>
          )}
          {filtered.map((a, i) => {
            const header = a.group !== lastGroup ? a.group : null;
            lastGroup = a.group;
            return (
              <li key={a.id} id={`palette-opt-${i}`} role="option" aria-selected={i === sel}>
                {header && <p className="mono-label px-4 pb-1 pt-2">{header}</p>}
                <button
                  onClick={() => a.run()}
                  onMouseEnter={() => setSel(i)}
                  className={`flex w-full items-center justify-between gap-4 border-l-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === sel
                      ? 'border-accent bg-elevated text-fg'
                      : 'border-transparent text-muted'
                  }`}
                >
                  <span>{a.label}</span>
                  {a.hint && <span className="font-mono text-xs text-faint">{a.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-line px-4 py-2 font-mono text-[11px] text-faint">
          {copied ? <span className="text-signal">email copied ✓</span> : '↑↓ navigate · ↵ run · esc close'}
        </div>
      </div>
    </div>
  );
}
