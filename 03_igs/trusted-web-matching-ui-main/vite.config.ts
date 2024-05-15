import { UserConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';

export default ({ mode }) => {
  // Get port number from .env
  const env = loadEnv(mode, process.cwd());
  const port = env.VITE_PORT ? Number(env.VITE_PORT) : 19132;

  // vite config
  const config: UserConfig = {
    base: '/',
    // server setting
    server: {
      host: '0.0.0.0',
      port,
    },
    build: {
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        external: ['test/**', 'stories/**'],
      },
    },
    optimizeDeps: {
      exclude: ['vuetify'],
    },
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
        styles: { configFile: 'src/assets/styles/vuetify.scss' },
      }),
    ],
    // path alias
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        '~/': `${path.resolve(__dirname, 'public')}/`,
      },
    },
    // common scss
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/base.scss";@import "@/assets/styles/resolution.scss";`,
        },
      },
    },
    // vue-i18n options
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
    },
  };
  return config;
};
