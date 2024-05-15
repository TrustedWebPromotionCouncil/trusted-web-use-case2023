/** @type {import('tailwindcss').Config} */
// import { defaultTheme } from 'tailwindcss/defaultTheme';

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'demo-darkGray': '#ACB3B7',
        'demo-gray': '#949497',
        'demo-yellow': '#F2A32D',
        'demo-blue': '#2889F2',
        'demo-green': '#46B164',
        'demo-card': '#F9F9F9',
        'demo-header': '#F3F3F3',
        'demo-modal': '#999999',
        'tab-off': '#F2F2F2',
        'demo-blur-blue': '#E8F1FE',
        'demo-success': '#46B164',
        'demo-nav-yellow': '#f5ba62',
        'demo-light-gray': '#F1F1F1',
        'demo-blue-gray': '#D8D8DB',
      },
      textColor: {
        'demo-link': '#0017C1',
        'demo-gray': '#949497',
        'demo-yellow': '#F2A32D',
        'demo-blue': '#2889F2',
        'demo-green': '#46B164',
        'google-login': '#757575',
        vc: '#818080',
        'vc-green': '#46B164',
        'vc-orange': '#F2A32D',
        'demo-alert': '#EC0000',
        'demo-current-page': '#626264',
        'demo-thin': '#989898',
        'demo-success': '#46B164',
      },
      borderColor: {
        'demo-gray': '#949497',
        'demo-yellow': '#F2A32D',
        'demo-blue': '#2889F2',
        'demo-green': '#46B164',
        'demo-card': '#EAEAEA',
        vc: '#B3B3B3',
      },
      fill: {
        'vc-green': '#46B164',
        'vc-orange': '#F2A32D',
        'demo-blue': '#2889F2',
        'demo-success': '#46B164',
      },
      stroke: {
        'demo-blue': '#2889F2',
      },
      colors: {
        'vc-green': 'rgba(93, 206, 65, 0.3)',
      },

      fontFamily: {
        sans: ['var(--font-noto)', ...defaultTheme.fontFamily.sans],
        roboto: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
