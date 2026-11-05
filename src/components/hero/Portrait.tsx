import { useState } from 'react';
import { asset, profile } from '../../content';

const SIZES = '(min-width: 1440px) 310px, (min-width: 1024px) 23vw, 30vw';
const [W620, H620] = profile.portrait.sizes[620];
/** The 64px-wide phone thumbnail: 128px for 2x screens, 256px for 3x. */
const THUMB_SRCSET = `${asset('images/aslam-128.webp')} 128w, ${asset('images/aslam-256.webp')} 256w`;
const THUMB_SIZES = '64px';

/**
 * One copy of the photo. On phones the desktop portrait is hidden, so its source
 * there is the same set the thumbnail uses (the browser picks the same file): one
 * small download, not two.
 */
function Photo({ className, alt }: { className: string; alt: string }) {
  return (
    <picture>
      <source media="(max-width: 767px)" type="image/webp" srcSet={THUMB_SRCSET} sizes={THUMB_SIZES} />
      <source
        type="image/webp"
        srcSet={`${asset('images/aslam-620.webp')} 620w, ${asset('images/aslam-1240.webp')} 1240w`}
        sizes={SIZES}
      />
      <img
        className={className}
        src={asset('images/aslam-620.jpg')}
        srcSet={`${asset('images/aslam-620.jpg')} 620w, ${asset('images/aslam-1240.jpg')} 1240w`}
        sizes={SIZES}
        width={W620}
        height={H620}
        alt={alt}
        decoding="async"
      />
    </picture>
  );
}

/**
 * Desktop and tablet portrait: warm monochrome (grayscale + 12% sepia) under a
 * colour copy revealed by a radial mask driven by the registered --bloom
 * property. On the first view of a session the colour blooms out from the face
 * after the name settles (pure CSS, gated by html.intro); afterwards the Colour
 * pill switches between the two states. Hard edges, no radius.
 */
export default function Portrait() {
  const [colour, setColour] = useState(true);

  return (
    <figure className="hero-portrait" data-colour={colour ? 'on' : 'off'}>
      <div className="portrait-frame">
        <Photo className="portrait-img portrait-mono" alt={profile.portrait.alt} />
        <Photo className="portrait-img portrait-colour" alt="" />
      </div>
      <div className="portrait-meta">
        <span className="portrait-place">{profile.location.city}</span>
        <button
          type="button"
          className="portrait-toggle"
          aria-pressed={colour}
          onClick={() => setColour((c) => !c)}
        >
          Colour
        </button>
      </div>
    </figure>
  );
}

/** Phones: a 64 × 80 colour thumbnail beside the lede. */
export function PortraitThumb() {
  const [w, h] = profile.portrait.sizes[128];
  return (
    <div className="hero-thumb">
      <img
        src={asset('images/aslam-128.webp')}
        srcSet={THUMB_SRCSET}
        sizes={THUMB_SIZES}
        width={w}
        height={h}
        alt={profile.portrait.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
