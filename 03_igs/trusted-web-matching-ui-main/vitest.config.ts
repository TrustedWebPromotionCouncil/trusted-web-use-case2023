/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vitest/config';

const vitestConfig = defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
      '~/': `${path.resolve(__dirname, 'public')}/`,
    },
  },
});
export default vitestConfig;
