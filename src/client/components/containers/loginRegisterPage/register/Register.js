import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from 'src/client/actions';
import { toast } from 'react-toastify';
import { toastOptions } from 'src/client/config';
import { userService } from 'src/client/services';
import './Register.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '',
        email: '',
        password: ''
      },
      submitted: false,
      emailExists: false,
      validPassword: false,
      validEmail: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.delayTimer);
  }

  handleChange(event) {
    const { user } = this.state;
    const { name, value } = event.target;
    user[name] = value;
    this.setState({
      user
    });

    //
    if (name === 'email') {
      // eslint-disable-next-line no-useless-escape
      const regexEmail = /^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;
      if (regexEmail.test(value.toLowerCase())) {
        this.setState({ validEmail: true });
      } else {
        this.setState({ validEmail: false });
        this.setState({ emailExists: true });
        return;
      }
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() => {
        userService.checkEmail(value).then((res) => {
          this.setState({ emailExists: res.emailExists });
        });
      }, 500);
    }

    if (name === 'password') {
      if (value.length >= 6) {
        this.setState({ validPassword: true });
      } else {
        this.setState({ validPassword: false });
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const mainProps = this.props;
    this.setState({
      submitted: true
    });
    const {
      user, emailExists, validEmail, validPassword
    } = this.state;
    if (user.name && user.email && user.password && !emailExists && validEmail && validPassword) {
      mainProps.dispatch(userActions.registerRequesting());
      userService.register(user).then(
        () => {
          toast('✅ Register Success!', toastOptions.INFO);
          mainProps.dispatch(userActions.registerSuccess());
          mainProps.changeTab();
        },
        (error) => {
          toast(`❌ ${error}`, toastOptions.ERROR);
          mainProps.dispatch(userActions.registerFailure(error));
        }
      );
    }
  }

  render() {
    const mainProps = this.props;
    const { status, message } = this.props;
    const {
      user, submitted, emailExists, validEmail, validPassword
    } = this.state;
    return (
      <div className="register-container">
        {status === 'failed' && <div className="alert alert-danger">{message}</div>}
        <div className="">
          <button type="button" onClick={mainProps.changeTab} className="btn btn-link">
            Already have account? Login!
          </button>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className={`form-group${submitted && !user.name ? ' has-error' : ''}`}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Your name..."
                onChange={this.handleChange}
                onBlur={this.handleChange}
                required
              />
              {submitted && !user.name && <div className="help-block">Name is required</div>}
            </div>

            <div className={`form-group${submitted && !this.email ? ' has-error' : ''}`}>
              <label htmlFor="email">Email</label>
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
                <div className={`check-icon ${emailExists}`}>
                  {emailExists ? <i className="fa fa-close" /> : <i className="fa fa-check" />}
                </div>
              </div>
              {submitted
                && !validEmail && (
                  <div className="requirements">Your email must follow correct format</div>
              )}
              {submitted
                && validEmail
                && emailExists && (
                  <div className="requirements">This email has been already taken</div>
              )}
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
                required
              />
              {submitted
                && !validPassword && (
                  <div className="requirements">Your password must be at least 6 characters</div>
              )}
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
              {status === 'registering' && (
                <img
                  alt="processing"
                  src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                />
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  status: state.registration.status,
  message: state.registration.message
});

Register.propTypes = {
  status: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(withRouter(Register));
