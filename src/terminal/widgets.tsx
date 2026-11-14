import { useState } from 'react';
import { coreStack, now, profile } from '../content';

/**
 * The two terminal outputs that are not plain text: `neofetch` (his initials set as
 * in the name lockup, next to real facts) and `fonts` (a live width-axis sample of the name).
 */

export function Neofetch() {
  const facts: [string, string][] = [
    ['Role', profile.title],
    ['Now', now.short],
    ['Where', `${profile.location.short} (${profile.residency})`],
    ['Years', profile.experienceSummary.long],
    ['Core', coreStack.map((s) => s.label).join(' · ')],
    ['Site', window.location.host],
    ['Email', profile.email],
  ];
  return (
    <div className="t-fetch">
      {/* Decorative: the facts' first row already names him. */}
      <p className="t-mark" aria-hidden="true">
        <span>{profile.givenName[0]}</span>
        <span>{profile.familyName[0]}</span>
      </p>
      <dl className="t-facts">
        <div className="t-facts-head">
          <dt className="sr-only">User</dt>
          <dd>aslam@auh</dd>
        </div>
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The name in AM Display, with its width axis under the visitor's hand (weight follows, as in the lock-in). */
export function FontsSample() {
  const [wdth, setWdth] = useState(100);
  const wght = Math.round(300 + ((wdth - 75) / 50) * 560);
  return (
    <div className="t-font">
      <p className="t-font-sample" style={{ fontStretch: `${wdth}%`, fontWeight: wght }} lang="en">
        {profile.name}
      </p>
      <label className="t-font-axis">
        <span>width</span>
        <input type="range" min={75} max={125} step={1} value={wdth} onChange={(e) => setWdth(Number(e.target.value))} />
        <output>
          wdth {wdth} · wght {wght}
        </output>
      </label>
    </div>
  );
}
