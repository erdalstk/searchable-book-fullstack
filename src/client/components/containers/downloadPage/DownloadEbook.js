import React, { Component } from 'react';
import { bookService } from 'src/client/services';
import { toast } from 'react-toastify';
import { toastOptions } from 'src/client/config';
import Countdown from 'react-countdown-now';
import './DownloadEbook.css';

class DownloadEbook extends Component {
  constructor(props) {
    super(props);
    this.renderer = this.renderer.bind(this);
    const mainProps = props;
    this.type = mainProps.match.params.type;
    this.id = mainProps.match.params.id;
    this.state = {
      link: ''
    };
  }

  componentDidMount() {
    bookService.getDownloadLink(this.id, this.type).then(
      (res) => {
        this.setState({ link: res.data });
      },
      (error) => {
        toast(`❌  ${error}`, toastOptions.ERROR);
      }
    );
  }

  // Renderer callback with condition
  renderer = ({ seconds, milliseconds, completed }) => {
    const mainState = this.state;
    if (completed) {
      // Render a complete state
      window.location = mainState.link;
      return (
        <div className="download-ebook-countdown-container">
          If your browser does not automatically download:
          <br />
          <a href={mainState.link} download>
            click here
          </a>
        </div>
      );
    }
    // Render a countdown
    return (
      <div className="download-ebook-countdown--container">
        Your download will start shortly:
        <br />
        <div id="countdown">
          <div id="countdown-number">
            <span>
              {seconds}
.
              {milliseconds / 10}
            </span>
          </div>
          <svg>
            <circle r="18" cx="20" cy="20" />
          </svg>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="download-ebook-container">
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

export default DownloadEbook;
