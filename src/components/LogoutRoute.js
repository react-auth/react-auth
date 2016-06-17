import React from 'react';
import ReactRouter, { Route } from 'react-router';

import context from './../context';
import { logout } from './../actions';

export default class LogoutRoute extends Route {
  static defaultProps = {
    onEnter(nextState, replace, callback) {
      logout().then(() => {
        var router = context.getRouter();
        var homeRoute = router.getHomeRoute();
        var loginRoute = router.getLoginRoute();
        var redirectTo = this.redirectTo || (homeRoute || {}).path || (loginRoute || {}).path || '/';

        replace(redirectTo);

        callback();
      }).catch((err) => {
        callback(err);
      });
    }
  };
}
