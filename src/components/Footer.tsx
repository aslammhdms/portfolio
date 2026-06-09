import { FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

const links = [
  { name: 'About', href: '#about' },
  { name: 'Stack', href: '#skills' },
  { name: 'Work', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <a href="#home" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface font-mono text-sm font-semibold text-accent">
              A
            </span>
            <span className="font-mono text-sm text-fg">aslam<span className="text-accent">.dev</span></span>
          </a>
          <p className="mt-3 max-w-xs text-sm text-muted">
            .NET Developer & IT Systems Engineer — Abu Dhabi, UAE.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {links.map((l) => (
            <a key={l.name} href={l.href} className="font-mono text-sm text-muted transition-colors hover:text-fg">
              {l.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/aslammhdms"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg"
          >
            <FaLinkedin size={17} />
          </a>
          <a
            href="mailto:aslammhdms@gmail.com"
            aria-label="Email"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg"
          >
            <HiOutlineMail size={19} />
          </a>
        </div>
      </div>

      <div className="shell mt-8 border-t border-line pt-6">
        <p className="font-mono text-xs text-faint">
          © {year} Aslam Muhammed · Built with React, TypeScript & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
