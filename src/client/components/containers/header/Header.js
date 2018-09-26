import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import keyIndex from 'react-key-index';
import CategoryList from '../../presentational/CategoryList';
import { connect } from 'react-redux';
import SearchBar from 'src/client/components/containers/searchBar/SearchBar.js';
import './Header.css';
import { categoryService } from 'src/client/services';
import { fetchCategoriesCompleted } from 'src/client/actions';
import { STATIC_IMAGE_URL } from 'src/client/config';
import { noProfilePictureAddDefaultSrc } from 'src/client/helpers';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    categoryService.getAllCategories().then(
      res => {
        this.props.dispatch(fetchCategoriesCompleted(res.data));
      },
      error => {
        return;
      }
    );
  }

  render() {
    var auth, loggedIn;
    if (localStorage.getItem('user')) {
      loggedIn = true;
      var user = JSON.parse(localStorage.getItem('user'));
      var lastName = user.name
        .split(' ')
        .slice(-1)
        .join(' ');
      auth = (
        <div className="dropdown nav-button">
          <NavLink
            href="#"
            role="button"
            className="user-dropdown dropdown-toggle"
            id="userDropdownMenuLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            exact
            to="/profile/me"
            activeClassName="active">
            {user.profile_picture ? (
              <div className="profile-picture-static">
                <img onError={noProfilePictureAddDefaultSrc} src={STATIC_IMAGE_URL + user.profile_picture} />
              </div>
            ) : (
              <i className="fa fa-user fa-fw" />
            )}
          </NavLink>
          <div
            className="dropdown-menu dropdown-menu-right columns-1 user-dropdown-menu"
            aria-labelledby="userDropdownMenuLink">
            <Link className="dropdown-item dropdown-user-overview" to="/profile/me">
              <div className="dropdown-profile-picture">
                <img onError={noProfilePictureAddDefaultSrc} src={STATIC_IMAGE_URL + user.profile_picture} />
              </div>
              <div className="dropdown-user-info">
                <strong>{user.name}</strong>
                <br />
                {user.email}
              </div>
            </Link>
            <hr />
            <Link className="dropdown-item" to="/profile/me">
              <i className="fa fa-user fa-fw" />
              <div className="text">Your Profile</div>
            </Link>
            <Link className="dropdown-item" to="/logout">
              <i className="fa fa-sign-out fa-fw" />
              <div className="text">Logout</div>
            </Link>
          </div>
        </div>
      );
    } else {
      loggedIn = false;
      auth = (
        <NavLink className="nav-button" exact to="/loginregister" activeClassName="active">
          <i className="fa fa-sign-in fa-fw" />
        </NavLink>
      );
    }

    return (
      <div className="header-container">
        <div className="navbar bg-light">
          <div className="col-2 col-md-3 col-lg-3">
            <a className="brand" href="#">
              <img
                className="logo-mobile d-sm-block d-md-none d-lg-none d-xl-none"
                src="https://books.haoict.com/static/upload/MDST-logo.png"
                alt="MDST"
              />
              <img
                className="logo-pc d-none d-md-block d-lg-block"
                src="https://books.haoict.com/static/upload/1536132952932-mdst-logo.png"
                alt="MDST"
              />
            </a>
          </div>
          <div className="search-bar col-10 col-md-6 col-lg-6">
            <SearchBar />
          </div>
          <div className="col-12 col-md-3 col-lg-3">
            <div className="row right-navbar">
              <div className={loggedIn ? 'col-3 col-lg-3' : 'col-6 col-md-6 col-lg-6'}>
                <div className="d-sm-block d-md-none d-lg-none d-xl-none">
                  <NavLink href="#" role="button" className="nav-button" to="/categories" activeClassName="active">
                    <i className="fa fa-tag fa-fw" />
                  </NavLink>
                </div>
                <div className="d-none d-md-block d-lg-block">
                  <NavLink
                    href="#"
                    role="button"
                    className="category-dropdown dropdown-toggle"
                    id="categoryDropdownMenuLink"
                    className="nav-button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    to="/categories"
                    activeClassName="active">
                    <i className="fa fa-tag fa-fw" />
                  </NavLink>
                  <div
                    className="dropdown-menu dropdown-menu-right multi-column columns-3"
                    aria-labelledby="categoryDropdownMenuLink">
                    <div className="row">
                      <div className="col-4">
                        <CategoryList col="0" total="3" categories={this.props.categories} />
                      </div>
                      <div className="col-4">
                        <CategoryList col="1" total="3" categories={this.props.categories} />
                      </div>
                      <div className="col-4">
                        <CategoryList col="2" total="3" categories={this.props.categories} />
                      </div>
                    </div>
                    <hr />
                    <div className="all-categories-link">
                      <Link to="/categories">
                        <i className="fa fa-list fa-fw" />
                        All categories
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {loggedIn && (
                <div className="col-3 col-lg-3 nav-item">
                  <NavLink className="nav-button" exact to="/uploadbook" activeClassName="active">
                    <i className="fa fa-upload fa-fw" />
                  </NavLink>
                </div>
              )}
              {loggedIn && (
                <div className="col-3 col-lg-3">
                  <NavLink className="nav-button" exact to="/chat" activeClassName="active">
                    <i className="fa fa-comments fa-fw" />
                  </NavLink>
                </div>
              )}
              <div className={loggedIn ? 'col-3 col-lg-3' : 'col-6 col-md-6 col-lg-6'}>{auth}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  status: state.authentication.status,
  categories: keyIndex(state.categories, 1)
});

export default connect(
  mapStateToProps,
  null,
  null,
  {
    pure: false
  }
)(withRouter(Header));
