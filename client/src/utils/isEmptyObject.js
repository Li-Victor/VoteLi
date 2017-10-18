export default (userObject) => {
  if (Object.keys(userObject).length === 0 && userObject.constructor === Object) {
    return true;
  }
  return false;
};
