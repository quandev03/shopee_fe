/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        orange: '#ee4d2d',
        l_orange: '#f05d40'
      },
      height: {
        auth__hero: '600px'
      },
      minHeight: {
        auth_hero: '600px'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          width: '100%',
          padding: theme('spacing.4'),
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: theme('columns.7xl')
        }
      });
    })
  ]
};
