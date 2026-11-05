/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable from src/styles/tokens.css (RGB channels), so
// the theme switch is one attribute and /alpha modifiers keep working.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Themes are driven by [data-theme] on <html>, not by dark: variants.
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        raised: token('raised'),
        rule: token('rule'),
        'rule-strong': token('rule-strong'),
        ink: token('ink'),
        'ink-2': token('ink-2'),
        'ink-3': token('ink-3'),
        accent: token('accent'),
        'accent-hover': token('accent-hover'),
        'accent-ink': token('accent-ink'),
        'on-accent': token('on-accent'),
        'accent-wash': token('accent-wash'),
        selection: token('selection'),

        // Legacy aliases: the sections not yet rebuilt (About, Skills, Projects,
        // Contact, Footer, Terminal, CommandPalette) keep their class names but
        // render in the new palette. Remove once those sections are rebuilt.
        fg: token('ink'),
        muted: token('ink-2'),
        faint: token('ink-3'),
        line: token('rule'),
        elevated: token('raised'),
        signal: token('accent-ink'),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
};
