import { useEffect, useState, type KeyboardEvent as ReactKeyEvent } from 'react';
import {
  coreSkills,
  stackGroups,
  stackSection,
  toolbox,
  workAnchorId,
  type SkillEvidence,
  type SkillName,
} from '../content';
import { STACK_SKILL_EVENT, scrollBehavior } from '../lib/site';
import SectionRail from './SectionRail';
import { ArrowRightIcon } from './icons';

/** Which evidence line is open: one at a time, in one row. */
interface OpenSkill {
  row: string;
  skill: SkillName;
}

/** 'Tricore migration · HelpDesk · …' as jump links to the project rows (#work/<id>). */
function ProjectLinks({ skill }: { skill: SkillEvidence }) {
  return (
    <ul className="dot-list evidence-links" role="list">
      {skill.projects.map((p) => (
        <li key={p.id}>
          <a href={`#${workAnchorId(p.id)}`}>{p.shortName}</a>
        </li>
      ))}
    </ul>
  );
}

interface StackRowProps {
  rowId: string;
  title: string;
  /** Under the label: what the row means ('Used in 2 or more projects'). */
  note?: string;
  skills: SkillEvidence[];
  core?: boolean;
  open: OpenSkill | null;
  onToggle: (row: string, skill: SkillName) => void;
}

/**
 * A ledger row: the group's label in the rail, its skills inline in Mona 500 with thin
 * dots between them. Every skill is a button that opens ONE evidence line under the
 * row. On phones the buttons give way to a plain list: one skill per line with its
 * projects as a Cascadia sub-line, so nothing has to be opened at all.
 */
function StackRow({ rowId, title, note, skills, core = false, open, onToggle }: StackRowProps) {
  const evidenceId = `stack-${rowId}-evidence`;
  const current = open?.row === rowId ? skills.find((s) => s.name === open.skill) : undefined;
  // One Tab stop per row (the last skill focused, else the first); the arrow keys move
  // between its skills, so reaching Contact from Work takes a handful of Tabs, not forty.
  const [stop, setStop] = useState<SkillName | null>(null);
  const tabStop = skills.some((s) => s.name === stop) ? stop : skills[0]?.name;
  const onKeyDown = (e: ReactKeyEvent<HTMLUListElement>) => {
    const keys: Record<string, (i: number, n: number) => number> = {
      ArrowRight: (i, n) => (i + 1) % n,
      ArrowDown: (i, n) => (i + 1) % n,
      ArrowLeft: (i, n) => (i - 1 + n) % n,
      ArrowUp: (i, n) => (i - 1 + n) % n,
      Home: () => 0,
      End: (_, n) => n - 1,
    };
    const move = keys[e.key];
    if (!move) return;
    const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button.skill'));
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    buttons[move(i, buttons.length)].focus();
  };

  return (
    <div className="stack-row" data-core={core ? '' : undefined}>
      <h3 className="stack-label">
        {title}
        {note && <span className="stack-note">{note}</span>}
      </h3>

      <div className="stack-body">
        {/* Desktop and tablets: buttons. */}
        <ul className="dot-list stack-items" role="list" onKeyDown={onKeyDown}>
          {skills.map((skill) => {
            const pressed = current?.name === skill.name;
            return (
              <li key={skill.name}>
                <button
                  type="button"
                  className="skill"
                  aria-expanded={pressed}
                  aria-controls={evidenceId}
                  data-skill={skill.name}
                  tabIndex={skill.name === tabStop ? 0 : -1}
                  onFocus={() => setStop(skill.name)}
                  onClick={() => onToggle(rowId, skill.name)}
                >
                  {skill.name}
                  {core && (
                    <span className="skill-count">
                      <span aria-hidden="true">×{skill.projects.length}</span>
                      <span className="sr-only">, used in {skill.projects.length} projects</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Phones: one skill per line (the Core row stays inline, with its counts). */}
        <ul className={core ? 'dot-list stack-phone stack-phone-core' : 'stack-phone'} role="list">
          {skills.map((skill) => (
            <li key={skill.name}>
              <span className="skill-name">{skill.name}</span>
              {core ? (
                <span className="skill-count"> ×{skill.projects.length}</span>
              ) : (
                <ProjectLinks skill={skill} />
              )}
            </li>
          ))}
        </ul>

        <div id={evidenceId} className="evidence" data-open={current ? '' : undefined}>
          {current && (
            <p className="evidence-line">
              <span className="evidence-skill">{current.name}</span>
              <ArrowRightIcon />
              <span className="sr-only">used in </span>
              <ProjectLinks skill={current} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 03 — Stack, with receipts. The Core row and its counts are derived from the
 * projects (src/content/derive.ts); the groups follow; tools with no project to point
 * at are listed plainly at the end.
 */
export default function Stack() {
  const [open, setOpen] = useState<OpenSkill | null>(null);

  const onToggle = (row: string, skill: SkillName) =>
    setOpen((cur) => (cur && cur.row === row && cur.skill === skill ? null : { row, skill }));

  // The palette's Skills group (and the terminal) ask to show a skill's evidence: open its line
  // in the skill's own group row and scroll the button into view.
  useEffect(() => {
    const onSkill = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      const group = stackGroups.find((g) => g.skills.some((s) => s.name === name));
      if (!group) return;
      const row = group.title.toLowerCase().replace(/[^a-z]+/g, '-');
      setOpen({ row, skill: name as SkillName });
      window.requestAnimationFrame(() => {
        const buttons = Array.from(document.querySelectorAll<HTMLElement>('button.skill[data-skill]'));
        const button = buttons.find((b) => b.dataset.skill === name && b.offsetParent !== null) ?? buttons.find((b) => b.dataset.skill === name);
        button?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
        button?.focus({ preventScroll: true });
      });
    };
    window.addEventListener(STACK_SKILL_EVENT, onSkill);
    return () => window.removeEventListener(STACK_SKILL_EVENT, onSkill);
  }, []);

  // Escape closes the open evidence line.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section id="stack" className="section stack" aria-labelledby="stack-title">
      <div className="shell">
        <SectionRail id="stack" titleId="stack-title" title={stackSection.title} meta={stackSection.railMeta}>
          {stackSection.lede}
        </SectionRail>

        <div className="stack-rows">
          <StackRow
            rowId="core"
            title={stackSection.coreLabel}
            note={stackSection.coreNote}
            skills={coreSkills}
            core
            open={open}
            onToggle={onToggle}
          />
          {stackGroups.map((group) => (
            <StackRow
              key={group.title}
              rowId={group.title.toLowerCase().replace(/[^a-z]+/g, '-')}
              title={group.title}
              skills={group.skills}
              open={open}
              onToggle={onToggle}
            />
          ))}
          <div className="stack-row stack-toolbox">
            <h3 className="stack-label">
              {stackSection.toolboxLabel}
              <span className="stack-note">{stackSection.toolboxNote}</span>
            </h3>
            <div className="stack-body">
              <ul className="dot-list stack-plain" role="list">
                {toolbox.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
