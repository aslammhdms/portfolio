import Reveal from './Reveal';

interface SectionHeaderProps {
  index: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ index, title, subtitle }: SectionHeaderProps) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="mb-4 flex items-center gap-4">
        <span className="font-mono text-xs font-medium tracking-[0.2em] text-accent">{index}</span>
        <span className="h-px w-16 bg-line" aria-hidden="true" />
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{subtitle}</p>}
    </Reveal>
  );
}
