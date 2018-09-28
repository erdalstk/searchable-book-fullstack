import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { noPictureUtil, propTypesHelper } from 'src/client/helpers';
import './BookGridView.css';
import { imageConstants } from 'src/client/config';

const maxNameLen = 35;

const BookGridChildView = ({ book }) => {
  let { name } = book;
  if (book.name.length >= maxNameLen) {
    name = `${book.name.slice(0, maxNameLen)}...`;
  }
  return (
    <div className="book-grid-view-content-child">
      <Link to={`/books/${book._id}`}>
        <div className="cover">
          <img
            alt={book.name}
            onError={noPictureUtil.noPictureAddDefaultSrc}
            src={imageConstants.STATIC_IMAGE_URL + book.cover}
          />
        </div>
      </Link>
      <div className="meta">
        <div className="title">
          <Link to={`/books/${book._id}`}>{name}</Link>
        </div>
        <div className="author">{book.author}</div>
      </div>
    </div>
  );
};

const BookGridView = ({ title, books }) => {
  if (!books || !books.length) return '';
  const view = [];
  books.forEach((book) => {
    view.push(<BookGridChildView key={book._id} book={book} />);
  });

  return (
    <div className="book-grid-view">
      <h3>{title}</h3>
      <div className="book-grid-view-content">{view}</div>
    </div>
  );
};

BookGridChildView.propTypes = {
  book: propTypesHelper.Book.isRequired
};

BookGridView.defaultProps = {
  books: []
};

BookGridView.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.arrayOf(propTypesHelper.Book)
};

export default BookGridView;
