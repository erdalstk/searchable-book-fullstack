import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          <i className="fas fa-book fa-fw" />
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
                <i className="fas fa-search fa-fw" />
                Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/books" activeClassName="active">
                <i className="fas fa-list-ul fa-fw" />
                All Books
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav navbar-right">
            <li>
              <NavLink className="nav-link" exact to="/" activeClassName="active">
                <i className="fas fa-sign-in-alt fa-fw" />
                Login
              </NavLink>
            </li>
            <li>
              <NavLink className="nav-link" exact to="/" activeClassName="active">
                <i className="fas fa-user-plus fa-fw" />
                Sign up
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(Header);
