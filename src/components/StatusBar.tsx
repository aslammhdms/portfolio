import { useEffect, useState } from 'react';
import useActiveSection from '../hooks/useActiveSection';
import { useTheme } from '../contexts/ThemeContext';

const SECTION_PATH: Record<string, string> = {
  home: '~',
  about: '~/about',
  skills: '~/stack',
  projects: '~/work',
  contact: '~/contact',
};

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Dubai',
});

/** tmux-style live status bar: current section, session uptime, Abu Dhabi time. */
export default function StatusBar() {
  const active = useActiveSection();
  const { theme } = useTheme();
  const [now, setNow] = useState(() => new Date());
  const [boot] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const up = Math.max(0, Math.floor((now.getTime() - boot) / 1000));
  const uptime = `${String(Math.floor(up / 60)).padStart(2, '0')}:${String(up % 60).padStart(2, '0')}`;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/85 backdrop-blur-md print:hidden"
      aria-hidden="true"
    >
      <div className="shell flex h-7 items-center justify-between font-mono text-[11px] text-faint">
        <div className="flex items-center gap-3">
          <span className="text-accent">{SECTION_PATH[active] ?? '~'}</span>
          <span className="hidden sm:inline">aslam.dev</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">up {uptime}</span>
          <span className="hidden md:inline">{theme}</span>
          <span>AUH {timeFmt.format(now)} GST</span>
          <span className="flex items-center gap-1.5 text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" /> live
          </span>
        </div>
      </div>
    </div>
  );
}
