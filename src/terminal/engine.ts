import {
  STATUS_LABEL,
  experience,
  formatPeriod,
  formatRange,
  history as siteHistory,
  mailtoHref,
  now,
  profile,
  profileSummary,
  projects,
  resumeHref,
  stackGroups,
  telHref,
  toolbox,
  traces,
  vcardHref,
  workAnchorId,
  type Project,
} from '../content';
import { copyText } from '../lib/clipboard';
import { editDistance } from '../lib/fuzzy';
import { motionReduced, setPref } from '../lib/prefs';
import { clearHighlight, highlightRows, jumpTo, site } from '../lib/site';
import { hasTrace, revealDiagram, startTrace } from '../lib/trace';
import {
  append,
  clearLines,
  closeDrawer,
  getTerm,
  setSkin,
  updateLine,
  type LineKind,
} from './store';

/**
 * Every terminal command. They read src/content (the same data as the page), so the
 * terminal never says anything the page does not. Output goes through the store, so
 * the band and the drawer show one session. Errors start with 'error:' rather than
 * a colour, because the accent is already pink.
 */

const say = (text: string, kind: LineKind = 'out') => void append({ kind, text });
const err = (text: string) => say(`error: ${text}`, 'err');
const dim = (text: string) => say(text, 'dim');
const pre = (text: string) => say(text, 'pre');
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, motionReduced() ? 0 : ms));
const isPhone = () => window.matchMedia('(max-width: 767px)').matches;

/**
 * Following a link to a fragment takes focus out of the prompt (the page's own
 * navigation steps), so a command that jumps hands focus back to wherever the visitor is typing.
 */
function refocusPrompt() {
  window.requestAnimationFrame(() => {
    const id = getTerm().drawerOpen ? 'term-input-drawer' : 'term-input-band';
    document.getElementById(id)?.focus({ preventScroll: true });
  });
}

interface Command {
  name: string;
  aliases?: string[];
  /** Left out of Tab completion and 'did you mean' (the hidden ones). */
  hidden?: boolean;
  /** Completions for the first argument. */
  args?: () => string[];
  run: (args: string[], raw: string) => void | Promise<void>;
}

// ---------- Helpers ----------

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

function findProject(query: string): Project | undefined {
  const n = Number(query);
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1];
  const q = slug(query);
  if (!q) return undefined;
  return (
    projects.find((p) => slug(p.id) === q || slug(p.shortName) === q || slug(p.name) === q) ??
    projects.find((p) => slug(p.id).startsWith(q) || slug(p.shortName).startsWith(q) || slug(p.name).startsWith(q))
  );
}

