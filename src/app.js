import { EventEmitter } from 'events';

import utils from './utils';
import context from './context';
import { constants } from './actions';

import { StormpathAuthProvider } from './providers';
import { AuthStore, SessionStore } from './stores';
import { FluxDispatcher, ReduxDispatcher } from './dispatchers';

function makeAuthProvider(options) {
  let DefaultAuthProvider = {};
  let authProvider = DefaultAuthProvider;

  if (options.use) {
    switch (options.use) {
      case 'stormpath':
        authProvider = new StormpathAuthProvider(options);
        break;
    }
  }

  return authProvider;
}

class App extends EventEmitter {
  constructor() {
    super();
    this.initialized = false;
  }

  isInitialized() {
    return this.initialized;
  }

  init(options) {
    options = options || {};

    if (this.isInitialized()) {
      throw new Error('ReactAuth is already initialized.');
    }

    this.initialized = true;

    var sessionStore = new SessionStore();
    var authProvider = makeAuthProvider(options.authProvider);
    var authStore = new AuthStore(authProvider, sessionStore);

    context.setSessionStore(sessionStore);
    context.setAuthStore(authStore);

    // If there's no specified dispatcher, then default to flux.
    var dispatcher = options.dispatcher || { type: 'flux' };

    var userReducer = (payload) => {
      switch(payload.type) {
        case constants.AUTH_LOGIN_WITH_CREDENTIALS:
          authStore.loginWithCredentials(payload.options, payload.callback);
          break;
        case constants.AUTH_LOGIN_WITH_SOCIAL_PROVIDER:
          authStore.loginWithSocialProvider(payload.options, payload.callback);
          break;
        case constants.AUTH_SIGNUP:
          authStore.signup(payload.options, payload.callback);
          break;
        case constants.AUTH_FORGOT_PASSWORD:
          authStore.forgotPassword(payload.options, payload.callback);
          break;
        case constants.AUTH_CHANGE_PASSWORD:
          authStore.changePassword(payload.options, payload.callback);
          break;
        case constants.AUTH_UPDATE_PROFILE:
          authStore.updateProfile(payload.options.data, payload.callback);
          break;
        case constants.AUTH_VERIFY_EMAIL:
          authStore.verifyEmail(payload.options.spToken, payload.callback);
          break;
        case constants.AUTH_LOGOUT:
          authStore.logout(payload.callback);
          break;
      }
      return true;
    };

    switch (dispatcher.type) {
      case 'flux':
        dispatcher = new FluxDispatcher(userReducer);
        break;
      case 'redux':
        dispatcher = new ReduxDispatcher(userReducer, dispatcher.store);
        break;
      default:
        throw new Error('Stormpath SDK: Invalid dispatcher type ' + dispatcher.type);
    }

    context.setDispatcher(dispatcher);
  }
}

export default new App()
