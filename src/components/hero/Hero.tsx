import { useEffect, useRef } from 'react';
import { TOP_ID, now, profile, type RichText } from '../../content';
import { watchLockupFit } from '../../lib/lockup';
import HeroActions from './HeroActions';
import Ledger from './Ledger';
import NameLockup from './NameLockup';

function Rich({ text }: { text: RichText }) {
  return (
    <>
      {text.map((part, i) => (typeof part === 'string' ? part : <b key={i}>{part.em}</b>))}
    </>
  );
}

/**
 * The first screen, in a recruiter's scan order: what he does now, the name and
 * the role, then beside them (below them on tablets and phones) a two-sentence
 * lede and four facts, and the actions. All of it renders on the server.
 */
export default function Hero() {
  // The lockup and the fitted role line are nowrap by design. If they do not fit their
  // column anyway (the visitor's own text spacing, WCAG 1.4.12), fall back to the
  // wrapping styles. Checked once fonts are ready and whenever either box changes size.
  const nameColRef = useRef<HTMLDivElement>(null);
  useEffect(() => watchLockupFit(nameColRef.current), []);

  return (
    <section id={TOP_ID} className="hero" aria-labelledby="hero-name">
      <div className="shell hero-grid">
        <p className="hero-eyebrow">
          <span className="hero-now">
            <span className="dot" aria-hidden="true" />
            NOW
          </span>{' '}
          <span className="hero-now-long">{now.long}</span>
          <span className="hero-now-short">{now.short}</span>
        </p>

        <div className="hero-namecol" ref={nameColRef}>
          <NameLockup id="hero-name" />
          <p className="hero-role">{profile.title}</p>
        </div>

        {/* One column beside the name on desktops; on tablets and phones the box
            dissolves (display: contents) and both parts join the page grid. */}
        <div className="hero-side">
          <p className="hero-lede">
            <Rich text={profile.lede.first} />{' '}
            <span className="hero-lede-more">
              <Rich text={profile.lede.second} />
            </span>
          </p>
          <Ledger />
        </div>

        <HeroActions />
      </div>
    </section>
  );
}
