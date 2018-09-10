export const isStringEmptyOrSpaces = str => {
  return str === null || str.match(/^ *$/) !== null;
};
