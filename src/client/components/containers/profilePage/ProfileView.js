import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userService } from 'src/client/services';
import { userActions } from 'src/client/actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from 'src/client/config';
import AccountSettings from './AccountSettings.Profile';
import Overview from './Overview.Profile';
import './ProfileView.css';
import Activities from './Activities.Profile';
import { Link } from 'react-router-dom';

class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.fetchProfile = this.fetchProfile.bind(this);
  }

  fetchProfile() {
    if (!this.props.match.params.email || this.props.match.params.email === '') {
      return;
    }
    userService.profile(this.props.match.params.email).then(
      res => {
        this.props.dispatch(userActions.profileSuccess(res.data));
      },
      error => {
        toast('❌ ' + error, errorToastOptions);
        this.props.dispatch(userActions.profileFailure());
      }
    );
  }

  componentDidMount() {
    this.fetchProfile();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.email !== prevProps.match.params.email) {
      this.fetchProfile();
    }
  }

  render() {
    const { user } = this.props;
    var me = false;
    if (localStorage.getItem('user')) {
      if (!user || !user.email) return <h3>No user found</h3>;
      var userLocalStorage = JSON.parse(localStorage.getItem('user'));
      if (userLocalStorage.email === user.email) {
        me = true;
      }
    } else {
      return <h3>You have to login to view user profile</h3>;
    }
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
            {!me && (
              <div className="profile-userbuttons">
                <button type="button" className="btn btn-success btn-sm">
                  Follow
                </button>
                <button type="button" className="btn btn-danger btn-sm">
                  Message
                </button>
              </div>
            )}
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
                {me && (
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
                )}
                <a
                  id="v-pills-tasks-tab"
                  data-toggle="pill"
                  href="#v-pills-tasks"
                  role="tab"
                  aria-controls="v-pills-tasks"
                  aria-selected="false">
                  <i className="fa fa-tasks fa-fw" />
                  Activities
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
              {me && (
                <div
                  className="tab-pane fade"
                  id="v-pills-settings"
                  role="tabpanel"
                  aria-labelledby="v-pills-settings-tab">
                  <AccountSettings />
                </div>
              )}
              <div className="tab-pane fade" id="v-pills-tasks" role="tabpanel" aria-labelledby="v-pills-tasks-tab">
                <Activities />
              </div>
              <div className="tab-pane fade" id="v-pills-help" role="tabpanel" aria-labelledby="v-pills-help-tab">
                {user.level <= 1 && (
                  <Link className="btn btn-link" to="/admin/users">
                    Users Manager
                  </Link>
                )}
                <br />
                {user.level <= 2 && (
                  <Link className="btn btn-link" to="/admin/books">
                    Books Manager
                  </Link>
                )}
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

export default connect(mapStateToProps)(ProfileView);
