import { availability, coreStack, profile } from '../../content';

/**
 * The four recruiter facts in one row between hairlines (2 × 2 below 1024px).
 * Long and short values are both in the markup; CSS shows the one that fits.
 */
export default function Ledger() {
  return (
    <dl className="hero-ledger">
      <div className="ledger-cell">
        <dt className="ledger-label">Based in</dt>
        <dd className="ledger-value">
          <span className="v-long">{profile.location.long}</span>
          <span className="v-short">{profile.location.short}</span>
        </dd>
      </div>
      <div className="ledger-cell">
        <dt className="ledger-label">Experience</dt>
        <dd className="ledger-value">
          <span className="v-long">{profile.experienceSummary.long}</span>
          <span className="v-short">{profile.experienceSummary.short}</span>
        </dd>
      </div>
      <div className="ledger-cell">
        <dt className="ledger-label">Core stack</dt>
        <dd className="ledger-value has-list">
          {/* Each item stays unbroken; the '·' separators are drawn by CSS and the one
              that would start a wrapped line is clipped (see .ledger-list). */}
          <ul className="ledger-list">
            {coreStack.map((item) => (
              <li key={item.label} className={item.phone ? undefined : 'hide-phone'}>
                {item.label}
              </li>
            ))}
          </ul>
        </dd>
      </div>
      <div className="ledger-cell">
        <dt className="ledger-label">Availability</dt>
        <dd className="ledger-value">
          <span className="dot" aria-hidden="true" />
          {availability.label}
        </dd>
      </div>
    </dl>
  );
}
