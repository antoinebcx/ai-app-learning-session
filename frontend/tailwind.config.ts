/**
 * Tailwind config = our design system in one file.
 * Tokens (colors, fonts) live here and feed every utility class used in the app.
 * Light mode only by design — the app is shown on projectors during the session.
 *
 *   ink     → text colors (primary / soft / muted)
 *   surface → page and panel backgrounds
 *   line    → borders and dividers
 *   accent  → the single highlight color (OpenAI-style green, used sparingly)
 */
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#18181B', // zinc-900 — body text
          soft: '#52525B',    // zinc-600 — secondary text
          muted: '#A1A1AA',   // zinc-400 — placeholder / disabled
        },
        surface: {
          DEFAULT: '#FFFFFF', // page background
          subtle: '#FAFAF9',  // soft alt panel
        },
        line: {
          DEFAULT: '#E4E4E7', // zinc-200 — standard divider
          subtle: '#F4F4F5',  // zinc-100 — lighter divider
        },
        accent: {
          DEFAULT: '#10A37F', // OpenAI green — interactive accents
          soft: '#ECFDF5',    // emerald-50 — pale tint for highlights
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        // intentionally minimal — we lean on borders, not shadows
        card: '0 1px 2px rgba(24, 24, 27, 0.04)',
      },
    },
  },
  plugins: [],
} satisfies Config;
