import React from 'react';

import utils from '../utils';
import context from './../context';

export default class SocialLoginLink extends React.Component {
  state = {
    disabled: false
  };

  _onClick(e) {
    e.preventDefault();

    if (!this.state.disabled) {
      this.setState({ disabled: true });

      context.authProvider.loginWithSocialProvider({
        providerId: this.props.providerId
      }, () => {
        this.setState({ disabled: false });
      });
    }
  }

  render() {
    var providerId = this.props.providerId;

    return (
      <a {...this.props} href='#' onClick={this._onClick.bind(this)} disabled={this.state.disabled}>
        { this.props.children ? this.props.children : 'Login with ' + utils.translateProviderIdToName(providerId)}
      </a>
    );
  }
}
