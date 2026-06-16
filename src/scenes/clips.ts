// Scene → video clip registry.
//
// Paths are built from import.meta.env.BASE_URL so they resolve under both the
// Cloudflare deploy (base '/') and the GitHub Pages deploy (base '/portfolio/').
// File stems are versioned (`hero.v1.*`) because Vite copies public/ verbatim
// without content-hashing — bump the version when you re-export a clip to bust
// the CDN/browser cache.
//
// Drop the real Higgsfield exports (re-encoded via scripts/encode-videos.sh)
// into public/videos/. Until then, VideoBackdrop falls back to an on-brand CSS
// placeholder, so the site is fully functional with no assets present.

const base = import.meta.env.BASE_URL;

/** Accent the scrim leans on, per scene, to keep the Terminal Ink palette. */
export type SceneTint = 'indigo' | 'teal' | 'duo';

export interface Clip {
  id: string;
  /** Public path to the WebM (preferred) and MP4 (fallback) sources. */
  webm: string;
  mp4: string;
  /** Still shown before the video loads and as the reduced-motion/error fallback. */
  poster: string;
  /** Fallback duration (s) used to map scroll→time until real metadata loads. */
  durationHint: number;
  tint: SceneTint;
}

const videosDir = `${base}videos/`;
const v = (stem: string): Pick<Clip, 'webm' | 'mp4' | 'poster'> => ({
  webm: `${videosDir}${stem}.v1.webm`,
  mp4: `${videosDir}${stem}.v1.mp4`,
  poster: `${videosDir}${stem}.poster.webp`,
});

export type SceneId = 'hero' | 'about' | 'skills' | 'projects' | 'contact';

export const clips: Record<SceneId, Clip> = {
  hero: { id: 'hero', ...v('hero'), durationHint: 8, tint: 'indigo' },
  about: { id: 'about', ...v('about'), durationHint: 8, tint: 'teal' },
  skills: { id: 'skills', ...v('skills'), durationHint: 8, tint: 'indigo' },
  projects: { id: 'projects', ...v('projects'), durationHint: 8, tint: 'teal' },
  contact: { id: 'contact', ...v('contact'), durationHint: 8, tint: 'duo' },
};
