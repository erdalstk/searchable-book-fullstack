import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BookGridView.css';
import { STATIC_IMAGE_URL } from '../config/Constants';
import { noPictureAddDefaultSrc } from '../utils/noPictureCheck';

const maxNameLen = 35;

const BookGridChildView = props => {
  var name = props.book.name;
  if (props.book.name.length >= maxNameLen) {
    name = props.book.name.slice(0, maxNameLen) + '...';
  }
  return (
    <div className="book-grid-view-content-child">
      <Link to={'/books/' + props.book._id}>
        <div className="cover">
          <img onError={noPictureAddDefaultSrc} src={STATIC_IMAGE_URL + props.book.cover} />
        </div>
      </Link>
      <div className="meta">
        <div className="title">
          <Link to={'/books/' + props.book._id}>{name}</Link>
        </div>
        <div className="author">{props.book.author}</div>
      </div>
    </div>
  );
};

const BookGridView = ({ title, books }) => {
  if (!books || !books.length) return '';
  const view = [];
  books.forEach(book => {
    view.push(<BookGridChildView key={book._id} book={book} />);
  });

  return (
    <div className="book-grid-view">
      <h3>{title}</h3>
      <div className="book-grid-view-content">{view}</div>
    </div>
  );
};

export default BookGridView;
