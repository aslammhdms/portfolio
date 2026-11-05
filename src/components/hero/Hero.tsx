import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { TOP_ID, now, profile, type RichText } from '../../content';
import { watchLockupFit } from '../../lib/lockup';
import { abuDhabiTime, keyLightFor } from '../../lib/time';
import HeroActions from './HeroActions';
import Ledger from './Ledger';
import NameLockup from './NameLockup';
import Portrait, { PortraitThumb } from './Portrait';

function Rich({ text }: { text: RichText }) {
  return (
    <>
      {text.map((part, i) => (typeof part === 'string' ? part : <b key={i}>{part.em}</b>))}
    </>
  );
}

/**
 * The first screen, in a recruiter's scan order: what he does now, the name,
 * the role, a two-sentence lede, the portrait, four facts and the actions.
 * Everything renders on the server except the key light's time-of-day colour.
 */
export default function Hero() {
  const [keyLight, setKeyLight] = useState<string | null>(null);

  // The key light follows the time of day in Abu Dhabi; it is read after mount
  // only, so the prerendered HTML stays neutral and hydration matches.
  useEffect(() => {
    const update = () => setKeyLight(keyLightFor(abuDhabiTime().hour));
    update();
    const timer = window.setInterval(update, 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  // The lockup and the fitted role line are nowrap by design. If they do not fit their
  // column anyway (the visitor's own text spacing, WCAG 1.4.12), fall back to the
  // wrapping styles. Checked once fonts are ready and whenever either box changes size.
  const nameColRef = useRef<HTMLDivElement>(null);
  useEffect(() => watchLockupFit(nameColRef.current), []);

  const style = keyLight ? ({ '--keylight': keyLight } as CSSProperties) : undefined;

  return (
    <section id={TOP_ID} className="hero" aria-labelledby="hero-name" style={style}>
      <div className="hero-light" aria-hidden="true" />
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
          <p className="hero-lede">
            <Rich text={profile.lede.first} />{' '}
            <span className="hero-lede-more">
              <Rich text={profile.lede.second} />
            </span>
          </p>
        </div>

        <Portrait />
        <PortraitThumb />
        <Ledger />
        <HeroActions />
      </div>
    </section>
  );
}
