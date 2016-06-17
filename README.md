![Project Logo](https://lh6.googleusercontent.com/-YmfKZZLZKL0/U-KVPFSbiOI/AAAAAAAAEZA/maoYT8iJCnA/w1089-h513-no/sshot-1.png)

# [ReactAuth](https://github.com/react-auth/react-auth/)

**Live Demo:** http://reactauth.com/demo/

---

**ReactAuth** is a simple to use authentication module for [React](https://facebook.github.io/react/)
with built-in support for login (username/password and social), registration, forgotten password, and more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Authentication Flow](#authentication-flow)
 - [Login with Email and Password](#-login-with-email-and-password)
 - [Login with OAuth 1.0](#-login-with-oauth-10)
 - [Login with OAuth 2.0](#-login-with-oauth-20)
 - [Logout](#-log-out)
- [API Reference](#api-reference)
- [License](#license)

## Installation

The easiest way to get **ReactAuth** is by running one of the following commands:

```bash
# Bower
bower install react-auth

# NPM
npm install react-auth
```

Alternatively, you may [**download**](https://github.com/react-auth/react-auth/releases) the latest release or use the CDN:

```html
<!--[if lte IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.min.js"></script>
<![endif]-->
<script src="//cdn.jsdelivr.net/react-auth/1.0.0/react-auth.min.js"></script>
```

If installed via [Bower](http://bower.io/), include one of the following script tags:
```html
<script src="bower_components/react-auth/react-auth.js"></script>
<!-- or -->
<script src="bower_components/react-auth/react-auth.min.js"></script>
```

**Note:** ReactAuth depends on [`window.atob()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/atob) for decoding JSON Web Tokens. If you need to support *IE9* then use Base64 polyfill above.

## Usage

**Step 1. Initialize the module**

```js
ReactAuth.init({
	// Configuration...
});
```

**Step 2. Import and add components to your page**

```js
import { LoginForm } from 'react-auth';

class LoginPage extends React.Component {
    render() {
        return (
            <div id="login-page">
                <LoginForm />
            </div>
        );
    }
}
```

## Configuration

Below is a complete list of all configuration options.

```js
// Configure ReactAuth with your own AuthProvider
ReactAuth.init({
	authProvider: customAuthProvider
});

// Configure ReactAuth with a specific/supported AuthProvider.
// Supported providers currently are 'stormpath' or 'default'.
ReactAuth.init({
	authProvider: {
		use: 'stormpath'
	}
});
```

## Authentication Flow

## API Reference

- [`isAuthenticated()`](#isauthenticated)
- [`loginWithCredentials(credentials)`](#loginwithcredentials-credentials)
- [`loginWithSocialProvider(options)`](#loginwithsocialprovider-options)
- [`signup(user)`](#signup-user)
- [`forgotPassword(options)`](#forgotpassword-options)
- [`verifyEmail(token)`](#verifyemail-token)
- [`changePassword(options)`](#changepassword-options)
- [`updateProfile(data)`](#updateprofile-data)
- [`getSession()`](#getsession)
- [`setSession()`](#setsession)
- [`logout()`](#logout)

#### `isAuthenticated()`

Checks authentication status of a user.

##### Usage

```js
import { isAuthenticated } from 'react-auth/actions';

isAuthenticated().then((authenticated) => {
  console.log(authenticated ? 'Authenticated!' : 'Not authenticated!');
});
```

<hr>

#### `loginWithCredentials(credentials)`

Sign in using Email and Password.

##### Parameters

| Param                    | Type     | Details
| ------------------------ | -------- | ---------------------------------------------------------------------------------------
| **credentials**          | `Object` | JavaScript object containing credentials to login with.

##### Returns

- **response** - The HTTP response object from the server.

##### Usage

```js
import { login } from 'react-auth/actions';

let user = {
  email: 'my@email.com',
  password: 'my password'
};

login(user)
  .then(function(response) {
    // Redirect user here after a successful log in.
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
    // for invalid email and/or password.
  });
```

<hr>

#### `loginWithSocialProvider(options)`

Sign in using a social provider (such as Facebook, Google or LinkedIn).

##### Parameters

| Param                    | Type     | Details
| ------------------------ | -------- | ---------------------------------------------------------------------------------------
| **options**          | `Object` | JavaScript object containing details about the social provider to login with.

##### Returns

Redirects automatically to the social provider for authentication.

##### Usage

```js
import { login } from 'react-auth/actions';

let user = {
  email: 'my@email.com',
  password: 'my password'
};

login(user)
  .then(function(response) {
    // Redirect user here after a successful log in.
  })
  .catch(function(response) {
    // Handle errors here, such as displaying a notification
    // for invalid email and/or password.
  });
```

<hr>

#### `signup(user)`

Create a new account with Email and Password.

##### Parameters

| Param                    | Type     | Details
| ------------------------ | -------- | ---------------------------------------------------------------------------------------
| **user**                 | `Object` | JavaScript object containing user information.

##### Returns

- **response** - The HTTP response object from the server.

##### Usage

```js
import { signup } from 'react-auth/actions';

var user = {
  firstName: 'Test',
  lastName: 'Testersson',
  email: 'my@email.com',
  password: 'my password'
};

signup(user)
  .then(function(response) {
    // Redirect user here to login page or perhaps some other intermediate page
    // that requires email address verification before any other part of the site
    // can be accessed.
  })
  .catch(function(response) {
    // Handle errors here.
  });
```

<hr>

#### `logout()`

End the current session.

##### Usage

```js
import { logout } from 'react-auth/actions';

logout();
```

## License

APACHE-2. See [LICENSE](LICENSE).