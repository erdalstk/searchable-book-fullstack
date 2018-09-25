import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from 'src/client/actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from 'src/client/config';
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

  updateFBLoggedInState(response) {
    const mainProps = this.props;
    if (!response.authResponse || !response.authResponse.accessToken) {
      return;
    }
    FB.api('/me', { locale: 'en_US', fields: 'name, email' }, function(data) {
      var fbUser = {
        name: data.name,
        email: data.email,
        id: data.id,
        token: response.authResponse.accessToken
      };
      userService.loginWithFacebook(fbUser).then(
        res => {
          userService.me().then(
            res => {
              mainProps.dispatch(userActions.profileSuccess(res.data));
              toast('Login success!', infoToastOptions);
              mainProps.dispatch(userActions.loginSuccess());
              mainProps.history.push('/');
            },
            error => {
              toast(error, errorToastOptions);
              mainProps.dispatch(userActions.profileFailure());
              mainProps.dispatch(userActions.loginFailure(error));
              return;
            }
          );
        },
        error => {
          toast(error, errorToastOptions);
          mainProps.dispatch(userActions.loginFailure(error));
          return;
        }
      );
    });
  }

  onFacebookLoginClick() {
    var main = this;
    FB.login(
      response => {
        main.updateFBLoggedInState(response);
      },
      { scope: 'email' }
    );
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
        res => {
          userService.me().then(
            res => {
              mainProps.dispatch(userActions.profileSuccess(res.data));
              toast('✅ Login success!', infoToastOptions);
              mainProps.dispatch(userActions.loginSuccess());
              mainProps.history.push('/');
            },
            error => {
              toast('❌ ' + error, errorToastOptions);
              mainProps.dispatch(userActions.profileFailure());
              mainProps.dispatch(userActions.loginFailure(error));
              return;
            }
          );
        },
        error => {
          toast(error, errorToastOptions);
          mainProps.dispatch(userActions.loginFailure(error));
          return;
        }
      );
    }
  }

  render() {
    const { status, message } = this.props;
    const { user, submitted } = this.state;
    return (
      <div>
        {status === 'failed' && <div className={'alert alert-danger'}>{message}</div>}
        <div className="">
          <button onClick={this.props.changeTab} className="btn btn-link">
            Don't have account? Register!
          </button>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className={'form-group' + (submitted && !this.email ? ' has-error' : '')}>
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

            <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder=""
                onChange={this.handleChange}
                onBlur={this.handleChange}
              />
              {submitted && !user.password && <div className="requirements">Password is required</div>}
            </div>

            <div className="form-group">
              <button className="btn btn-primary">Login</button>
              {status === 'processing' && (
                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
              )}
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
          <button className="facebook-login-btn btn" onClick={this.onFacebookLoginClick}>
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

export default connect(mapStateToProps)(withRouter(Login));
