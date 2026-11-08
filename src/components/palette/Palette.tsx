import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { usePrefs } from '../../lib/prefs';
import { fuzzy } from '../../lib/fuzzy';
import { useTheme } from '../../contexts/ThemeContext';
import { buildItems, pushRecent, readRecent, type PaletteGroup, type PaletteItem } from './items';

interface PaletteProps {
  onClose: () => void;
}

interface Row {
  item: PaletteItem;
  group: PaletteGroup;
  /** Matched character positions in the label, for highlighting. */
  indices: number[];
}

const GROUP_ORDER: PaletteGroup[] = ['Recent', 'Jump to', 'Contact', 'Skills', 'Site'];
const LISTBOX_ID = 'palette-listbox';
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/** The label with its matched characters picked out in accent ink. */
function Highlight({ text, indices }: { text: string; indices: number[] }) {
  if (indices.length === 0) return <>{text}</>;
  const hit = new Set(indices);
  const parts: { text: string; on: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    const on = hit.has(i);
    const last = parts[parts.length - 1];
    if (last && last.on === on) last.text += text[i];
    else parts.push({ text: text[i], on });
  }
  return (
    <>
      {parts.map((p, i) =>
        p.on ? (
          <mark key={i} className="pal-hit">
            {p.text}
          </mark>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        )
      )}
    </>
  );
}

/**
 * The command palette (Ctrl/⌘K, the Search pill, the status bar). Mounted only while
 * open, so its query and selection start empty on every opening. A proper combobox
 * and listbox: focus stays in the input and the options are pointed at with
 * aria-activedescendant. Groups come from src/content; a hand-written fuzzy scorer
 * ranks them. Copy actions say 'Copied' in place and keep the palette open.
 */
