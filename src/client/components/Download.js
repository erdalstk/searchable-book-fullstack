import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { bookService } from '../services';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';
import Countdown from 'react-countdown-now';
import './Download.css';

const Download = () => (
  <Switch>
    <Route exact path="/download/:id/:type" component={DownloadEbook} />
  </Switch>
);

class DownloadEbook extends Component {
  constructor(props) {
    super(props);
    this.renderer = this.renderer.bind(this);
    this.type = this.props.match.params.type;
    this.id = this.props.match.params.id;
    this.state = {
      link: ''
    };
  }

  // Renderer callback with condition
  renderer = ({ seconds, milliseconds, completed }) => {
    if (completed) {
      // Render a complete state
      window.location = this.state.link;
      return (
        <div>
          If your browser doesn't automatically download:
          <br />
          <a href={this.state.link} download>
            click here
          </a>
        </div>
      );
    } else {
      // Render a countdown
      return (
        <div>
          Your download will start shortly:
          <br />
          <div id="countdown">
            <div id="countdown-number">
              <span>
                {seconds}.{milliseconds / 10}
              </span>
            </div>
            <svg>
              <circle r="18" cx="20" cy="20" />
            </svg>
          </div>
        </div>
      );
    }
  };

  componentDidMount() {
    bookService.getDownloadLink(this.id, this.type).then(
      res => {
        this.setState({ link: res.link });
      },
      error => {
        toast(error, errorToastOptions);
        return;
      }
    );
  }

  render() {
    return (
      <div className="download-container">
        <Countdown
          date={Date.now() + 6000}
          intervalDelay={10}
          precision={2}
          zeroPadLength={1}
          renderer={this.renderer}
        />
      </div>
    );
  }
}

export default Download;
