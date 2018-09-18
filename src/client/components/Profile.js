import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userService } from '../services';
import { userActions } from '../actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';
import AccountSettings from './AccountSettings.Profile';
import Overview from './Overview.Profile';
import './Profile.css';

class Profile extends Component {
  constructor(props) {
    super(props);
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
                <Overview />
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-settings"
                role="tabpanel"
                aria-labelledby="v-pills-settings-tab">
                <AccountSettings />
              </div>
              <div className="tab-pane fade" id="v-pills-tasks" role="tabpanel" aria-labelledby="v-pills-tasks-tab">
                ... Under construction
              </div>
              <div className="tab-pane fade" id="v-pills-help" role="tabpanel" aria-labelledby="v-pills-help-tab">
                ... Under construction
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
