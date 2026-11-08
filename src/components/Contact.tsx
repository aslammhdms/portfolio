import { useEffect, useState } from 'react';
import {
  availability,
  contactSection,
  mailtoHref,
  profile,
  profileSummary,
  resumeHref,
  telHref,
  vcardHref,
} from '../content';
import { abuDhabiTime, offsetFromVisitor } from '../lib/time';
import CopyButton from './CopyButton';
import EmailButton from './EmailButton';
import SectionRail from './SectionRail';
import { ArrowUpRightIcon, CopyIcon, DownloadIcon } from './icons';

/**
 * 'Abu Dhabi · 15:43 GST (UTC+4) — 3 h ahead of you'. The time and the visitor's
 * offset need the clock and the visitor's time zone, so they appear after mount; the
 * prerendered line names only the place and the zone. The offset is left out when it
 * is zero. Updated on the minute, never by the second.
 */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  const [offset, setOffset] = useState<string | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const now = new Date();
      const t = abuDhabiTime(now);
      setTime(`${t.hh}:${t.mm}`);
      setOffset(offsetFromVisitor(now));
      // Next update just after the next minute starts.
      timer = window.setTimeout(tick, (60 - now.getSeconds()) * 1000 + 50);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  const zone = profile.timeZone;
  return (
    <p className="contact-time">
      <span className="now-dot" aria-hidden="true" />
      {profile.location.city} · {time && <span className="contact-time-digits">{time} </span>}
      {zone.abbr} (UTC+{zone.utcOffsetMinutes / 60})
      {offset && <span className="contact-time-offset"> — {offset}</span>}
    </p>
  );
}

/**
 * 04 — Contact. The availability sentence (the only place besides the hero ledger),
 * the address set large and fitted to columns 1–8 with Copy and Email me beside it,
 * then a ledger of every other way in, and the local time.
 */
export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="shell">
        <SectionRail id="contact" titleId="contact-title" title={contactSection.title} meta={profile.location.long}>
          {availability.sentence} {contactSection.fastest}
        </SectionRail>

        <div className="contact-mail">
          <div className="contact-address-col">
            <a className="contact-address" href={mailtoHref}>
              {profile.email}
            </a>
          </div>
          <div className="contact-mail-actions">
            <EmailButton />
            <CopyButton
              text={profile.email}
              label="Copy"
              ariaLabel="Copy email address"
              announce="Email address copied"
              className="copy-text"
              icon={<CopyIcon />}
            />
          </div>
        </div>

        <dl className="facts-ledger contact-ledger">
          <div className="facts-cell">
            <dt className="facts-label">Phone</dt>
            <dd className="facts-value">
              <a className="facts-link" href={telHref}>
                {profile.phone.display}
              </a>
            </dd>
          </div>
          <div className="facts-cell">
            <dt className="facts-label">LinkedIn</dt>
            <dd className="facts-value">
              <a className="facts-link" href={profile.linkedin.url} target="_blank" rel="noopener noreferrer">
                <span className="v-long">{profile.linkedin.label}</span>
                <span className="v-short">Open profile</span>
                <ArrowUpRightIcon />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </dd>
          </div>
          <div className="facts-cell">
            <dt className="facts-label">Resume</dt>
            <dd className="facts-value">
              <a className="facts-link" href={resumeHref} download={profile.resume.fileName}>
                <span className="sr-only">Download the resume, </span>
                PDF
                <DownloadIcon />
              </a>{' '}
              <span className="facts-meta">· {profile.resume.sizeLabel}</span>
            </dd>
          </div>
          <div className="facts-cell">
            <dt className="facts-label">Contact card</dt>
            <dd className="facts-value">
              <a className="facts-link" href={vcardHref} download={profile.vcard.fileName} type="text/vcard">
                Save .vcf
                <DownloadIcon />
              </a>
            </dd>
          </div>
          <div className="facts-cell facts-cell-copy">
            <dt className="facts-label">For a hiring system</dt>
            <dd className="facts-value">
              <CopyButton
                text={profileSummary()}
                label="Copy profile"
                announce="Profile copied as plain text: four lines"
                className="copy-profile"
                icon={<CopyIcon />}
              />
            </dd>
          </div>
        </dl>

        <LocalTime />
      </div>
    </section>
  );
}
