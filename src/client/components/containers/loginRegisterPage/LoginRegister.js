import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import './LoginRegister.css';

const LoginRegister = () => {
  return (
    <div className="login-register-container col-12 col-md-8 col-lg-6">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item col-6">
          <a
            className="nav-link active"
            id="login-tab"
            data-toggle="tab"
            href="#login"
            role="tab"
            aria-controls="login"
            aria-selected="true">
            Login
          </a>
        </li>
        <li className="nav-item col-6">
          <a
            className="nav-link"
            id="register-tab"
            data-toggle="tab"
            href="#register"
            role="tab"
            aria-controls="register"
            aria-selected="false">
            Register
          </a>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
          <Login />
        </div>
        <div className="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
          <Register />
        </div>
      </div>
    </div>
  );
};

export default withRouter(LoginRegister);
