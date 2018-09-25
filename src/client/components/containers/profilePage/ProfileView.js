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
import Dropzone from 'react-dropzone';
import { STATIC_IMAGE_URL } from 'src/client/config';

class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePictureFile: []
    };
    this.fetchProfile = this.fetchProfile.bind(this);
    this.onCoverDrop = this.onCoverDrop.bind(this);
    this.onSaveProfilePictureClick = this.onSaveProfilePictureClick.bind(this);
    this.onClearProfilePictureClick = this.onClearProfilePictureClick.bind(this);
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

  onCoverDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      profilePictureFile: files.slice(0, 1)
    });
  }

  onSaveProfilePictureClick() {
    var data = new FormData();
    data.append('name', 'WTF');
    if (this.state.profilePictureFile.length) {
      data.append('profile_picture', this.state.profilePictureFile[0]);
      userService.updateProfile(data).then(
        res => {
          toast('✅ Success!', infoToastOptions);
          this.setState({ profilePictureFile: [] });
          this.fetchProfile();
          return;
        },
        error => {
          toast('❌ ' + error, errorToastOptions);
          return;
        }
      );
    }
  }

  onClearProfilePictureClick() {
    this.setState({
      profilePictureFile: []
    });
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

    var imagePreview = user.profile_picture ? (
      <div className="upload-image-preview">
        <img src={STATIC_IMAGE_URL + user.profile_picture} alt={user.name} />
        <div className="overlay">
          <div className="text">Click or drop here to change</div>
        </div>
      </div>
    ) : (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop cover image here
      </p>
    );

    if (this.state.profilePictureFile.length) {
      imagePreview = (
        <div className="upload-image-preview">
          <img alt={this.state.profilePictureFile[0].name} src={this.state.profilePictureFile[0].preview} />
        </div>
      );
    }

    return (
      <div className="row profile">
        <div className="col-lg-3">
          <div className="profile-sidebar">
            <div className="profile-userpic">
              {/* <img src="/static/upload/panda.jpg" className="img-responsive" alt="" /> */}
              {me ? (
                <div>
                  <Dropzone
                    className="profile-picture-dropzone"
                    accept="image/jpeg, image/png"
                    onDrop={this.onCoverDrop.bind(this)}>
                    {imagePreview}
                  </Dropzone>
                  {this.state.profilePictureFile.length ? (
                    <div>
                      <button
                        onClick={this.onSaveProfilePictureClick}
                        className="update-profile-picture-btn btn btn-xs">
                        Save
                      </button>
                      <button
                        onClick={this.onClearProfilePictureClick}
                        className="clear-profile-picture-btn btn btn-xs">
                        Clear
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                <div className="profile-picture-static">
                  <div className="upload-image-preview">
                    <img src={STATIC_IMAGE_URL + user.profile_picture} alt={user.name} />
                  </div>
                </div>
              )}
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
