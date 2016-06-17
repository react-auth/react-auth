import React from 'react';
import { Link } from 'react-router';

import utils from '../utils';
import LoginLink from '../components/LoginLink';
import LoadingText from '../components/LoadingText';
import { changePassword } from '../actions';

class DefaultChangePasswordForm extends React.Component {
  render() {
    return (
      <ChangePasswordForm {...this.props}>
        <div className='sp-change-password-form'>
          <div className="row" >
            <div className="col-sm-offset-4 col-xs-12 col-sm-4" spIf="form.sent">
              <p className="alert alert-success">Your new password has been set. Please <LoginLink />.</p>
            </div>
            <div className="col-xs-12" spIf="!form.sent">
              <div className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="spPassword" className="col-xs-12 col-sm-4 control-label">New Password</label>
                  <div className="col-xs-12 col-sm-4">
                    <input id="spPassword" type="password" name="password" className="form-control" placeholder="New Password" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="spConfirmPassword" className="col-xs-12 col-sm-4 control-label">Confirm New Password</label>
                  <div className="col-xs-12 col-sm-4">
                    <input id="spConfirmPassword" type="password" name="confirmPassword" className="form-control" placeholder="Confirm New Password" required />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-offset-4 col-sm-4">
                    <p className="alert alert-danger" spIf="form.error"><span spBind="form.errorMessage" /></p>
                    <button type="submit" className="btn btn-primary">
                      <span spIf="form.processing">Setting New Password...</span>
                      <span spIf="!form.processing">Set New Password</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChangePasswordForm>
    );
  }
}

export default class ChangePasswordForm extends React.Component {
  state = {
    token: null,
    fields: {
      password: ''
    },
    errorMessage: null,
    isFormSent: false,
    isFormProcessing: false
  };

  constructor(...args) {
    super(...args);

    if (!this.props || !('token' in this.props)) {
      throw new Error('ChangePasswordForm: Property \'token\' is required.');
    }

    this.state.token = this.props.token;
  }

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
      data = data || this.state.fields;

      if ('confirmPassword' in data && data.password !== data.confirmPassword) {
        return this.setState({
          isFormProcessing: false,
          errorMessage: 'Passwords does not match.'
        });
      }

      changePassword(data).then(() => {
        this.setState({
          isFormProcessing: false,
          isFormSent: true
        });
      }).catch((err) => {
        if (err.status === 404) {
          err.message = 'The reset password token is not valid. Please try resetting your password again.';
        }

        this.setState({
          isFormProcessing: false,
          errorMessage: err.message
        });
      });
    };

    this.setState({
      errorMessage: null,
      isFormSent: false,
      isFormProcessing: true
    });

    var data = this.state.fields;

    if (this.state.token) {
      data.token = this.props.token;
    }

    if (this.props.onSubmit) {
      e.data = data;
      this.props.onSubmit(e, next);
    } else {
      next(null, data);
    }
  }

  _mapFormFieldHandler(element, tryMapField) {
    if (element.type === 'input' || element.type === 'textarea') {
      if (element.props.type !== 'submit') {
        switch(element.props.name) {
          case 'password':
            tryMapField('password');
            break;
          case 'confirmPassword':
            tryMapField('confirmPassword');
            break;
        }
      }
    }
  }

  _spIfHandler(action, element) {
    var test = null;

    switch (action) {
      case 'form.sent':
        test = this.state.isFormSent;
        break;
      case 'form.processing':
        test = this.state.isFormProcessing;
        break;
      case 'form.error':
        test = this.state.errorMessage !== null;
        break;
    }

    return test;
  }

  _spBindHandler(bind, element) {
    var result = false;

    switch (bind) {
      case 'form.errorMessage':
        let className = element.props ? element.props.className : undefined;
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
      return <DefaultChangePasswordForm {...this.props} />;
    }
  }
}
