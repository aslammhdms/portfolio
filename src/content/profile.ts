/**
 * Who Aslam is and how to reach him. The single source for the hero, top bar,
 * status bar, terminal, palette and (later) Contact, vCard and print view.
 * Facts follow the résumé (public/doc/Aslam_Muhammed_Resume.pdf).
 */

/** A run of text where some phrases are lifted to ink at weight 500. */
export type RichText = ReadonlyArray<string | { em: string }>;

const BASE = import.meta.env.BASE_URL;

/** Resolve a file in public/ against the deploy base ('/' or '/portfolio/'). */
export const asset = (path: string): string => `${BASE}${path.replace(/^\//, '')}`;

export const profile = {
  name: 'Aslam Muhammed',
  givenName: 'Aslam',
  familyName: 'Muhammed',
  title: 'Software Engineer · .NET & IT Systems',

  location: {
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    countryCode: 'UAE',
    /** Hero ledger, desktop and phone. */
    long: 'Abu Dhabi · UAE resident',
    short: 'Abu Dhabi, UAE',
  },
  residency: 'UAE resident',
  languages: ['English'] as const,
  yearsOfExperience: 5,

  email: 'aslammhdms@gmail.com',
  emailSubject: 'Hello from your portfolio',
  phone: { display: '+971 50 802 4425', tel: '+971508024425' },
  linkedin: { url: 'https://www.linkedin.com/in/aslammhdms', label: 'linkedin.com/in/aslammhdms' },

  resume: {
    path: 'doc/Aslam_Muhammed_Resume.pdf',
    fileName: 'Aslam_Muhammed_Resume.pdf',
    bytes: 77_581,
    /** 77,581 B / 1024 = 75.8 KB, shown rounded. */
    sizeLabel: '76 KB',
  },
  vcard: { path: 'aslam-muhammed.vcf', fileName: 'Aslam-Muhammed.vcf' },

  /** Abu Dhabi time for the status bar clock. */
  timeZone: { iana: 'Asia/Dubai', abbr: 'GST', code: 'AUH', utcOffsetMinutes: 240, label: 'GST, UTC+4' },

  /** Hero lede. The second sentence is dropped on phones and short screens. */
  lede: {
    first: [
      'I build ',
      { em: 'ERP, retail and internal systems' },
      ' end to end, from SQL Server to the handhelds on the shop floor.',
    ] as RichText,
    second: [
      'The HelpDesk platform I built at Al Madina is used by ',
      { em: '100+ staff across 19 branches' },
      '.',
    ] as RichText,
  },

  experienceSummary: { long: '5 years · ERP & retail', short: '5 years' },
} as const;

export const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(profile.emailSubject)}`;
export const telHref = `tel:${profile.phone.tel}`;
export const resumeHref = asset(profile.resume.path);
export const vcardHref = asset(profile.vcard.path);
