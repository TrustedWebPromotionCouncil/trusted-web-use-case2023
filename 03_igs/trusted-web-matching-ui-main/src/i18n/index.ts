import { createI18n } from 'vue-i18n';
import jaJp from '@/i18n/ja-JP.json';
// import enUS from '@/i18n/en-US.json';

const i18n = createI18n({
  locale: 'ja-JP',
  fallbackLocale: 'en-US',
  formatFallbackMessages: true,
  messages: {
    'ja-JP': jaJp,
    // 'en-US': enUS,
  },
});

export default i18n;
