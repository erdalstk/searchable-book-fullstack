import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';
import { userService } from '../services';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '',
        email: '',
        password: ''
      },
      submitted: false,
      emailExists: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      if (value === '') {
        this.setState({ emailExists: false });
        return;
      }
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(
        function() {
          fetch('/api/auth/checkemail?q=' + value)
            .then(res => res.json())
            .then(res => {
              this.setState({ emailExists: !res.result });
            });
        }.bind(this),
        500
      );
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const mainProps = this.props;
    this.setState({
      submitted: true
    });
    const { user } = this.state;
    if (user.name && user.email && user.password) {
      mainProps.dispatch(userActions.registerRequesting());
      userService.register(user).then(
        res => {
          toast('Success!', infoToastOptions);
          mainProps.dispatch(userActions.registerSuccess());
          mainProps.history.push('/login');
        },
        error => {
          toast(error, errorToastOptions);
          mainProps.dispatch(userActions.registerFailure(error));
        }
      );
    }
  }

  render() {
    const { status, message } = this.props;
    const { user, submitted, emailExists } = this.state;
    return (
      <div>
        {status === 'failed' && <div className={'alert alert-danger'}>{message}</div>}
        <div className="col-md-6 col-md-offset-3">
          <h2>Register</h2>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className={'form-group' + (submitted && !user.name ? ' has-error' : '')}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Your name..."
                onChange={this.handleChange}
              />
              {submitted && !user.name && <div className="help-block">Name is required</div>}
            </div>

            <div className={'form-group' + (submitted && !this.email ? ' has-error' : '')}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="example@domain.com"
                onChange={this.handleChange}
              />
              {submitted && !user.email && <div className="help-block">Email is required</div>}
              {emailExists && <div className="help-block">Email is already taken</div>}
            </div>

            <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder=""
                onChange={this.handleChange}
              />
              {submitted && !user.password && <div className="help-block">Password is required</div>}
            </div>

            <div className="form-group">
              <button className="btn btn-primary">Register</button>
              {status === 'registering' && (
                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
              )}
              <Link to="/login" className="btn btn-link">
                Cancel
              </Link>
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

export default connect(mapStateToProps)(withRouter(Register));
