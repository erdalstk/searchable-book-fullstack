import React from 'react';
import PropTypes from 'prop-types';
import { propTypesHelper } from 'src/client/helpers';
import BookGridView from './BookGridView';

const FixedGridLayoutView = ({ mostDownloadData }) => (
  <BookGridView title="Most Downloaded" books={mostDownloadData} />
);

FixedGridLayoutView.defaultProps = {
  mostDownloadData: []
};

FixedGridLayoutView.propTypes = {
  mostDownloadData: PropTypes.arrayOf(propTypesHelper.Book)
};

export default FixedGridLayoutView;
