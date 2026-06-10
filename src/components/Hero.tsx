import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowDown, HiOutlineMail } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import Terminal from './Terminal';
import AsciiPortrait from './AsciiPortrait';

const base = import.meta.env.BASE_URL;

export default function Hero() {
  const reduce = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);

  // Soft accent glow that tracks the cursor — desktop + motion-allowed only.
  useEffect(() => {
    if (reduce) return;
    const el = glowRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    };
    el.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const fade = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] as const },
  });

  return (
    <section
      id="home"
      ref={glowRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-20"
      style={{ ['--mx' as string]: '70%', ['--my' as string]: '30%' }}
    >
      {/* Dotted grid, faded toward the edges */}
      <div
        className="grid-bg pointer-events-none absolute inset-0 opacity-60"
        style={{ maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)' }}
        aria-hidden="true"
      />
      {/* Cursor-tracking accent glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(420px circle at var(--mx) var(--my), rgb(var(--accent) / 0.10), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="shell relative z-10 grid items-center gap-12 lg:grid-cols-12">
        {/* Text + terminal column */}
        <div className="lg:col-span-7">
          <motion.div {...fade(0)} className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.2em] text-faint">01</span>
            <span className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              Available for full-time roles
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.08)}
            className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Aslam Muhammed
          </motion.h1>

          <motion.h2
            {...fade(0.16)}
            className="mt-4 font-display text-2xl font-medium tracking-tight text-muted sm:text-3xl"
          >
            .NET Developer <span className="text-fg">&amp;</span>{' '}
            <span className="text-accent">IT Systems Engineer</span>
          </motion.h2>

          <motion.p {...fade(0.24)} className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Based in Abu Dhabi, with 4+ years building across{' '}
            <span className="text-fg">enterprise retail systems</span>,{' '}
            <span className="text-fg">full-stack applications</span>, and{' '}
            <span className="text-fg">infrastructure</span>.
          </motion.p>

          <motion.div {...fade(0.32)} className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn-primary">
              View work
            </a>
            <a
              href={`${base}doc/Aslam_Muhammed_Resume.pdf`}
              download="Aslam_Muhammed_Resume.pdf"
              className="btn-ghost"
            >
              Résumé <FiArrowUpRight size={16} />
            </a>
            <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
            <a
              href="https://www.linkedin.com/in/aslammhdms"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="mailto:aslammhdms@gmail.com"
              aria-label="Email"
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg"
            >
              <HiOutlineMail size={20} />
            </a>
          </motion.div>

          {/* The working terminal — the hero's signature piece */}
          <motion.div {...fade(0.42)} className="mt-9 max-w-xl">
            <Terminal />
          </motion.div>
        </div>

        {/* Portrait column */}
        <motion.div {...fade(0.3)} className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="relative">
            <div
              className={`absolute -inset-6 rounded-[28px] bg-accent/20 blur-3xl ${reduce ? '' : 'animate-float-slow'}`}
              aria-hidden="true"
            />
            <div className="relative w-64 overflow-hidden rounded-2xl border border-line bg-surface p-2 sm:w-72 lg:w-80">
              <AsciiPortrait />
              <div className="flex items-center justify-between px-1 pt-2 pb-1 font-mono text-xs text-faint">
                <span>// Abu Dhabi, UAE</span>
                <span className="text-signal">● online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue (sits above the status bar) */}
      <motion.a
        href="#about"
        {...fade(0.6)}
        aria-label="Scroll to about"
        className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 text-faint transition-colors hover:text-accent md:block"
      >
        <HiArrowDown size={20} className={reduce ? '' : 'animate-float-slow'} />
      </motion.a>
    </section>
  );
}
