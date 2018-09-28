import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './CategoryList.css';

const CategoryList = ({ col, total, categories }) => {
  if (!categories || !categories.length) {
    return '';
  }
  const cats = [];
  let start = 0;
  let end = categories.length;
  if (col && total) {
    start = Math.ceil((categories.length * parseInt(col, 10)) / parseInt(total, 10));
    end = Math.ceil((categories.length * (parseInt(col, 10) + 1)) / parseInt(total, 10));
  }
  categories.slice(start, end).map((c) => {
    if (c.value === '') return '';
    return cats.push(
      <Link
        className="nav-link-toggle dropdown-item category"
        to={`/categories/${c.value}`}
        key={c.id}
      >
        <i className="fa fa-tag fa-fw" />
        {c.value}
      </Link>
    );
  });
  return cats;
};

export default withRouter(CategoryList);
