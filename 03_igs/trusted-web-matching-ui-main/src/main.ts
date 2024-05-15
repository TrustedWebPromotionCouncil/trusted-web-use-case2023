import uiBoot from './ui-boot';
import './assets/styles/style.scss';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import storeBoot from './stores';
import i18n from './i18n';

const app = createApp(App);

// ui setting.
uiBoot(app);
// store setting.
storeBoot(app);
// router setting.
app.use(router);
// i18n setting
app.use(i18n);

app.mount('#app');
