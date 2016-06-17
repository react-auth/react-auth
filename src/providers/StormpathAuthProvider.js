import utils from '../utils';
import BaseProvider from './BaseProvider';

let providerAuthorizationUris = {
  github: 'https://github.com/login/oauth/authorize',
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
  linkedin: 'https://www.linkedin.com/uas/oauth2/authorization',
  facebook: 'https://www.facebook.com/dialog/oauth'
};

function createStateCookie() {
  var stateId = utils.uuid();

  document.cookie = 'oauthStateToken=' + stateId;

  return stateId;
}

function buildRedirectUri(provider) {
  return location.protocol + '//' + location.host + '/callbacks/' + provider.providerId;
}

function buildAuthorizationUri(provider, scope, redirectUri) {
  var authorizationUri = providerAuthorizationUris[provider.providerId];

  if (!authorizationUri) {
    return false;
  }

  var queryString = {
    client_id: provider.clientId,
    scope: scope || provider.scope,
    redirect_uri: redirectUri || buildRedirectUri(provider),
    state: createStateCookie(),
    response_type: 'code'
  };

  return authorizationUri + '?' + utils.encodeQueryString(queryString);
}

function findSocialProvider(accountStores, providerId) {
  var provider;

  for (var i = 0; i < accountStores.length; i++) {
    var item = accountStores[i];

    if (item.provider.providerId === providerId) {
      provider = item.provider;
      break;
    }
  }

  return provider;
}

export default class StormpathAuthProvider extends BaseProvider {
  constructor(endpoints) {
    var defaultEndpoints = {
      me: '/me',
      login: '/login',
      register: '/register',
      verifyEmail: '/verify',
      forgotPassword: '/forgot',
      changePassword: '/change',
      logout: '/logout'
    };

    super(utils.mergeObjects(defaultEndpoints, endpoints));
  }

  _unwrapAccountResult(callback) {
    return (err, result) => {
      if (err) {
        return callback(err);
      }

      callback(null, result.account || result || {});
    };
  }

	getProfile(callback) {
    this._makeRequest('get', this.endpoints.me, null, this._unwrapAccountResult(callback));
	}

  updateProfile(data, callback) {
    this._makeRequest('post', this.endpoints.me, data, callback);
  }

	loginWithCredentials(options, callback) {
    this._makeRequest('post', this.endpoints.login, options, this._unwrapAccountResult(callback));
	}

  getSocialProviderRedirectUri(options, callback) {
    let providerId = options.providerId;

    if (!providerId || !(providerId in providerAuthorizationUris)) {
      return callback(new Error('Social provider \'' + providerId + '\' not supported.'));
    }

    this._makeRequest('get', this.endpoints.login, null, (err, result) => {
      var provider = findSocialProvider(result.accountStores, providerId);

      if (!provider) {
        return callback(new Error('Social provider ' + utils.translateProviderIdToName(providerId) + ' not configured.'));
      }

      buildAuthorizationUri(provider, options.scope, options.redirectUri);
    });
  }

  signup(options, callback) {
    this._makeRequest('post', this.endpoints.register, options, this._unwrapAccountResult(callback));
  }

  verifyEmail(token, callback) {
    this._makeRequest('get', this.endpoints.verifyEmail + '?sptoken=' + encodeURIComponent(token), null, callback);
  }

  forgotPassword(options, callback) {
    this._makeRequest('post', this.endpoints.forgotPassword, options, callback);
  }

  changePassword(options, callback) {
    this._makeRequest('post', this.endpoints.changePassword, options, callback);
  }

	logout(callback) {
    this._makeRequest('post', this.endpoints.logout, null, callback);
	}
}
