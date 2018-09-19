import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bookService } from '../services';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedBooks: []
    };
  }

  componentDidMount() {
    bookService.getUploadedBy(this.props.user.email).then(
      res => {
        this.setState({ uploadedBooks: res.data });
      },
      error => {
        return;
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.email != prevProps.user.email)
      bookService.getUploadedBy(this.props.user.email).then(
        res => {
          this.setState({ uploadedBooks: res.data });
        },
        error => {
          return;
        }
      );
  }

  render() {
    var uploadedBooksList = [];
    this.state.uploadedBooks.forEach(book => {
      uploadedBooksList.push(
        <div key={book._id}>
          <Link to={'/books/' + book._id}>{book.name}</Link>
        </div>
      );
    });

    const { user } = this.props;
    return (
      <div>
        <h3>Uploaded books</h3>
        {uploadedBooksList}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Activities);
