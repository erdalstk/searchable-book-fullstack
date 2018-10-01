import React from 'react';
import PropTypes from 'prop-types';
import { propTypesHelper } from 'src/client/helpers';
import BookGridView from './BookGridView';

const FixedGridLayoutView = ({ title, data }) => <BookGridView title={title} books={data} />;

FixedGridLayoutView.defaultProps = {
  title: '',
  data: []
};

FixedGridLayoutView.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(propTypesHelper.Book)
};

export default FixedGridLayoutView;
