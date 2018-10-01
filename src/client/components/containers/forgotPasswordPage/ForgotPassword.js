import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastOptions } from 'src/client/config';
import { userService } from 'src/client/services';
import './ForgotPassword.css';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      submitted: false,
      status: 'NG',
      processing: false,
      errorMsg: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.delayTimer);
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ email: value });
    // eslint-disable-next-line no-useless-escape
    const regexEmail = /^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;
    if (regexEmail.test(value.toLowerCase())) {
      this.setState({ validEmail: true });
    } else {
      this.setState({ validEmail: false });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, validEmail } = this.state;
    this.setState({
      submitted: true
    });

    if (email && validEmail) {
      this.setState({
        processing: true
      });
      userService.forgotPassword(email).then(
        () => {
          toast('✅ Send Request Success!', toastOptions.INFO);
          this.setState({ errorMsg: '', status: 'OK', processing: false });
        },
        (error) => {
          // toast(`❌ ${error}`, toastOptions.ERROR);
          this.setState({ errorMsg: error, status: 'NG', processing: false });
        }
      );
    }
  }

  render() {
    const {
      submitted, validEmail, errorMsg, status, processing
    } = this.state;
    return (
      <div className="forgot-password-container col-12 col-md-8 col-lg-6">
        {submitted && errorMsg !== '' && <div className="alert alert-danger">{errorMsg}</div>}
        <div className="">
          <h3>Reset your password</h3>
          {status === 'OK' ? (
            <div className="alert alert-success">
              Send Request Success, please check email for reset password link!
            </div>
          ) : (
            <div>
              <strong>
                Enter your email address and we will send you a link to reset your password.
              </strong>
              <br />
              <br />
              <form name="form" onSubmit={this.handleSubmit}>
                <div className={`form-group${submitted && !this.email ? ' has-error' : ''}`}>
                  <div className="email-check-form">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="example@domain.com"
                      onChange={this.handleChange}
                      onBlur={this.handleChange}
                      required
                    />
                  </div>
                  {submitted
                    && !validEmail && (
                      <div className="requirements">Your email must follow correct format</div>
                  )}
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary">
                    Send password reset email
                  </button>
                  {processing && (
                    <img
                      alt="processing"
                      src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                    />
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(ForgotPassword);
