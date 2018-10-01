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
    <div className="col-lg-2 col-sm-4 col-6">
      <Link to={`/books/${book._id}`}>
        <center>
          <img
            className="img-fluid d-block"
            src={imageConstants.STATIC_IMAGE_URL + book.cover}
            alt={book.name}
            onError={noPictureUtil.noPictureAddDefaultSrc}
          />
          <Link to={`/books/${book._id}`}>
            <h6 className="m-1 text-primary">{name}</h6>
          </Link>
          <h7 className="py-0">{book.author}</h7>
        </center>
      </Link>
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
    <div className="container">
      <div className="row">
        <h2>{title}</h2>
      </div>
      <div className="row">
        {view}
      </div>
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
