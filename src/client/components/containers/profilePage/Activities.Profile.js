import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bookService } from 'src/client/services';
import { Link } from 'react-router-dom';
import BooksTable from 'src/client/components/presentational/BooksTable';

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedBooks: []
    };
  }

  componentDidMount() {
    const mainProps = this.props;
    bookService.getUploadedBy(mainProps.user.email).then((res) => {
      this.setState({ uploadedBooks: res.data });
    });
  }

  componentDidUpdate(prevProps) {
    const mainProps = this.props;
    if (mainProps.user.email !== prevProps.user.email) {
      bookService.getUploadedBy(mainProps.user.email).then((res) => {
        this.setState({ uploadedBooks: res.data });
      });
    }
  }

  render() {
    const mainState = this.state;
    const uploadedBooksList = [];
    mainState.uploadedBooks.forEach((book) => {
      uploadedBooksList.push(
        <div key={book._id}>
          <Link to={`/books/${book._id}`}>{book.name}</Link>
        </div>
      );
    });

    return (
      <div>
        <h3>Uploaded books</h3>
        <BooksTable books={mainState.uploadedBooks} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Activities);
