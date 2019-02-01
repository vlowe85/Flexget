import Vue from "nativescript-vue";

// Setup some dev tools, not supported in preview app
import VueDevtools from 'nativescript-vue-devtools';
Vue.use(VueDevtools,  { host: '192.168.64.213' });
// Vue.use(VueDevtools,  { host: '192.168.0.16' });
Vue.config.silent = false;
Vue.config.devtools = true;

// Register plugins
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);
Vue.registerElement('LottieView', () => require('nativescript-lottie').LottieView);
Vue.registerElement('ImageCacheIt', () => require('nativescript-image-cache-it').ImageCacheIt);
Vue.registerElement('PullToRefresh', () => require('nativescript-pulltorefresh').PullToRefresh);
//Vue.registerElement("PreviousNextView", () => require("nativescript-iqkeyboardmanager").PreviousNextView);

// Set up routes as a prototype to use throughout the app.
import routes from '~/router';
Vue.prototype.$routes = routes;

import Cycle from './packages/lifecycle';
Vue.use(Cycle);

import * as appSettings from "tns-core-modules/application-settings";
Vue.prototype.$settings = appSettings;

// Vuex global store
import store from '~/store';

// Start
new Vue({
    store,
    render: h => h("frame", [h(store.getters.isLoggedIn ? routes.Home : routes.Login)])
}).$start();
