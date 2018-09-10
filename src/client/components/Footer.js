import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="page-footer font-small blue pt-4">
    <div className="container-fluid text-center text-md-left">
      <div className="row">
        <div className="col-md-6 mt-md-0 mt-3">
          <h5 className="text-uppercase">About us</h5>
          <p>Books!!!</p>
        </div>
        <hr className="clearfix w-100 d-md-none pb-3" />
        <div className="col-md-3 mb-md-0 mb-3">
          <h5 className="text-uppercase">Other products</h5>
          <ul className="list-unstyled">
            <li>
              <a href="https://portainer.haoict.com">Portainer</a>
            </li>
            <li>
              <a href="https://glances.haoict.com">Glances</a>
            </li>
          </ul>
        </div>
        <div className="col-md-3 mb-md-0 mb-3">
          <h5 className="text-uppercase">Follow us</h5>
          <ul className="list-unstyled">
            <li>
              <a href="https://facebook.com/hao.ict">Facebook</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer-copyright text-center py-3">
      © 2018 Copyright:
      <a href="https://books.haoict.com"> books.haoict.com</a>
    </div>
  </footer>
);

export default Footer;
