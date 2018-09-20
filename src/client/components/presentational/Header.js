import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import AllCategories from '../containers/categoryPage/AllCategories';
import { connect } from 'react-redux';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.onNavLinkClick = this.onNavLinkClick.bind(this);
  }

  onNavLinkClick() {
    const element = this.refs.element;
    element.classList.remove('show');
  }

  componentDidMount() {}

  render() {
    var auth, loggedIn;
    if (localStorage.getItem('user')) {
      loggedIn = true;
      var user = JSON.parse(localStorage.getItem('user'));
      auth = (
        <ul className="navbar-nav navbar-right">
          <li>
            <NavLink
              onClick={this.onNavLinkClick}
              className="nav-link nav-link-toggle"
              exact
              to="/profile/me"
              activeClassName="active">
              <i className="fa fa-user fa-fw" />
              {user.name}
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={this.onNavLinkClick}
              className="nav-link nav-link-toggle"
              exact
              to="/logout"
              activeClassName="active">
              <i className="fa fa-sign-out fa-fw" />
              Logout
            </NavLink>
          </li>
        </ul>
      );
    } else {
      loggedIn = false;
      auth = (
        <ul className="navbar-nav navbar-right">
          <li>
            <NavLink
              onClick={this.onNavLinkClick}
              className="nav-link nav-link-toggle"
              exact
              to="/login"
              activeClassName="active">
              <i className="fa fa-sign-in fa-fw" />
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={this.onNavLinkClick}
              className="nav-link nav-link-toggle"
              exact
              to="/register"
              activeClassName="active">
              <i className="fa fa-user-plus fa-fw" />
              Register
            </NavLink>
          </li>
        </ul>
      );
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <i className="fa fa-book fa-fw" />
          Books
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div ref="element" className="navbar-collapse collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink
                onClick={this.onNavLinkClick}
                className="nav-link nav-link-toggle"
                exact
                to="/"
                activeClassName="active">
                <i className="fa fa-home fa-fw" />
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                onClick={this.onNavLinkClick}
                className="nav-link nav-link-toggle"
                exact
                to="/books"
                activeClassName="active">
                <i className="fa fa-search fa-fw" />
                Search
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link category-dropdown dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <i className="fa fa-tag fa-fw" />
                Categories
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <AllCategories onClick={this.onNavLinkClick} />
              </div>
            </li>
            {loggedIn && (
              <li className="nav-item">
                <NavLink
                  onClick={this.onNavLinkClick}
                  className="nav-link nav-link-toggle"
                  exact
                  to="/uploadbook"
                  activeClassName="active">
                  <i className="fa fa-upload fa-fw" />
                  Upload book
                </NavLink>
              </li>
            )}
            {loggedIn && (
              <li className="nav-item">
                <NavLink
                  onClick={this.onNavLinkClick}
                  className="nav-link nav-link-toggle"
                  exact
                  to="/chat"
                  activeClassName="active">
                  <i className="fa fa-comments fa-fw" />
                  Chat
                </NavLink>
              </li>
            )}
          </ul>
          {auth}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  status: state.authentication.status,
  userProfile: state.user
});

export default connect(
  mapStateToProps,
  null,
  null,
  {
    pure: false
  }
)(withRouter(Header));
