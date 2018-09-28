const isStringEmptyOrSpaces = str => str === null || str.match(/^ *$/) !== null;

const stringUtils = {
  isStringEmptyOrSpaces
};

export default stringUtils;
