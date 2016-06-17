import app from './app';

export context from './context';
export actions from './actions';

export Router from './components/Router';

export HomeRoute from './components/HomeRoute';
export LoginRoute from './components/LoginRoute';
export LogoutRoute from './components/LogoutRoute';
export AuthenticatedRoute from './components/AuthenticatedRoute';

export Authenticated from './components/Authenticated';
export NotAuthenticated from './components/NotAuthenticated';

export LoginLink from './components/LoginLink';
export LogoutLink from './components/LogoutLink';

export LoginForm from './components/LoginForm';
export UserProfileForm from './components/UserProfileForm';
export SignupForm from './components/SignupForm';
export ResetPasswordForm from './components/ResetPasswordForm';
export ChangePasswordForm from './components/ChangePasswordForm';
export VerifyEmailView from './components/VerifyEmailView';

export SocialLoginLink from './components/SocialLoginLink';
export SocialLoginButton from './components/SocialLoginButton';

// When not using ES6, enable people to use ReactAuth.init()
// instead of ReactAuth.default.init().
export function init() {
  app.init(...arguments);
};

export default app;
