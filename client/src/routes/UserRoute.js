import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import isEmptyObject from '../utils/isEmptyObject';

const UserRoute = ({ user, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (!isEmptyObject(user) ? <Component {...props} /> : <Redirect to="/" />)}
  />
);

UserRoute.propTypes = {
  component: PropTypes.func.isRequired,
  // eslint-disable-next-line
  user: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(UserRoute);
