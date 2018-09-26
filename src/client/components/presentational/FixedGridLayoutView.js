import React, { Component } from 'react';
import BookGridView from './BookGridView';

const FixedGridLayoutView = ({ mostDownloadData }) => {
  return <BookGridView title="Most Downloaded" books={mostDownloadData} />;
};

export default FixedGridLayoutView;
