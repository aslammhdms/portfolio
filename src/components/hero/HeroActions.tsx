import { mailtoHref, profile, resumeHref, telHref, vcardHref } from '../../content';
import { ArrowRightIcon, ArrowUpRightIcon, DownloadIcon } from '../icons';

/**
 * How to act: Email me (the one raspberry fill in view), the résumé, then plain
 * text links. The address is shown as text at every size, so it can be copied.
 */
export default function HeroActions() {
  return (
    <div className="hero-actions">
      <a className="pill pill-primary" href={mailtoHref}>
        Email me
        <ArrowRightIcon />
      </a>
      <a className="pill pill-outline" href={resumeHref} download={profile.resume.fileName}>
        Resume
        <span className="pill-meta">PDF · {profile.resume.sizeLabel}</span>
        <DownloadIcon />
      </a>
      <ul className="hero-links" aria-label="Contact details">
        <li>
          <a href={mailtoHref}>{profile.email}</a>
        </li>
        <li>
          <a href={telHref}>{profile.phone.display}</a>
        </li>
        <li>
          <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <ArrowUpRightIcon />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a href={vcardHref} type="text/vcard">
            Save contact
          </a>
        </li>
      </ul>
    </div>
  );
}
