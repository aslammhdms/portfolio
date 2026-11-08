/**
 * Search and link-preview data derived from the content layer. scripts/prerender.mjs
 * writes the JSON-LD into dist/index.html, so the structured data cannot drift from
 * the page. Availability is deliberately absent: it is shown only in the hero and Contact.
 */
import { coreSkills } from './derive';
import { experience } from './experience';
import { profile } from './profile';
import { SITE_URL } from './site';

/** Schema.org Person for the home page. */
export function personJsonLd(): Record<string, unknown> {
  const current = experience[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    jobTitle: profile.title,
    url: SITE_URL,
    image: `${SITE_URL}images/aslam-1240.jpg`,
    email: profile.email,
    telephone: profile.phone.tel,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location.city,
      addressCountry: 'AE',
    },
    sameAs: [profile.linkedin.url],
    knowsAbout: coreSkills.map((s) => s.name),
    knowsLanguage: [...profile.languages],
    worksFor: { '@type': 'Organization', name: current.company },
  };
}
