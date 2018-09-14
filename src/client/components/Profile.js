import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userService } from '../services';
import { userActions } from '../actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';
import './Profile.css';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordChange: {
        oldPassword: '',
        newPassword: '',
        mewPasswordConfirm: ''
      },
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChangeSubmit = this.handlePasswordChangeSubmit.bind(this);
  }

  handleChange(event) {
    const { passwordChange } = this.state;
    passwordChange[event.target.name] = event.target.value;
    this.setState({
      passwordChange
    });
  }

  handlePasswordChangeSubmit(event) {
    event.preventDefault();
    const mainProps = this.props;
    this.setState({
      submitted: true
    });
    const { passwordChange } = this.state;
  }

  componentDidMount() {
    const mainProps = this.props;
    userService.profile().then(
      res => {
        mainProps.dispatch(userActions.profileSuccess(res.user));
      },
      error => {
        toast(error, errorToastOptions);
        mainProps.dispatch(userActions.profileFailure());
        mainProps.history.push('/login');
      }
    );
  }

  render() {
    const { user } = this.props;
    const { passwordChange, submitted } = this.state;
    return (
      <div className="row profile">
        <div className="col-lg-3">
          <div className="profile-sidebar">
            <div className="profile-userpic">
              <img src="/static/upload/panda.jpg" className="img-responsive" alt="" />
            </div>
            <div className="profile-usertitle">
              <div className="profile-usertitle-name">{user.name}</div>
              <div className="profile-usertitle-job">{user.email}</div>
            </div>
            <div className="profile-userbuttons">
              <button type="button" className="btn btn-success btn-sm">
                Follow
              </button>
              <button type="button" className="btn btn-danger btn-sm">
                Message
              </button>
            </div>
            <div className="profile-usermenu">
              <div
                id="sidebar"
                className="nav flex-column nav-pills"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical">
                <a
                  id="v-pills-overview-tab"
                  data-toggle="pill"
                  href="#v-pills-overview"
                  role="tab"
                  aria-controls="v-pills-overview"
                  aria-selected="true">
                  <i className="fa fa-home fa-fw" />
                  Overview
                </a>
                <a
                  id="v-pills-settings-tab"
                  data-toggle="pill"
                  href="#v-pills-settings"
                  role="tab"
                  aria-controls="v-pills-settings"
                  aria-selected="false">
                  <i className="fa fa-user fa-fw" />
                  Account Settings
                </a>
                <a
                  id="v-pills-tasks-tab"
                  data-toggle="pill"
                  href="#v-pills-tasks"
                  role="tab"
                  aria-controls="v-pills-tasks"
                  aria-selected="false">
                  <i className="fa fa-tasks fa-fw" />
                  Tasks
                </a>
                <a
                  id="v-pills-help-tab"
                  data-toggle="pill"
                  href="#v-pills-help"
                  role="tab"
                  aria-controls="v-pills-help"
                  aria-selected="false">
                  <i className="fa fa-question-circle fa-fw" />
                  Help
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="profile-content">
            <div className="tab-content" id="v-pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="v-pills-overview"
                role="tabpanel"
                aria-labelledby="v-pills-overview-tab">
                ... Overview
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-settings"
                role="tabpanel"
                aria-labelledby="v-pills-settings-tab">
                <h3>Login</h3>
                <form name="form" onSubmit={this.handlePasswordChangeSubmit}>
                  <div className={'form-group'}>
                    <label htmlFor="password">Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="oldpassword"
                      onChange={this.handleChange}
                      onBlur={this.handleChange}
                    />
                    {submitted && !passwordChange.oldPassword && <div className="help-block">Password is required</div>}
                  </div>

                  <div className={'form-group'}>
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      onChange={this.handleChange}
                      onBlur={this.handleChange}
                    />
                    {submitted && !passwordChange.newPassword && <div className="help-block">Password is required</div>}
                  </div>

                  <div className={'form-group'}>
                    <label htmlFor="password">New Password Confirm</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPasswordConfirm"
                      onChange={this.handleChange}
                      onBlur={this.handleChange}
                    />
                    {submitted &&
                      !passwordChange.newPasswordConfirm && <div className="help-block">Password is required</div>}
                  </div>
                </form>
              </div>
              <div className="tab-pane fade" id="v-pills-tasks" role="tabpanel" aria-labelledby="v-pills-tasks-tab">
                ... Tasks
              </div>
              <div className="tab-pane fade" id="v-pills-help" role="tabpanel" aria-labelledby="v-pills-help-tab">
                ... Help
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withRouter(Profile));
