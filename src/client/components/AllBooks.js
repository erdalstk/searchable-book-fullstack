import React from 'react';
import ReactDOM from 'react-dom';
import BooksTable from './BooksTable';

class AllBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { books: [] };
  }

  componentDidMount() {
    fetch('/api/books')
      .then(res => res.json())
      .then(books => this.setState({ books: books.books }));
  }

  render() {
    return <BooksTable results={this.state.books} />;
  }
}

export default AllBooks;
