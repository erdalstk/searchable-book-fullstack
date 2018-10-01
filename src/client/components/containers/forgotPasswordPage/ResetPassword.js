import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { userService } from 'src/client/services';
import { toast } from 'react-toastify';
import { toastOptions } from 'src/client/config';
import './ResetPassword.css';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        newPassword: '',
        newPasswordConfirm: ''
      },
      submitted: false,
      processing: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleuserSubmit = this.handleuserSubmit.bind(this);
  }

  handleChange(event) {
    const { user } = this.state;
    user[event.target.name] = event.target.value;
    this.setState({
      user
    });
  }

  handleuserSubmit(event) {
    event.preventDefault();
    const { user } = this.state;
    this.setState({
      submitted: true
    });

    if (user.newPassword === '') {
      return;
    }
    if (user.newPassword.length < 6) {
      toast('❌ Password length must be greater or equal 6 characters', toastOptions.ERROR);
      return;
    }
    if (user.newPassword !== user.newPasswordConfirm) {
      return;
    }

    this.setState({
      processing: true
    });
    const mainProps = this.props;
    const token = mainProps.match.params.token; // eslint-disable-line
    userService.resetPassword(user, token).then(
      () => {
        toast('✅ Reset password success!', toastOptions.INFO);
        this.setState({
          user: {
            newPassword: '',
            newPasswordConfirm: ''
          },
          submitted: false,
          processing: false
        });
        mainProps.history.push('/loginregister');
      },
      (error) => {
        toast(`❌ ${error}`, toastOptions.ERROR);
        this.setState({
          processing: false
        });
      }
    );
  }

  render() {
    const { user, submitted, processing } = this.state;
    return (
      <div className="reset-password-container">
        <h3>Reset password</h3>
        <form name="form" onSubmit={this.handleuserSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              onChange={this.handleChange}
              onBlur={this.handleChange}
              value={user.newPassword}
            />
            {submitted
              && !user.newPassword && <div className="requirements">Password is required</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password Confirm</label>
            <input
              type="password"
              className="form-control"
              name="newPasswordConfirm"
              onChange={this.handleChange}
              onBlur={this.handleChange}
              value={user.newPasswordConfirm}
            />
            {submitted
              && user.newPasswordConfirm !== user.newPassword && (
                <div className="requirements">Confirm new password must match</div>
            )}
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
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
    );
  }
}

export default withRouter(ResetPassword);
