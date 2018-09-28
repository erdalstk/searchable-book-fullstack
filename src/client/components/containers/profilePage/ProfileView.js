import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userService } from 'src/client/services';
import { userActions } from 'src/client/actions';
import { toast } from 'react-toastify';
import './ProfileView.css';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { imageConstants, toastOptions } from 'src/client/config';
import { noPictureUtil } from 'src/client/helpers';
import Activities from './Activities.Profile';
import Overview from './Overview.Profile';
import AccountSettings from './AccountSettings.Profile';

class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePictureFile: [],
      me: true,
      userLocalStorage: {}
    };
    this.fetchProfile = this.fetchProfile.bind(this);
    this.onCoverDrop = this.onCoverDrop.bind(this);
    this.onSaveProfilePictureClick = this.onSaveProfilePictureClick.bind(this);
    this.onClearProfilePictureClick = this.onClearProfilePictureClick.bind(this);
  }

  componentDidMount() {
    this.fetchProfile();
  }

  componentDidUpdate(prevProps) {
    const mainProps = this.props;
    if (mainProps.match.params.email !== prevProps.match.params.email) {
      this.fetchProfile();
    }
  }

  onCoverDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', toastOptions.ERROR);
      return;
    }
    this.setState({
      profilePictureFile: files.slice(0, 1)
    });
  }

  onSaveProfilePictureClick() {
    const mainState = this.state;
    const data = new FormData();
    if (mainState.profilePictureFile.length) {
      data.append('profile_picture', mainState.profilePictureFile[0]);
      userService.updateProfile(data).then(
        () => {
          toast('✅ Success!', toastOptions.INFO);
          this.setState({ profilePictureFile: [] });
          this.fetchProfile();
        },
        (error) => {
          toast(`❌ ${error}`, toastOptions.ERROR);
        }
      );
    }
  }

  onClearProfilePictureClick() {
    this.setState({
      profilePictureFile: []
    });
  }

  fetchProfile() {
    const mainProps = this.props;
    if (!mainProps.match.params.email || mainProps.match.params.email === '') {
      return;
    }
    if (!localStorage.getItem('user')) {
      toast('❌ Do not have permission');
      mainProps.dispatch(userActions.profileFailure());
    }
    const userLocalStorage = JSON.parse(localStorage.getItem('user'));
    this.setState({ userLocalStorage });
    userService.profile(mainProps.match.params.email).then(
      (res) => {
        mainProps.dispatch(userActions.profileSuccess(res.data));
        if (userLocalStorage.email === res.data.email) {
          this.setState({ me: true });
          localStorage.setItem('user', JSON.stringify(res.data));
        } else {
          this.setState({ me: false });
        }
      },
      (error) => {
        toast(`❌ ${error}`, toastOptions.ERROR);
        mainProps.dispatch(userActions.profileFailure());
      }
    );
  }

  render() {
    const { user } = this.props;
    const mainState = this.state;
    if (!mainState.userLocalStorage || !mainState.userLocalStorage.email) {
      return <h3>You have to login to view this page</h3>;
    }
    if (!user || !user.email) {
      return <h3>No user found</h3>;
    }
    let imagePreview = user.profile_picture ? (
      <div className="upload-image-preview">
        <img src={imageConstants.STATIC_IMAGE_URL + user.profile_picture} alt={user.name} />
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

    if (mainState.profilePictureFile.length) {
      imagePreview = (
        <div className="upload-image-preview">
          <img
            alt={mainState.profilePictureFile[0].name}
            src={mainState.profilePictureFile[0].preview}
          />
        </div>
      );
    }

    return (
      <div className="row profile-view-container">
        <div className="col-lg-3">
          <div className="profile-sidebar">
            <div className="profile-userpic">
              {/* <img src="/static/upload/panda.jpg" className="img-responsive" alt="" /> */}
              {mainState.me ? (
                <div>
                  <Dropzone
                    className="profile-picture-dropzone"
                    accept="image/jpeg, image/png"
                    onDrop={this.onCoverDrop}
                  >
                    {imagePreview}
                  </Dropzone>
                  {mainState.profilePictureFile.length ? (
                    <div>
                      <button
                        type="button"
                        onClick={this.onSaveProfilePictureClick}
                        className="update-profile-picture-btn btn btn-xs "
                      >
                        <i className="fa fa-save fa-fw" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={this.onClearProfilePictureClick}
                        className="clear-profile-picture-btn btn btn-xs "
                      >
                        <i className="fa fa-arrow-left fa-fw" />
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
                    <img
                      onError={noPictureUtil.noProfilePictureAddDefaultSrc}
                      src={imageConstants.STATIC_IMAGE_URL + user.profile_picture}
                      alt={user.name}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="profile-usertitle">
              <div className="profile-usertitle-name">{user.name}</div>
              <div className="profile-usertitle-job">{user.email}</div>
            </div>
            {!mainState.me && (
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
                id="sidebar v-pills-tab"
                className="nav flex-column nav-pills"
                role="tablist"
                aria-orientation="vertical"
              >
                <a
                  id="v-pills-overview-tab"
                  data-toggle="pill"
                  href="#v-pills-overview"
                  role="tab"
                  aria-controls="v-pills-overview"
                  aria-selected="true"
                >
                  <i className="fa fa-home fa-fw" />
                  Overview
                </a>
                {mainState.me && (
                  <a
                    id="v-pills-settings-tab"
                    data-toggle="pill"
                    href="#v-pills-settings"
                    role="tab"
                    aria-controls="v-pills-settings"
                    aria-selected="false"
                  >
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
                  aria-selected="false"
                >
                  <i className="fa fa-tasks fa-fw" />
                  Activities
                </a>
                <a
                  id="v-pills-help-tab"
                  data-toggle="pill"
                  href="#v-pills-help"
                  role="tab"
                  aria-controls="v-pills-help"
                  aria-selected="false"
                >
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
                aria-labelledby="v-pills-overview-tab"
              >
                <Overview />
              </div>
              {mainState.me && (
                <div
                  className="tab-pane fade"
                  id="v-pills-settings"
                  role="tabpanel"
                  aria-labelledby="v-pills-settings-tab"
                >
                  <AccountSettings />
                </div>
              )}
              <div
                className="tab-pane fade"
                id="v-pills-tasks"
                role="tabpanel"
                aria-labelledby="v-pills-tasks-tab"
              >
                <Activities />
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-help"
                role="tabpanel"
                aria-labelledby="v-pills-help-tab"
              >
                {mainState.me
                  && mainState.userLocalStorage.level <= 1 && (
                    <Link className="btn btn-link" to="/admin/users">
                      Users Manager
                    </Link>
                )}
                <br />
                {mainState.me
                  && mainState.userLocalStorage.level <= 2 && (
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

ProfileView.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    level: PropTypes.number,
    create_time: PropTypes.string
  }).isRequired
};

export default connect(mapStateToProps)(ProfileView);
