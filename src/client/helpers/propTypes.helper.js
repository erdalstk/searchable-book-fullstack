import PropTypes from 'prop-types';

const Book = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  category: PropTypes.string,
  description: PropTypes.string,
  cover: PropTypes.string
});

const propTypesHelper = {
  Book
};

export default propTypesHelper;
