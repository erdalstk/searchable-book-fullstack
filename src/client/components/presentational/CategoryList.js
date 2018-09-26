import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './CategoryList.css';

const CategoryList = ({ col, total, categories }) => {
  if (!categories || !categories.length) {
    return '';
  }
  const cats = [];
  var start = 0;
  var end = categories.length;
  if (col && total) {
    start = Math.ceil((categories.length * parseInt(col)) / parseInt(total));
    end = Math.ceil((categories.length * (parseInt(col) + 1)) / parseInt(total));
  }
  categories.slice(start, end).map(c => {
    if (c.value === '') return '';
    cats.push(
      <Link className="nav-link-toggle dropdown-item category" to={'/categories/' + c.value} key={c.id}>
        <i className="fa fa-tag fa-fw" />
        {c.value}
      </Link>
    );
  });
  return cats;
};

export default withRouter(CategoryList);
