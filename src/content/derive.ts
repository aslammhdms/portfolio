/**
 * Everything computed from the content rather than typed twice: the Stack section's
 * receipts and Core row, the plain-text profile for applicant-tracking systems, and
 * the vCard. Pure functions of src/content, so the prerender, the client, the
 * terminal and the build scripts always agree.
 */
import { now } from './now';
import { profile } from './profile';
import { projects, type Project } from './projects';
import { SITE_URL } from './site';
import { CORE_MIN_PROJECTS, coreStack, skillGroups, type SkillGroupTitle, type SkillName } from './skills';

export interface SkillEvidence {
  name: SkillName;
  /** The projects on the page that used it, in page order. */
  projects: Project[];
}

export interface StackGroup {
  title: SkillGroupTitle;
  skills: SkillEvidence[];
}

/** The projects that name `skill` in their `skills` list, in page order. */
export function projectsUsing(skill: SkillName): Project[] {
  return projects.filter((p) => p.skills.includes(skill));
}

export const stackGroups: StackGroup[] = skillGroups.map((group) => ({
  title: group.title,
  skills: group.skills.map((name) => ({ name, projects: projectsUsing(name) })),
}));

/**
 * Core: every skill used by CORE_MIN_PROJECTS or more projects on the page, most
 * used first (ties keep catalogue order). Shown with its count, so "core" is carried
 * by structure and a number, not by colour or brightness alone.
 */
export const coreSkills: SkillEvidence[] = stackGroups
  .flatMap((g) => g.skills)
  .filter((s) => s.projects.length >= CORE_MIN_PROJECTS)
  .sort((a, b) => b.projects.length - a.projects.length);

/** Catalogue skills no project on the page uses. Must stay empty: the prerender checks it. */
export const unprovenSkills: SkillName[] = stackGroups
  .flatMap((g) => g.skills)
  .filter((s) => s.projects.length === 0)
  .map((s) => s.name);

/**
 * Copy profile: four plain lines to paste into an applicant-tracking system or an
 * email. Availability is left out on purpose (see availability.ts).
 */
export function profileSummary(): string {
  return [
    `${profile.name} — ${profile.title.replace(' · ', ', ')}`,
    `${profile.location.short} (${profile.residency}) · ${profile.yearsOfExperience} years · ${coreStack.map((s) => s.label).join(', ')}`,
    `Now: ${now.long}`,
    `${profile.email} · ${profile.phone.display} · ${profile.linkedin.label} · ${SITE_URL.replace(/^https:\/\/|\/$/g, '')}`,
  ].join('\n');
}

/** vCard 3.0 text value: backslash, comma, semicolon and newline are escaped (RFC 2426). */
const esc = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

/** Lines longer than 75 octets are folded: CRLF plus one space, never inside a UTF-8 sequence. */
function fold(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = '';
  for (const ch of line) {
    const limit = parts.length === 0 ? 75 : 74; // continuation lines start with a space
    if (encoder.encode(current + ch).length > limit) {
      parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts.join('\r\n ');
}

/**
 * The contact card (.vcf), written to dist/ at build time by scripts/build-vcard.mjs,
 * so it never drifts from the page. The NOW line is its note; availability is not.
 */
export function buildVCard(): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(profile.familyName)};${esc(profile.givenName)};;;`,
    `FN:${esc(profile.name)}`,
    `TITLE:${esc(profile.title)}`,
    `EMAIL;TYPE=INTERNET,PREF:${profile.email}`,
    `TEL;TYPE=CELL,VOICE:${profile.phone.tel}`,
    `URL;TYPE=WORK:${SITE_URL}`,
    `URL:${profile.linkedin.url}`,
    `ADR;TYPE=WORK:;;;${esc(profile.location.city)};;;${esc(profile.location.country)}`,
    `NOTE:${esc(now.long)}`,
    'END:VCARD',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
