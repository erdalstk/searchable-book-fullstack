import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import './LoginRegister.css';

class LoginRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'login'
    };
    this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
    this.onLoginTabClick = this.onLoginTabClick.bind(this);
    this.onRegisterTabClick = this.onRegisterTabClick.bind(this);
  }

  onLoginTabClick() {
    this.setState({ activeTab: 'login' });
  }

  onRegisterTabClick() {
    this.setState({ activeTab: 'register' });
  }

  handleActiveTabChange() {
    const mainState = this.state;
    if (mainState.activeTab === 'login') this.setState({ activeTab: 'register' });
    else this.setState({ activeTab: 'login' });
  }

  render() {
    const mainState = this.state;
    return (
      <div className="login-register-container col-12 col-md-8 col-lg-6">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item col-6">
            <a
              className={mainState.activeTab === 'login' ? 'nav-link show active' : 'nav-link'}
              id="login-tab"
              data-toggle="tab"
              href="#login"
              role="tab"
              onClick={this.onLoginTabClick}
              aria-controls="login"
              aria-selected="true"
            >
              Login
            </a>
          </li>
          <li className="nav-item col-6">
            <a
              className={mainState.activeTab === 'register' ? 'nav-link show active' : 'nav-link'}
              id="register-tab"
              data-toggle="tab"
              href="#register"
              role="tab"
              onClick={this.onRegisterTabClick}
              aria-controls="register"
              aria-selected="false"
            >
              Register
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className={
              mainState.activeTab === 'login' ? 'tab-pane fade show active' : 'tab-pane fade'
            }
            id="login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <Login changeTab={this.handleActiveTabChange} />
          </div>
          <div
            className={
              mainState.activeTab === 'register' ? 'tab-pane fade show active' : 'tab-pane fade'
            }
            id="register"
            role="tabpanel"
            aria-labelledby="register-tab"
          >
            <Register changeTab={this.handleActiveTabChange} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginRegister);
