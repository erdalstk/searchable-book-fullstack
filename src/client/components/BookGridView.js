import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BookGridView.css';
import { STATIC_IMAGE_URL } from '../config/Constants';

const maxNameLen = 35;

const BookGridChildView = props => {
  var name = props.book.name;
  if (props.book.name.length >= maxNameLen) {
    name = props.book.name.slice(0, maxNameLen) + '...';
  }
  return (
    <div className="book-grid-view-content-child">
      <div className="cover">
        <img src={STATIC_IMAGE_URL + props.book.cover} />
      </div>
      <div className="meta">
        <Link to={'/books/' + props.book.id}>{name}</Link>
      </div>
    </div>
  );
};

class BookGridView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const books = [];
    if (this.props.data.length) {
      this.props.data.forEach(book => {
        books.push(<BookGridChildView key={book.id} book={book} />);
      });
    }

    return (
      <div className="book-grid-view">
        <h3>{this.props.title}</h3>
        <div className="book-grid-view-content">{books}</div>
      </div>
    );
  }
}

export default BookGridView;
