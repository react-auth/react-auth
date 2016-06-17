import { Route } from 'react-router';

import context from './../context';

export default class LoginRoute extends Route {
  static defaultProps = {
    onEnter(nextState, replace, callback) {
      context.authStore.isAuthenticated((err, authenticated) => {
        if (authenticated) {
          var router = context.getRouter();
          var homeRoute = router.getHomeRoute();
          var authenticatedHomeRoute = router.getAuthenticatedHomeRoute();
          var redirectTo = (authenticatedHomeRoute || {}).path || (homeRoute || {}).path || '/';

          replace(redirectTo);
        }
        callback();
      });
    }
  };
}
