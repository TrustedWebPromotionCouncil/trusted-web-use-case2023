import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify/lib/framework.mjs';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { App } from 'vue';

/**
 * Import only the components you use.
 * FYI: https://vuetifyjs.com/en/components/all/
 */
import {
  VApp,
  VAppBar,
  VBadge,
  VBtn,
  VCol,
  VContainer,
  VDivider,
  VFooter,
  VForm,
  VIcon,
  VLayout,
  VMain,
  VMenu,
  VRow,
  VSnackbar,
  VSpacer,
  VTab,
  VTable,
  VTabs,
  VTextField,
  VTextarea,
  VWindow,
  VWindowItem,
} from 'vuetify/components';
const useComponents = [
  VApp,
  VAppBar,
  VBadge,
  VBtn,
  VCol,
  VContainer,
  VDivider,
  VFooter,
  VForm,
  VIcon,
  VLayout,
  VMain,
  VMenu,
  VRow,
  VSnackbar,
  VSpacer,
  VTab,
  VTable,
  VTabs,
  VTextField,
  VTextarea,
  VWindow,
  VWindowItem,
];

const vuetify = createVuetify({
  components: useComponents,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

const uiBoot = (app: App<Element>) => {
  app.use(vuetify);
};

export default uiBoot;
