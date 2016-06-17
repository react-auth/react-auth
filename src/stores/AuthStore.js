import utils from '../utils';
import BaseStore from './BaseStore';
import RequestPool from './RequestPool';
import { setSession } from '../actions';

export default class AuthStore extends BaseStore {
  constructor(authProvider, sessionStore) {
    super();
    this.getProfileRequestPool = new RequestPool();
    this.authProvider = authProvider;
    this.sessionError = null;
    this.sessionStore = sessionStore;
    this.resolveSession();
  }

  isAuthenticated(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.resolveSession((err, user) => {
      var authenticated = !err && !this.sessionStore.empty();

      if (authenticated && options.inGroup) {
        if (user.groups) {
          authenticated = utils.groupsMatchExpression(user.groups, options.inGroup);
        } else {
          utils.logWarning('<AuthenticatedRoute> In order to use the inGroup option, you must expand the groups resource for the /me endpoint.');
        }
      }

      callback(err, authenticated);
    });
  }

  loginWithCredentials(options, callback) {
    this.reset();

    this.authProvider.loginWithCredentials(options, (err, result) => {
      if (err) {
        return callback(err);
      }

      this.sessionError = null;
      this.sessionStore.set(result);
      setSession(result);
      this.emitChange();

      callback(null, result);
    });
  }

  loginWithSocialProvider(options, callback) {
    this.authProvider.getSocialProviderRedirectUri(options, (err, result) => {
      if (err) {
        return callback(err);
      }

      window.location.href = result.uri;

      callback();
    });
  }

  signup(options, callback) {
    this.authProvider.signup(options, callback);
  }

  forgotPassword(options, callback) {
    this.authProvider.forgotPassword(options, callback);
  }

  changePassword(options, callback) {
    this.authProvider.changePassword(options, callback);
  }

  updateProfile(data, callback) {
    this.authProvider.updateProfile(data, callback);
  }

  verifyEmail(token, callback) {
    this.authProvider.verifyEmail(token, callback);
  }

  logout(callback) {
    this.authProvider.logout((err) => {
      if (err) {
        return callback(err);
      }

      this.reset();
      this.emitChange();

      callback();
    });
  }

  resolveSession(callback, force) {
    if (!force && (this.sessionError || !this.sessionStore.empty())) {
      return callback && callback(this.sessionError, this.sessionStore.get());
    }

    this.getProfileRequestPool.request((resultCallback) => {
      this.authProvider.getProfile(resultCallback);
    }, (err, result) => {
      if (err) {
        this.sessionError = err;
        this.sessionStore.reset();
        setSession(null);
      } else {
        this.sessionError = null;
        this.sessionStore.set(result);
        setSession(result);
      }

      if (callback) {
        callback(this.sessionError, this.sessionStore.get());
      }

      this.emitChange();
    });
  }

  reset() {
    this.sessionError = null;
    this.sessionStore.reset();
    setSession(null);
  }
}
