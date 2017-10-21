import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEmptyObject from '../utils/isEmptyObject';

const TopNav = ({ user }) => (
  <div>
    <p>VoteLi</p>
    {isEmptyObject(user) ? (
      <a href="/login/facebook">Log In with Facebook</a>
    ) : (
      <div>
        <p>My Polls</p>
        <p>New Poll</p>
        <p>{user.displayname}</p>
        <a href="/auth/logout">Logout</a>
      </div>
    )}
  </div>
);

TopNav.propTypes = {
  // eslint-disable-next-line
  user: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(TopNav);
