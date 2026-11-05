/**
 * The few inline icons the new chrome needs. Cascadia Mono has no arrows or ⌘,
 * so these are SVG, drawn on a 16 px grid with a 1.8 stroke in currentColor.
 * All are decorative (aria-hidden); the text next to them carries the meaning.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, viewBox = '0 0 16 16', className = 'icon', ...rest }: IconProps) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" focusable="false" {...rest}>
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5 14 14" />
  </Icon>
);

export const DownloadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 2.5v9M4 8l4 4 4-4M3 14h10" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 8h10.5M9 4l4 4-4 4" />
  </Icon>
);

export const ArrowUpRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 11l6-6M6 5h5v5" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Icon>
);

/** The ⌘ (place of interest) sign, after Lucide's "command" icon (ISC licence). */
export const CommandIcon = (p: IconProps) => (
  <Icon viewBox="0 0 24 24" {...p}>
    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
  </Icon>
);
