import context from './../context';
import constants from './constants';

function dispatch(event) {
  setTimeout(() => {
    context.getDispatcher().dispatch(event);
  }, 0);
}

function wrapPromiseCallbacks(accept, reject) {
  return function (err, result) {
    if (err) {
      return reject(err);
    }
    accept(result);
  };
};

export constants from './constants';

export function loginWithCredentials(options) {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_LOGIN_WITH_CREDENTIALS,
      options: options,
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}

export function loginWithSocialProvider(options) {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_LOGIN_WITH_SOCIAL_PROVIDER,
      options: options,
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}

export function signup(options) {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_SIGNUP,
      options: options,
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}

export function forgotPassword(options) {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_FORGOT_PASSWORD,
      options: options,
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}

export function verifyEmail(token) {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_VERIFY_EMAIL,
      options: {
        token: token
      },
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}

export function changePassword(options) {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_CHANGE_PASSWORD,
      options: options,
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}

export function updateProfile(data) {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_UPDATE_PROFILE,
      options: {
        data: data
      },
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}

export function setSession(data) {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_SET_SESSION,
      options: {
        data: data
      },
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}

export function logout() {
  return new Promise((accept, reject) => {
    dispatch({
      type: constants.AUTH_LOGOUT,
      callback: wrapPromiseCallbacks(accept, reject)
    });
  });
}
