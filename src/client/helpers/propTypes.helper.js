import PropTypes from 'prop-types';

const Book = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  category: PropTypes.string,
  description: PropTypes.string,
  cover: PropTypes.string
});

const User = PropTypes.shape({
  email: PropTypes.string.isRequired,
  name: PropTypes.string,
  level: PropTypes.number.isRequired,
  enable: PropTypes.boolean,
  create_time: PropTypes.string
});

const propTypesHelper = {
  Book,
  User
};

export default propTypesHelper;
