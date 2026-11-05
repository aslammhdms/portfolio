import { profile } from '../../content';

/**
 * The H1: a heavy, wide "Aslam" over a light, condensed "Muhammed", both cut to
 * the width of the name column (see .amd rules in styles/hero.css). The real
 * space between the spans keeps the accessible name and copied text
 * "Aslam Muhammed"; it collapses visually because the spans are blocks.
 */
export default function NameLockup({ id }: { id?: string }) {
  return (
    <h1 id={id} className="hero-name">
      <span className="l1">{profile.givenName}</span> <span className="l2">{profile.familyName}</span>
    </h1>
  );
}