function download(href: string, fileName: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** The work table: # · project · years · stack · status, aligned. Falls back to a stacked list on narrow screens. */
function workTable(cols: number): string[] {
  const rows = projects.map((p, i) => ({
    n: String(i + 1),
    project: p.name,
    years: formatPeriod(p.period),
    stack: p.stack.join(' · '),
    status: STATUS_LABEL[p.status].toLowerCase(),
  }));
  const w = {
    n: 1,
    project: Math.max(7, ...rows.map((r) => r.project.length)),
    years: Math.max(5, ...rows.map((r) => r.years.length)),
    status: Math.max(6, ...rows.map((r) => r.status.length)),
    stack: Math.max(5, ...rows.map((r) => r.stack.length)),
  };
  const gap = 2;
  const fixed = w.n + w.project + w.years + w.status + gap * 4;
  const room = cols - fixed;
  if (room < 14) {
    // Narrow: one project per block.
    return rows.flatMap((r) => [`${r.n}  ${r.project}`, `   ${r.years} · ${r.status}`, `   ${clip(r.stack, Math.max(cols - 3, 12))}`]);
  }
  w.stack = Math.min(w.stack, room);
  const line = (a: string, b: string, c: string, d: string, e: string) =>
    [a.padEnd(w.n), b.padEnd(w.project), c.padEnd(w.years), clip(d, w.stack).padEnd(w.stack), e].join(' '.repeat(gap));
  const rule = (n: number) => '─'.repeat(n);
  return [
    line('#', 'project', 'years', 'stack', 'status'),
    line(rule(w.n), rule(w.project), rule(w.years), rule(w.stack), rule(w.status)),
    ...rows.map((r) => line(r.n, r.project, r.years, r.stack, r.status)),
  ];
}

// ---------- Commands ----------

const projectNames = () => projects.map((p) => p.id);

const COMMANDS: Command[] = [
  {
    name: 'help',
    aliases: ['?'],
    run() {
      say('look around');
      say('  whoami · now · work · stack [term] · experience · contact');
      say('do things');
      say('  open <name|n> · trace <helpdesk|tricore> · copy email · resume · vcard · linkedin');
      say('tune');
      say('  theme [dark|light] · motion [on|off] · history · clear · exit');
      dim('keys: ↑ ↓ history · Tab completes · Ctrl+L clears · Ctrl+` opens this anywhere');
      dim('…and a few hidden ones. sudo at your own risk.');
    },
  },
  {
    name: 'whoami',
    run() {
      say(profile.name);
      say(`${profile.title} — ${profile.location.city}`);
      say(`${profile.yearsOfExperience} years · ERP, retail and internal systems`);
    },
  },
  {
    name: 'now',
    run() {
      say(now.long);
      dim(`updated ${now.updated}`);
    },
  },
  {
    name: 'work',
    aliases: ['projects'],
    run() {
      workTable(getTerm().cols).forEach(pre);
      dim("open <name|n> jumps to a project; trace helpdesk walks a ticket through its diagram.");
    },
  },
  {
    name: 'open',
    args: projectNames,
    run(args) {
      const query = args.join(' ');
      if (!query) {
        err('usage: open <name|n>');
        projects.forEach((p, i) => say(`  ${i + 1}  ${p.id}`));
        return;
      }
      const project = findProject(query);
      if (!project) {
        err(`no project matches '${query}'`);
        suggest(query, projectNames());
        return;
      }
      say(`→ #${workAnchorId(project.id)}  ${project.name}`);
      // On a phone the drawer covers the project, so it closes and focus goes back to
      // whatever opened it (closeDrawer); the prompt is not refocused, or the keyboard
      // would stay up over the project and the next key would scroll away from it.
      if (isPhone() && getTerm().drawerOpen) {
        closeDrawer();
        jumpTo(workAnchorId(project.id));
        return;
      }
      jumpTo(workAnchorId(project.id));
      refocusPrompt();
    },
  },
  {
    name: 'trace',
    args: () => Object.keys(traces),
    async run(args) {
      const id = args[0]?.toLowerCase();
      if (!id || !hasTrace(id)) {
        err(id ? `nothing to trace for '${id}'` : 'usage: trace <helpdesk|tricore>');
        say(`  traceable: ${Object.keys(traces).join(' · ')}`);
        if (id) suggest(id, Object.keys(traces));
        return;
      }
      const t = traces[id];
      say(`tracing ${t.subject} through ${id}…`);
      if (isPhone()) closeDrawer();
      if (!(await revealDiagram(id))) {
        err('that diagram is not on the page');
        return;
      }
      // The steps print as they light up on the page.
      await startTrace(id, (step, i) => say(`  ${i + 1}. ${step.text}`));
      dim(`done. Press the "${t.button}" button on the page to clear it.`);
    },
  },
  {
    name: 'stack',
    aliases: ['skills'],
    run(args) {
      const term = args.join(' ').toLowerCase();
      if (!term) {
        const width = Math.max(...stackGroups.map((g) => g.title.length), 'toolbox'.length) + 3;
        stackGroups.forEach((g) => say(`${g.title.toLowerCase().padEnd(width)}${g.skills.map((s) => s.name).join(' · ')}`));
        say(`${'toolbox'.padEnd(width)}${toolbox.join(' · ')}`);
        dim("try 'stack sql' to see where a skill was used.");
        return;
      }
      const skills = stackGroups.flatMap((g) => g.skills).filter((s) => s.name.toLowerCase().includes(term));
      const tools = toolbox.filter((t) => t.toLowerCase().includes(term));
      if (skills.length === 0 && tools.length === 0) {
        err(`no skill matches '${term}'`);
        return;
      }
      const used = new Map<string, Project>();
      skills.forEach((s) => {
        say(`${s.name} → ${s.projects.map((p) => p.shortName).join(' · ')}`);
        s.projects.forEach((p) => used.set(p.id, p));
      });
      tools.forEach((t) => say(`${t} → in my toolbox (not tied to a project on this page)`));
      if (used.size) {
        dim(`${used.size} project${used.size === 1 ? '' : 's'} highlighted in Work.`);
        highlightRows([...used.keys()]);
      }
    },
  },
  {
    name: 'experience',
    aliases: ['exp'],
    run() {
      experience.forEach((job) => {
        say(`${job.company}, ${job.location}`);
        job.roles.forEach((r) => say(`  ${formatRange(r.start, r.end)}  ${r.title}`));
      });
      dim('The full list is in the Experience section.');
    },
  },
  {
    name: 'contact',
    aliases: ['email'],
    run() {
      say(`email     ${profile.email}`);
      say(`phone     ${profile.phone.display}`);
      say(`linkedin  ${profile.linkedin.label}`);
      say(`place     ${profile.location.short}`);
      dim("'copy email' puts the address on your clipboard.");
    },
  },
  {
    name: 'copy',
    args: () => ['email', 'profile'],
    async run(args) {
      const what = args[0]?.toLowerCase();
      if (what === 'email') {
        say((await copyText(profile.email)) ? `copied ${profile.email}` : `could not copy; select it instead: ${profile.email}`);
      } else if (what === 'profile') {
        say((await copyText(profileSummary())) ? 'copied the four-line profile' : 'could not copy the profile');
      } else {
        err('usage: copy email | copy profile');
      }
    },
  },
  {
    name: 'resume',
    aliases: ['cv'],
    run() {
      say(`downloading ${profile.resume.fileName} (${profile.resume.sizeLabel}) …`);
      download(resumeHref, profile.resume.fileName);
    },
  },
  {
    name: 'vcard',
    run() {
      say('saving the contact card …');
      download(vcardHref, profile.vcard.fileName);
    },
  },
  {
    name: 'linkedin',
    run() {
      say(`opening ${profile.linkedin.label} …`);
      window.open(profile.linkedin.url, '_blank', 'noopener');
    },
  },
  {
    name: 'call',
    hidden: true,
    run() {
      say(`calling ${profile.phone.display} …`);
      window.location.href = telHref;
    },
  },
  {
    name: 'theme',
    args: () => ['dark', 'light'],
    run(args) {
      const want = args[0]?.toLowerCase();
      if (want && want !== 'dark' && want !== 'light') {
        err("usage: theme [dark|light]");
        return;
      }
      const next = (want as 'dark' | 'light' | undefined) ?? (site.getTheme() === 'dark' ? 'light' : 'dark');
      site.setTheme(next);
      say(`theme → ${next}`);
    },
  },
  {
    name: 'motion',
    args: () => ['on', 'off'],
    run(args) {
      const want = args[0]?.toLowerCase();
      if (want !== 'on' && want !== 'off') {
        if (want) err('usage: motion [on|off]');
        say(`motion is ${motionReduced() ? 'off' : 'on'}`);
        return;
      }
      setPref('reduceMotion', want === 'off');
      const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      say(`motion → ${want}`);
      if (want === 'on' && osReduced) dim('your system setting still asks for reduced motion, so it stays off.');
    },
  },
  {
    name: 'history',
    run() {
      const h = getTerm().history;
      if (h.length === 0) say('nothing yet');
      h.forEach((c, i) => say(`${String(i + 1).padStart(3)}  ${c}`));
    },
  },
  {
    name: 'clear',
    aliases: ['cls'],
    run() {
      clearLines();
    },
  },
  {
    name: 'exit',
    aliases: ['quit', 'logout'],
    run() {
      if (getTerm().drawerOpen) {
        closeDrawer();
        return;
      }
      say('logout');
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    },
  },
  {
    name: 'sudo',
    hidden: true,
    args: () => ['hire-me'],
    async run(args) {
      if (args.join(' ').toLowerCase().replace(/\s+/g, '-') !== 'hire-me') {
        say('visitor is not in the sudoers file. This incident will be reported.');
        return;
      }
      const prompt = '[sudo] password for visitor: ';
      const [id] = append({ kind: 'out', text: prompt });
      for (let i = 1; i <= 8; i++) {
        updateLine(id, prompt + '*'.repeat(i));
        await sleep(90);
      }
      say('access granted — excellent decision.');
      say('opening your mail app …');
      await sleep(700);
      window.location.href = mailtoHref;
    },
  },
  {
    name: 'git',
    hidden: true,
    args: () => ['log', 'checkout', 'switch', 'status'],
    run(args) {
      const [sub, target] = args.map((a) => a.toLowerCase());
      const detached = getTerm().skin === 'v1';
      if (sub === 'log') {
        [...siteHistory].reverse().forEach((h, i) => {
          say(`${h.hash}${i === 0 ? ' (HEAD -> main)' : ''}  ${h.date}  ${h.title}`);
        });
        return;
      }
      if (sub === 'status') {
        say(detached ? 'HEAD detached at a46821c' : 'On branch main');
        dim('nothing to commit, working tree clean');
        return;
      }
      if (sub === 'checkout' || sub === 'switch') {
        if (target === 'v1') {
          setSkin('v1');
          say("Note: switching to 'v1'.");
          say('HEAD detached at a46821c');
          dim("This terminal only; nothing is saved. 'git switch main' goes back.");
        } else if (target === 'main') {
          setSkin('main');
          say(detached ? "Switched to branch 'main'" : "Already on 'main'");
        } else {
          err(`pathspec '${target ?? ''}' did not match any branch or tag. Try: git checkout v1`);
        }
        return;
      }
      err("usage: git log | git checkout v1 | git switch main | git status");
    },
  },
  {
    name: 'neofetch',
    aliases: ['fetch'],
    hidden: true,
    run() {
      append({ kind: 'widget', text: 'neofetch', widget: 'neofetch' });
    },
  },
  {
    name: 'fonts',
    hidden: true,
    run() {
      say('fonts');
      say('  Mona Sans      variable, width 75–125 and weight 200–900: the name, headings and text');
      say('  Cascadia Mono  this terminal, labels and the small print');
      append({ kind: 'widget', text: 'fonts', widget: 'fonts' });
      say('Accent: Raspberry #C2387D, the pink from my October 2025 site.');
    },
  },
  {
    name: 'coffee',
    hidden: true,
    run() {
      say("418 I'm a teapot");
    },
  },
  {
    name: 'ls',
    hidden: true,
    run() {
      say('work/   experience/   stack/   contact/   resume.pdf');
    },
  },
  {
    name: 'pwd',
    hidden: true,
    run() {
      say('~/abu-dhabi-uae');
    },
  },
  {
    name: 'echo',
    hidden: true,
    run(_args, raw) {
      say(raw.replace(/^\s*echo\s*/i, ''));
    },
  },
];

const byName = new Map<string, Command>();
COMMANDS.forEach((c) => {
  byName.set(c.name, c);
  c.aliases?.forEach((a) => byName.set(a, c));
});

/** Every name worth suggesting or completing (no aliases, nothing hidden). */
export const visibleNames = (): string[] => COMMANDS.filter((c) => !c.hidden).map((c) => c.name);

/** 'did you mean': the closest name within an edit distance of 2. */
function closest(word: string, names: string[]): string | null {
  let best: string | null = null;
  let bestD = 3;
  for (const n of names) {
    const d = editDistance(word, n);
    if (d < bestD) {
      best = n;
      bestD = d;
    }
  }
  return best;
}

function suggest(word: string, names: string[]) {
  const hit = closest(word.toLowerCase(), names);
  if (hit) dim(`did you mean '${hit}'?`);
}

export async function run(raw: string): Promise<void> {
  const text = raw.trim();
  const [first, ...args] = text.split(/\s+/);
  const name = first.toLowerCase();
  if (name !== 'clear' && name !== 'cls') append({ kind: 'cmd', text });
  clearHighlight();
  const command = byName.get(name);
  if (!command) {
    err(`command not found: ${first}`);
    const all = [...byName.keys()].filter((k) => !byName.get(k)?.hidden);
    const hit = closest(name, all);
    if (hit) dim(`did you mean '${hit}'?`);
    else dim("try 'help'");
    return;
  }
  await command.run(args, text);
}

// ---------- Tab completion ----------

export interface Completion {
  /** The input after completing as far as is unambiguous. */
  value: string;
  /** All candidates, when there is more than one. */
  options: string[];
}

export function complete(input: string): Completion {
  const trimmedStart = input.replace(/^\s+/, '');
  const parts = trimmedStart.split(/\s+/);
  if (parts.length <= 1) {
    const prefix = parts[0].toLowerCase();
    // The hidden commands are never offered; typing one in full still works.
    return finish('', prefix, visibleNames().filter((n) => n.startsWith(prefix)));
  }
  const command = byName.get(parts[0].toLowerCase());
  const options = command?.args?.() ?? [];
  const last = parts[parts.length - 1].toLowerCase();
  const head = parts.slice(0, -1).join(' ');
  return finish(`${head} `, last, parts.length === 2 ? options.filter((o) => o.startsWith(last)) : []);
}

function finish(head: string, typed: string, matches: string[]): Completion {
  if (matches.length === 0) return { value: head + typed, options: [] };
  if (matches.length === 1) return { value: `${head}${matches[0]} `, options: [] };
  let common = matches[0];
  for (const m of matches) {
    while (!m.startsWith(common)) common = common.slice(0, -1);
  }
  return { value: head + (common.length > typed.length ? common : typed), options: matches };
}
