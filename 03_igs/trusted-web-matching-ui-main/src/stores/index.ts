import { App, InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { secureStorage } from '@/services/';
import { CONST } from '@/models';

interface RootState {}
// define injection key
export const rootStoreKey: InjectionKey<Store<RootState>> = Symbol();

export const rootStore = createStore<RootState>({
  // state: secureStorage.getItem(CONST.STORAGE_KEY),
  mutations: {},
  actions: {},
  modules: {},
});

rootStore.subscribe((mutation, state) => {
  secureStorage.setItem(CONST.STORAGE_KEY, state);
});

const storeBoot = (app: App<Element>) => {
  app.use(rootStore, rootStoreKey);
};

export default storeBoot;
