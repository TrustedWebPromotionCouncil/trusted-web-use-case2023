import { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';

const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../src/**/*.stories.@(ts)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        controls: false,
      },
    },
  ],
  viteFinal: (config) => {
    config.plugins = [
      vue(),
      vuetify({
        autoImport: true,
        styles: { configFile: 'src/assets/styles/vuetify.scss' },
      }),
    ];
    config.resolve = {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        '~/': `${path.resolve(__dirname, 'public')}/`,
      },
    };
    // common scss
    config.css = {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/base.scss";@import "@/assets/styles/resolution.scss";@import "@/assets/styles/style.scss";`,
        },
      },
    };
    // vue-i18n options
    config.define = {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
    };
    return config;
  },
};

export default config;
