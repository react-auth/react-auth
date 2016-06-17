import React from 'react';
import { Link } from 'react-router';

import utils from '../utils';
import context from './../context';

import LoginLink from '../components/LoginLink';
import { signup, loginWithCredentials } from '../actions';
import LoadingText from '../components/LoadingText';
import SocialLoginButton from '../components/SocialLoginButton';

class DefaultSignupForm extends React.Component {
  state = {
    fields: [
      {
        label: 'Email',
        name: 'email',
        placeholder: 'Email',
        required: true,
        type: 'email'
      },
      {
        label: 'Password',
        name: 'password',
        placeholder: 'Password',
        required: true,
        type: 'password'
      }
    ]
  };

  render() {
    let fieldMarkup = [];

    this.state.fields.forEach((field, index) => {
      var fieldId = `sp-${field.name}-${index}`;
      fieldMarkup.push(
        <div key={ fieldId } className="form-group">
          <label htmlFor={ fieldId } className="col-xs-12 col-sm-4 control-label">{ field.label }</label>
          <div className="col-xs-12 col-sm-4">
            <input type={ field.type } className="form-control" id={ fieldId } name={ field.name } placeholder={ field.placeholder } required={ field.required } />
          </div>
        </div>
      );
    });

    fieldMarkup.push(
      <div key="register-button" className="form-group">
        <div className="col-sm-offset-4 col-sm-4">
          <p className="alert alert-danger" spIf="form.error"><span spBind="form.errorMessage" /></p>
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </div>
    );

    return (
      <SignupForm {...this.props}>
        <div className='sp-login-form'>
          <div className="row" spIf="account.created">
            <div className="col-sm-offset-4 col-xs-12 col-sm-4">
              <p className="alert alert-success" spIf="account.enabled">
                Your account has been created. <LoginLink>Login Now</LoginLink>.
              </p>
              <div spIf="!account.enabled">
                <p className="alert alert-success">Your account has been created. Please check your email for a verification link.</p>
                <p className="pull-right">
                  <LoginLink>Back to Login</LoginLink>
                </p>
              </div>
            </div>
          </div>
          <div className="row" spIf="!account.created">
            <div className="col-xs-12">
              <div className="form-horizontal">
                { fieldMarkup ? fieldMarkup : <LoadingText /> }
              </div>
            </div>
          </div>
        </div>
      </SignupForm>
    );
  }
}

export default class SignupForm extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    fields: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    errorMessage: null,
    isFormProcessing: false,
    isAccountCreated: false,
    isAccountEnabled: false
  };

  onFormSubmit(e) {
    e.preventDefault();
    e.persist();

    var next = (err, data) => {
      if (err) {
        return this.setState({
          isFormProcessing: false,
          errorMessage: err.message
        });
      }

      // If the user didn't specify any data,
      // then simply default to what we have in state.
      data = data || this.state.fields;

      signup(data).then((result) => {
        if (result.status === 'ENABLED') {
          loginWithCredentials({
            username: data.email || data.username,
            password: data.password
          }).then(() => {
            this._performRedirect();
          }).catch((err) => {
            this.setState({
              isFormProcessing: false,
              isAccountCreated: false,
              errorMessage: err.message
            });
          });
        } else {
          this.setState({
            isFormProcessing: false,
            isAccountCreated: true,
            isAccountEnabled: false
          });
        }
      }).catch((err) => {
        this.setState({
          isFormProcessing: false,
          errorMessage: err.message
        });
      });
    };

    this.setState({
      isFormProcessing: true
    });

    if (this.props.onSubmit) {
      e.data = this.state.fields;
      this.props.onSubmit(e, next);
    } else {
      next(null, this.state.fields);
    }
  }

  _performRedirect() {
    var router = context.getRouter();
    var homeRoute = router.getHomeRoute();
    var authenticatedHomeRoute = router.getAuthenticatedHomeRoute();
    var redirectTo = this.props.redirectTo || (authenticatedHomeRoute || {}).path || (homeRoute || {}).path || '/';

    this.context.router.push(redirectTo);
  }

  _mapFormFieldHandler(element, tryMapField) {
    if (['input', 'textarea'].indexOf(element.type) > -1) {
      if (element.props.type !== 'submit') {
        switch(element.props.name) {
          case 'email':
            tryMapField('email');
            break;
          case 'login':
          case 'username':
            tryMapField('username');
            break;
          case 'first_name':
            tryMapField('first_name');
            break;
          case 'last_name':
            tryMapField('last_name');
            break;
          case 'password':
            tryMapField('password');
            break;
        }
      }
    }
  }

  _spIfHandler(action, element) {
    var test = null;

    switch (action) {
      case 'form.processing':
        test = this.state.isFormProcessing;
        break;
      case 'form.error':
        test = !!this.state.errorMessage;
        break;
      case 'account.created':
        test = this.state.isAccountCreated;
        break;
      case 'account.enabled':
        test = this.state.isAccountEnabled;
        break;
    }

    return test;
  }

  _spBindHandler(bind, element) {
    var result = false;

    switch (bind) {
      case 'form.errorMessage':
        var className = element.props ? element.props.className : undefined;
        result = <span className={className}>{this.state.errorMessage}</span>;
        break;
    }

    return result;
  }

  render() {
    if (this.props.children) {
      return (
        <form onSubmit={this.onFormSubmit.bind(this)}>
          {utils.makeForm(this, this._mapFormFieldHandler.bind(this), this._spIfHandler.bind(this), this._spBindHandler.bind(this))}
        </form>
      );
    } else {
      return <DefaultSignupForm {...this.props} />;
    }
  }
}
