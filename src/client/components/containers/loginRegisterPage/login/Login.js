/* global FB */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from 'src/client/actions';
import { toast } from 'react-toastify';
import { toastOptions } from 'src/client/config';
import { userService } from 'src/client/services';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        password: ''
      },
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateFBLoggedInState = this.updateFBLoggedInState.bind(this);
    this.onFacebookLoginClick = this.onFacebookLoginClick.bind(this);
  }

  componentDidMount() {}

  onFacebookLoginClick() {
    const main = this;
    FB.login(
      (response) => {
        main.updateFBLoggedInState(response);
      },
      { scope: 'email' }
    );
  }

  updateFBLoggedInState(response) {
    const mainProps = this.props;
    if (!response.authResponse || !response.authResponse.accessToken) {
      return;
    }
    FB.api('/me', { locale: 'en_US', fields: 'name, email' }, (data) => {
      const fbUser = {
        name: data.name,
        email: data.email,
        id: data.id,
        token: response.authResponse.accessToken
      };
      userService.loginWithFacebook(fbUser).then(
        () => {
          userService.me().then(
            (res) => {
              mainProps.dispatch(userActions.profileSuccess(res.data));
              toast('✅ Login success!', toastOptions.INFO);
              mainProps.dispatch(userActions.loginSuccess());
              mainProps.history.push('/');
            },
            (error) => {
              toast(`❌  ${error}`, toastOptions.ERROR);
              mainProps.dispatch(userActions.profileFailure());
              mainProps.dispatch(userActions.loginFailure(error));
            }
          );
        },
        (error) => {
          toast(`❌  ${error}`, toastOptions.ERROR);
          mainProps.dispatch(userActions.loginFailure(error));
        }
      );
    });
  }

  handleChange(event) {
    const { user } = this.state;
    user[event.target.name] = event.target.value;
    this.setState({
      user
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const mainProps = this.props;
    this.setState({
      submitted: true
    });
    const { user } = this.state;
    if (user.email && user.password) {
      mainProps.dispatch(userActions.loginRequesting());
      userService.login(user).then(
        () => {
          userService.me().then(
            (res) => {
              mainProps.dispatch(userActions.profileSuccess(res.data));
              toast('✅ Login success!', toastOptions.INFO);
              mainProps.dispatch(userActions.loginSuccess());
              mainProps.history.push('/');
            },
            (error) => {
              toast(`❌ ${error}`, toastOptions.ERROR);
              mainProps.dispatch(userActions.profileFailure());
              mainProps.dispatch(userActions.loginFailure(error));
            }
          );
        },
        (error) => {
          toast(`❌ ${error}`, toastOptions.ERROR);
          mainProps.dispatch(userActions.loginFailure(error));
        }
      );
    }
  }

  render() {
    const mainProps = this.props;
    const { status, message } = this.props;
    const { user, submitted } = this.state;
    return (
      <div className="login-container">
        {status === 'failed' && <div className="alert alert-danger">{message}</div>}
        <div className="">
          <button type="button" onClick={mainProps.changeTab} className="btn btn-link">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Don't have account? Register!
          </button>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className={`form-group${submitted && !this.email ? ' has-error' : ''}`}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="example@domain.com"
                onChange={this.handleChange}
                onBlur={this.handleChange}
              />
              {submitted && !user.email && <div className="requirements">Email is required</div>}
            </div>

            <div className={`form-group${submitted && !user.password ? ' has-error' : ''}`}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder=""
                onChange={this.handleChange}
                onBlur={this.handleChange}
              />
              {submitted
                && !user.password && <div className="requirements">Password is required</div>}
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
              {status === 'processing' && (
                <img
                  alt="processing"
                  src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                />
              )}
              <Link className="btn btn-link" to="/forgot_password">
                Forgot password?
              </Link>
            </div>
          </form>
          <h3>Or</h3>
          {/* <div
              className="fb-login-button"
              data-max-rows="2"
              data-size="medium"
              data-button-type="login_with"
              data-show-faces="false"
              data-auto-logout-link="false"
              data-use-continue-as="true"
              data-scope="email"
            /> */}
          <button
            type="button"
            className="facebook-login-btn btn"
            onClick={this.onFacebookLoginClick}
          >
            <i className="fa fa-facebook fa-fw" />
            Login with Facebook
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  status: state.authentication.status,
  message: state.authentication.message
});

Login.defaultProps = {
  message: ''
};

Login.propTypes = {
  status: PropTypes.string.isRequired,
  message: PropTypes.string
};

export default connect(mapStateToProps)(withRouter(Login));
