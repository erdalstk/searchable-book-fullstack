import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import AllCategories from './AllCategories';
import { connect } from 'react-redux';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { status, userProfile } = this.props;
    var auth, loggedIn;
    if (localStorage.getItem('user')) {
      loggedIn = true;
      var user = JSON.parse(localStorage.getItem('user'));
      auth = (
        <ul className="navbar-nav navbar-right">
          <li>
            <NavLink className="nav-link" exact to="/profile" activeClassName="active">
              <i className="fa fa-user fa-fw" />
              {user.name}
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" exact to="/logout" activeClassName="active">
              <i className="fa fa-sign-out-alt fa-fw" />
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
            <NavLink className="nav-link" exact to="/login" activeClassName="active">
              <i className="fa fa-sign-in-alt fa-fw" />
              Login
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" exact to="/register" activeClassName="active">
              <i className="fa fa-user-plus fa-fw" />
              Register
            </NavLink>
          </li>
        </ul>
      );
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/" activeClassName="active">
                <i className="fa fa-search fa-fw" />
                Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/books" activeClassName="active">
                <i className="fa fa-list-ul fa-fw" />
                All Books
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <i className="fa fa-tag fa-fw" />
                Categories
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <AllCategories />
              </div>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/uploadbook" activeClassName="active">
                <i className="fa fa-upload fa-fw" />
                Upload book
              </NavLink>
            </li>
            {loggedIn && (
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/chat" activeClassName="active">
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