export default function Palette({ onClose }: PaletteProps) {
  const { theme } = useTheme();
  const prefs = usePrefs();
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [flash, setFlash] = useState<{ id: string; ok: boolean } | null>(null);
  const [recent] = useState(readRecent);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const flashTimer = useRef(0);

  const items = useMemo(() => buildItems({ theme, prefs }), [theme, prefs]);

  const rows = useMemo<Row[]>(() => {
    const q = norm(query);
    if (!q) {
      const byId = new Map(items.map((i) => [i.id, i]));
      const recents = recent.map((id) => byId.get(id)).filter((i): i is PaletteItem => !!i && !i.exact);
      return [
        ...recents.map<Row>((item) => ({ item, group: 'Recent', indices: [] })),
        ...items.filter((i) => !i.exact).map<Row>((item) => ({ item, group: item.group, indices: [] })),
      ];
    }
    const out: (Row & { score: number })[] = [];
    for (const item of items) {
      if (item.exact) {
        if (item.exact.includes(q)) out.push({ item, group: item.group, indices: [], score: 1000 });
        continue;
      }
      const onLabel = fuzzy(q, item.label);
      if (onLabel) {
        // A match in the label always outranks one in the extra words or the hint.
        out.push({ item, group: item.group, indices: onLabel.indices, score: onLabel.score + 300 });
        continue;
      }
      const onWords = item.keywords ? fuzzy(q, item.keywords) : null;
      const onHint = item.hint ? fuzzy(q, item.hint) : null;
      const best = Math.max(onWords?.score ?? -Infinity, onHint?.score ?? -Infinity);
      if (best > -Infinity) out.push({ item, group: item.group, indices: [], score: best });
    }
    // The group holding the best match comes first, so Enter runs the best match; inside a
    // group the best match comes first too.
    const top = new Map<PaletteGroup, number>();
    out.forEach((r) => top.set(r.group, Math.max(top.get(r.group) ?? -Infinity, r.score)));
    return out
      .sort(
        (a, b) =>
          (top.get(b.group) ?? 0) - (top.get(a.group) ?? 0) ||
          GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) ||
          b.score - a.score
      )
      .map(({ item, group, indices }) => ({ item, group, indices }));
  }, [items, query, recent]);

  const groups = useMemo(() => {
    const out: { name: PaletteGroup; rows: { row: Row; index: number }[] }[] = [];
    rows.forEach((row, index) => {
      const last = out[out.length - 1];
      if (last && last.name === row.group) last.rows.push({ row, index });
      else out.push({ name: row.group, rows: [{ row, index }] });
    });
    return out;
  }, [rows]);

  // A modal: the rest of the page goes inert while it is open, focus lands in the input at once
  // (so keys typed right after Ctrl+K are not lost) and returns to the opener on close.
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
      window.clearTimeout(flashTimer.current);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    document.getElementById(`palette-opt-${sel}`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const activate = (row: Row | undefined) => {
    if (!row) return;
    const { item } = row;
    pushRecent(item.id);
    if (item.copy) {
      // Confirm in place and stay open.
      void item.copy().then((ok) => {
        setFlash({ id: `${row.group}:${item.id}`, ok });
        window.clearTimeout(flashTimer.current);
        flashTimer.current = window.setTimeout(() => setFlash(null), 1600);
      });
      return;
    }
    onClose();
    // After the palette has unmounted and handed focus back, so a drawer remembers the right opener.
    window.requestAnimationFrame(() => item.run?.());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, rows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Home' && e.ctrlKey) {
      setSel(0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(rows[sel]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // focus stays inside the dialog
    }
  };

  const hasRows = rows.length > 0;
  const flashed = flash ? flash : null;

  return (
    <div ref={dialogRef} className="pal" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="pal-scrim" onClick={onClose} />
      <div className="pal-sheet">
        <div className="pal-field">
          <span className="pal-chevron" aria-hidden="true">
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
            placeholder="Jump to, copy, search a skill, run a command…"
            role="combobox"
            aria-label="Search commands"
            aria-autocomplete="list"
            aria-expanded={hasRows}
            aria-controls={hasRows ? LISTBOX_ID : undefined}
            aria-activedescendant={hasRows ? `palette-opt-${sel}` : undefined}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            enterKeyHint="go"
          />
          <kbd className="pal-key">esc</kbd>
        </div>

        {hasRows ? (
          <div id={LISTBOX_ID} className="pal-list" role="listbox" aria-label="Commands">
            {groups.map((group, gi) => (
              <div key={group.name} role="presentation">
                <div id={`palette-group-${gi}`} className="pal-group" aria-hidden="true">
                  {group.name}
                </div>
                <div role="group" aria-labelledby={`palette-group-${gi}`}>
                  {group.rows.map(({ row, index }) => {
                    const key = `${row.group}:${row.item.id}`;
                    const on = index === sel;
                    return (
                      <div
                        key={key}
                        id={`palette-opt-${index}`}
                        role="option"
                        aria-selected={on}
                        className="pal-row"
                        data-selected={on ? '' : undefined}
                        // Keep focus in the input when an option is clicked.
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSel(index);
                          activate(row);
                        }}
                        onMouseMove={() => sel !== index && setSel(index)}
                      >
                        <span className="pal-label">
                          <Highlight text={row.item.label} indices={row.indices} />
                        </span>
                        {flashed?.id === key ? (
                          <span className="pal-hint pal-copied">{flashed.ok ? 'Copied' : 'Not copied'}</span>
                        ) : row.item.keys ? (
                          <kbd className="pal-hint pal-keys" data-keycap={row.item.id === 'terminal' ? 'terminal' : row.item.id === 'shortcuts' ? 'help' : undefined}>
                            {row.item.keys}
                          </kbd>
                        ) : (
                          row.item.hint && <span className="pal-hint">{row.item.hint}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="pal-empty">
            Nothing matches “{query}”. Try a section, a project, a skill or <b>terminal</b>.
          </p>
        )}

        <p className="sr-only" role="status">
          {hasRows ? `${rows.length} result${rows.length === 1 ? '' : 's'}` : 'No results'}
          {flashed ? (flashed.ok ? '. Copied.' : '. Could not copy.') : ''}
        </p>
        <div className="pal-foot" aria-hidden="true">
          <span>↑↓ move</span>
          <span>↵ run</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
