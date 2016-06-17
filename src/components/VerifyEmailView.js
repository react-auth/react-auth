import React from 'react';

import LoginLink from '../components/LoginLink';
import { verifyEmail } from '../actions';

export default class VerifyEmailView extends React.Component {
  state = {
    status: 'VERIFYING'
  };

  componentDidMount() {
    var token = this.props.token;

    verifyEmail(token).then(() => {
      this.setState({
        status: 'VERIFIED'
      });
    }).catch(() => {
      this.setState({
        status: 'ERROR'
      });
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-offset-4 col-xs-12 col-sm-4">
          {{
            VERIFYING: (
              <p className="alert alert-warning">We are verifying your account.</p>
            ),
            VERIFIED: (
              <p className="alert alert-success">
                Your account has been verified! <LoginLink>Login Now.</LoginLink>
              </p>
            ),
            ERROR: (
              <div className="alert alert-danger">
                This email verification link is not valid.
              </div>
            )
          }[this.state.status]}
        </div>
      </div>
    );
  }
}
