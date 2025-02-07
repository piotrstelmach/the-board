const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const withMT = require('@material-tailwind/react/utils/withMT');

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6366F1',
          dark: '#818CF8',
        },
        secondary: {
          light: '#EC4899',
          dark: '#F472B6',
        },
        accent: {
          light: '#10B981',
          dark: '#34D399',
        },
        background: {
          light: '#F3F4F6',
          dark: '#0F172A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',
        },
        text: {
          primary: {
            light: '#111827',
            dark: '#E2E8F0',
          },
          secondary: {
            light: '#6B7280',
            dark: '#94A3B8',
          },
        },
        border: {
          light: '#D1D5DB',
          dark: '#334155',
        },
        error: {
          light: '#EF4444',
          dark: '#DC2626',
        },
      },
    },
  },
  plugins: [],
});
