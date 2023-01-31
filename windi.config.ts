import { DEFAULT_THEME as mantineDefaultTheme } from '@mantine/core';
import type { MantineThemeColors } from '@mantine/core';
import windiDefaultColors from 'windicss/colors';
import type { DefaultColors } from 'windicss/types/config/colors';

type ConvertedWindiColors = {
  [k in keyof MantineThemeColors]: DefaultColors[keyof DefaultColors];
};

// Don't override WindiCSS colors
const convertColor = (
  mantineColors: MantineThemeColors,
  windiColors: DefaultColors,
) => {
  const newColorPalette = {} as ConvertedWindiColors;
  Object.keys(mantineColors).forEach((colorName) => {
    if (windiColors[colorName] instanceof Object === false) {
      const newColor = {};
      mantineColors[colorName].forEach((_colorHex, index) => {
        newColor[`${index * 100}`] = mantineColors[colorName][index];
      });
      newColor['50'] = newColor['0'];
      delete newColor['0'];
    }
  });

  return newColorPalette;
};

export default {
  alias: {
    // ...
  },
  attributify: {
    prefix: 'w:',
  },
  darkMode: 'class',
  extract: {
    exclude: ['node_modules', '.git', '.next/**/*'],
    include: ['**/*.{html,mdx,js,jsx,ts,tsx,css}'],
  },
  plugins: [],
  shortcuts: {
    // ...
  },
  safelist: [
    // ...
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2e8555',
          dark: '#29784c',
          darker: '#277148',
          darkest: '#205d3b',
          light: '#33925d',
          lighter: '#359962',
          lightest: '#3cad6e',
        },
        'dark-primary': {
          DEFAULT: '#25c2a0',
          dark: '#21af90',
          darker: '#1fa588',
          darkest: '#1a8870',
          light: '#29d5b0',
          lighter: '#32d8b4',
          lightest: '#4fddbf',
        },
        ...convertColor(mantineDefaultTheme.colors, windiDefaultColors),
      },
      fontFamily: {
        sans: 'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        mono: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
      },
    },
  },
};
