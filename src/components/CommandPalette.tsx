import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { TOP_ID, mailtoHref, profile, resumeHref, sections, telHref, vcardHref } from '../content';
import { focusTerminal } from '../lib/terminal';

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

const go = (id: string) => {
  window.location.hash = `#${id}`;
};

const LISTBOX_ID = 'palette-listbox';

/**
 * VS Code-style palette (Ctrl/⌘K, the top bar's Search pill, the status bar's
 * Ctrl K button): navigation and quick actions. Square sheet on surface, solid
 * scrim, no blur. Focus returns to whatever opened it.
 *
 * The dialog is mounted only while open, so its query and selection start empty
 * on every opening: a key typed straight after Ctrl+K can never land in an old
 * query (resetting state on open or close races with the next keystroke).
 */
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  return open ? <PaletteDialog onClose={onClose} /> : null;
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const actions = useMemo<PaletteAction[]>(
    () => [
      { id: 'nav-top', label: 'Go to top', group: 'Jump to', hint: '~', run: () => { go(TOP_ID); onClose(); } },
      ...sections.map((s) => ({
        id: `nav-${s.id}`,
        label: `Go to ${s.label}`,
        group: 'Jump to',
        hint: s.path,
        run: () => {
          go(s.id);
          onClose();
        },
      })),
      {
        id: 'act-copy',
        label: 'Copy email address',
        group: 'Contact',
        hint: profile.email,
        run: () => {
          navigator.clipboard?.writeText(profile.email).catch(() => {});
          setCopied(true);
          window.setTimeout(onClose, 700);
        },
      },
      { id: 'act-email', label: 'Send an email', group: 'Contact', run: () => { window.location.href = mailtoHref; onClose(); } },
      { id: 'act-call', label: 'Call', group: 'Contact', hint: profile.phone.display, run: () => { window.location.href = telHref; onClose(); } },
      { id: 'act-vcard', label: 'Save contact card', group: 'Contact', hint: '.vcf', run: () => { window.location.href = vcardHref; onClose(); } },
      {
        id: 'act-linkedin',
        label: 'Open LinkedIn',
        group: 'Contact',
        hint: profile.linkedin.label,
        run: () => { window.open(profile.linkedin.url, '_blank', 'noopener'); onClose(); },
      },
      {
        id: 'act-resume',
        label: 'Download résumé',
        group: 'Contact',
        hint: `PDF · ${profile.resume.sizeLabel}`,
        run: () => {
          const a = document.createElement('a');
          a.href = resumeHref;
          a.download = profile.resume.fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          onClose();
        },
      },
      { id: 'site-terminal', label: 'Open the terminal', group: 'Site', hint: '>_', run: () => { onClose(); focusTerminal(); } },
      {
        id: 'site-theme',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        group: 'Site',
        run: () => { toggleTheme(); onClose(); },
      },
    ],
    [theme, toggleTheme, onClose]
  );

  const filtered = useMemo(
    () => actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [actions, query]
  );

  // Options grouped under their headings; each keeps its index in `filtered`.
  const groups = useMemo(() => {
    const out: { name: string; items: { action: PaletteAction; index: number }[] }[] = [];
    filtered.forEach((action, index) => {
      const last = out[out.length - 1];
      if (last && last.name === action.group) last.items.push({ action, index });
      else out.push({ name: action.group, items: [{ action, index }] });
    });
    return out;
  }, [filtered]);

  // On open: note what had focus, make the rest of the page inert (a modal: screen-
  // reader cursors and Tab stay inside), and focus the input at once (not on a timer),
  // so keys typed right after Ctrl+K land in it. On close, in that order reversed:
  // the page comes back, then focus returns to the Search pill, the status bar button,
  // or wherever Ctrl K was pressed.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const others = Array.from(dialog?.parentElement?.children ?? []).filter(
      (el): el is HTMLElement => el !== dialog && el instanceof HTMLElement && !el.inert
    );
    others.forEach((el) => (el.inert = true));
    inputRef.current?.focus();
    return () => {
      others.forEach((el) => (el.inert = false));
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    document.getElementById(`palette-opt-${sel}`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

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

  const hasResults = filtered.length > 0;

  return (
    <div ref={dialogRef} className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-canvas/[0.72]" onClick={onClose} />
      <div className="relative mx-auto mt-[12vh] w-[min(600px,calc(100%-32px))] overflow-hidden border border-rule-strong bg-surface shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        {/* The input never shows an outline, so its row carries the focus mark: a 2px accent rule. */}
        <div className="flex items-center gap-2 border-b border-rule px-4 focus-within:shadow-[inset_0_-2px_0_rgb(var(--focus))]">
          <span className="select-none font-mono text-ink-3" aria-hidden="true">
            ›
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search…"
            role="combobox"
            aria-label="Search commands"
            aria-autocomplete="list"
            aria-expanded={hasResults}
            aria-controls={hasResults ? LISTBOX_ID : undefined}
            aria-activedescendant={hasResults ? `palette-opt-${sel}` : undefined}
            spellCheck={false}
            autoComplete="off"
            className="h-12 min-w-0 flex-1 bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none"
          />
          <kbd className="rounded border border-rule-strong px-1.5 font-mono text-[11.5px] text-ink-2">esc</kbd>
        </div>

        {hasResults ? (
          // Focus stays in the input; the options are pointed at with aria-activedescendant.
          <div id={LISTBOX_ID} className="max-h-80 overflow-y-auto py-2" role="listbox" aria-label="Commands">
            {groups.map((group, gi) => (
              <div key={group.name} role="presentation">
                <div id={`palette-group-${gi}`} className="mono-label px-4 pb-1 pt-2" aria-hidden="true">
                  {group.name}
                </div>
                <div role="group" aria-labelledby={`palette-group-${gi}`}>
                  {group.items.map(({ action, index }) => (
                    <div
                      key={action.id}
                      id={`palette-opt-${index}`}
                      role="option"
                      aria-selected={index === sel}
                      // Keep focus in the input when an option is clicked.
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => action.run()}
                      onMouseMove={() => setSel(index)}
                      className={`flex min-h-[40px] w-full cursor-pointer items-center justify-between gap-4 border-l-2 px-4 text-left text-sm transition-colors ${
                        index === sel ? 'border-accent-ink bg-accent-wash text-ink' : 'border-transparent text-ink-2'
                      }`}
                    >
                      <span>{action.label}</span>
                      {action.hint && <span className="truncate font-mono text-xs text-ink-3">{action.hint}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-4 py-3 font-mono text-sm text-ink-3" role="status">
            no matching commands
          </p>
        )}

        <div className="border-t border-rule px-4 py-2 font-mono text-[11.5px] text-ink-3">
          {copied ? <span className="text-ink">Copied</span> : '↑↓ navigate · ↵ run · esc close'}
        </div>
      </div>
    </div>
  );
}
