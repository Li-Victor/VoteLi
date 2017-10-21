import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import isEmptyObject from '../utils/isEmptyObject';

const TopNav = ({ user }) => (
  <div>
    <Link to="/">
      <p>VoteLi</p>
    </Link>
    {isEmptyObject(user) ? (
      <a href="/login/facebook">Log In with Facebook</a>
    ) : (
      <div>
        <Link to="/">Home</Link>
        <br />
        <Link to="/mypolls">My Polls</Link>
        <br />
        <Link to="/newpoll">New Poll</Link>
        <br />
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
