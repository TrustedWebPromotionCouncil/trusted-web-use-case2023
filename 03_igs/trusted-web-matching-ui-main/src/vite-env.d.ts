/// <reference types="vite/client" />

import { DefineComponent } from 'vue';
declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv extends Readonly<Record<string, string | number>> {
  readonly VITE_WEB_ENDPOINT: string;
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_STORAGE_KEY: string;
  readonly VITE_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
