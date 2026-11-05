import { FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { useTheme, type Theme } from '../contexts/ThemeContext';
import { TOP_ID, lastUpdatedYear, mailtoHref, profile, sections } from '../content';

const THEMES: Theme[] = ['dark', 'light'];

export default function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="border-t border-rule py-12">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <a href={`#${TOP_ID}`} className="wordmark">
            <span className="a">{profile.givenName}</span> <span className="m">{profile.familyName}</span>
          </a>
          <p className="mt-3 max-w-xs text-sm text-ink-2">
            {profile.title} · {profile.location.short}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="py-1 font-mono text-sm text-ink-2 transition-colors hover:text-ink">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dark is the default for everyone; light is only ever an explicit, saved choice. */}
          <div className="flex items-center rounded-full border border-rule-strong p-0.5" role="group" aria-label="Theme">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={theme === t}
                onClick={() => setTheme(t)}
                className={`min-h-[32px] rounded-full px-3 font-mono text-xs capitalize transition-colors ${
                  theme === t ? 'bg-ink text-canvas' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <a
            href={profile.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in a new tab)"
            className="grid h-11 w-11 place-items-center border border-rule text-ink-2 transition-colors hover:border-rule-strong hover:text-ink"
          >
            <FaLinkedin size={17} aria-hidden="true" />
          </a>
          <a
            href={mailtoHref}
            aria-label="Email"
            className="grid h-11 w-11 place-items-center border border-rule text-ink-2 transition-colors hover:border-rule-strong hover:text-ink"
          >
            <HiOutlineMail size={19} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="shell mt-8 border-t border-rule pt-6">
        {/* The year comes from the content, not the clock, so the prerendered HTML always matches. */}
        <p className="font-mono text-xs text-ink-3">
          © {lastUpdatedYear} {profile.name} · Built with React, TypeScript &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
