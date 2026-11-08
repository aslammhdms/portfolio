import {
  TOP_ID,
  mailtoHref,
  profile,
  profileSummary,
  projects,
  resumeHref,
  sections,
  stackGroups,
  telHref,
  vcardHref,
  workAnchorId,
} from '../../content';
import { copyText } from '../../lib/clipboard';
import { motionReduced, setPref, type Prefs } from '../../lib/prefs';
import { jumpTo, konami, showSkill, site, toast } from '../../lib/site';
import { openDrawer } from '../../terminal/store';

export type PaletteGroup = 'Recent' | 'Jump to' | 'Contact' | 'Skills' | 'Site';

export interface PaletteItem {
  id: string;
  group: Exclude<PaletteGroup, 'Recent'>;
  label: string;
  /** Right-hand text: a target, a value or a state. */
  hint?: string;
  /** A shortcut, shown as a keycap. */
  keys?: string;
  /** Extra words that also match (not highlighted). */
  keywords?: string;
  /** Hidden entries appear only when the query equals one of these exactly. */
  exact?: string[];
  /** Copy actions: resolves to whether it worked; the row then says 'Copied' in place and the palette stays open. */
  copy?: () => Promise<boolean>;
  run?: () => void;
}

function download(href: string, fileName: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

interface BuildState {
  theme: 'dark' | 'light';
  prefs: Prefs;
}

/** Every palette entry, built from src/content and the live preferences. Order here is the order shown. */
export function buildItems({ theme, prefs }: BuildState): PaletteItem[] {
  const osReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items: PaletteItem[] = [
    { id: 'nav-top', group: 'Jump to', label: 'Top', hint: '~', keywords: 'home hero', run: () => jumpTo(TOP_ID) },
    ...sections.map<PaletteItem>((s) => ({ id: `nav-${s.id}`, group: 'Jump to', label: s.label, hint: s.path, run: () => jumpTo(s.id) })),
    ...projects.map<PaletteItem>((p) => ({
      id: `nav-${p.id}`,
      group: 'Jump to',
      label: p.name,
      hint: `~/work/${p.id}`,
      keywords: `${p.shortName} ${p.org} project ${p.stack.join(' ')}`,
      run: () => jumpTo(workAnchorId(p.id)),
    })),

    { id: 'copy-email', group: 'Contact', label: 'Copy email', hint: profile.email, keywords: 'address clipboard', copy: () => copyText(profile.email) },
    { id: 'email', group: 'Contact', label: 'Email', hint: 'Open mail app', keywords: 'send mailto message', run: () => (window.location.href = mailtoHref) },
    { id: 'call', group: 'Contact', label: 'Call', hint: profile.phone.display, keywords: 'phone', run: () => (window.location.href = telHref) },
    { id: 'vcard', group: 'Contact', label: 'Save contact', hint: '.vcf', keywords: 'vcard card address book', run: () => download(vcardHref, profile.vcard.fileName) },
    { id: 'linkedin', group: 'Contact', label: 'LinkedIn', hint: profile.linkedin.label, run: () => void window.open(profile.linkedin.url, '_blank', 'noopener') },
    {
      id: 'resume',
      group: 'Contact',
      label: 'Resume PDF',
      hint: `PDF · ${profile.resume.sizeLabel}`,
      keywords: 'cv download',
      run: () => download(resumeHref, profile.resume.fileName),
    },
    { id: 'copy-profile', group: 'Contact', label: 'Copy profile', hint: '4 lines of plain text', keywords: 'summary ats paste', copy: () => copyText(profileSummary()) },

    ...stackGroups.flatMap((g) =>
      g.skills.map<PaletteItem>((s) => ({
        id: `skill-${s.name}`,
        group: 'Skills',
        label: s.name,
        hint: `used in ${s.projects.map((p) => p.shortName).join(' · ')}`,
        keywords: `${g.title} ${s.projects.map((p) => p.name).join(' ')}`,
        run: () => showSkill(s.name),
      }))
    ),

    { id: 'terminal', group: 'Site', label: 'Open terminal', keys: 'Ctrl `', keywords: 'shell console command line drawer', run: () => openDrawer() },
    {
      id: 'theme',
      group: 'Site',
      label: `Theme: switch to ${theme === 'dark' ? 'light' : 'dark'}`,
      hint: theme,
      keywords: 'dark light mode colour',
      run: () => site.setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      id: 'motion',
      group: 'Site',
      label: 'Reduce motion',
      hint: prefs.reduceMotion || osReduced ? `on${osReduced && !prefs.reduceMotion ? ' (system)' : ''}` : 'off',
      keywords: 'animation accessibility',
      run: () => setPref('reduceMotion', !prefs.reduceMotion),
    },
    {
      id: 'statusbar',
      group: 'Site',
      label: prefs.hideStatusBar ? 'Show status bar' : 'Hide status bar',
      keywords: 'clock footer',
      run: () => setPref('hideStatusBar', !prefs.hideStatusBar),
    },
    { id: 'shortcuts', group: 'Site', label: 'Keyboard shortcuts', keys: '?', keywords: 'keys help', run: () => site.openShortcuts() },
    { id: 'print', group: 'Site', label: 'Print as CV', keywords: 'pdf paper', run: () => window.print() },

    // Hidden: only an exact match shows them.
    { id: 'barrel-roll', group: 'Site', label: 'Barrel roll', exact: ['barrel roll', 'do a barrel roll'], run: konami },
    { id: 'konami', group: 'Site', label: 'Konami', hint: '↑ ↑ ↓ ↓ ← → ← → B A', exact: ['konami'], run: konami },
    {
      id: 'sudo-hire-me',
      group: 'Site',
      label: 'sudo hire-me',
      hint: 'access granted',
      exact: ['sudo hire-me', 'sudo hire me', 'hire me'],
      run: () => {
        toast('access granted — excellent decision.');
        window.setTimeout(() => (window.location.href = mailtoHref), motionReduced() ? 300 : 900);
      },
    },
  ];
  return items;
}

const RECENT_KEY = 'am:recent';
const RECENT_MAX = 5;

export function readRecent(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string').slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

export function pushRecent(id: string) {
  try {
    const next = [id, ...readRecent().filter((x) => x !== id)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: Recent just stays empty */
  }
}
