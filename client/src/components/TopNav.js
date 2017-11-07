import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Container, Icon, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import isEmptyObject from '../utils/isEmptyObject';

const TopNav = ({ user }) => (
  <div>
    <Menu style={{ marginBottom: '2em' }}>
      <Container>
        <Menu.Item header href="/">
          VoteLi
        </Menu.Item>
        {isEmptyObject(user) ? (
          <Menu.Item>
            <Button color="twitter" onClick={() => window.location.replace('/login/twitter')}>
              <Icon name="twitter" /> Log in with Twitter
            </Button>
          </Menu.Item>
        ) : (
          <Menu.Menu position="right">
            <Menu.Item>
              <Link to="/mypolls">My Polls</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/newpoll">New Poll</Link>
            </Menu.Item>
            <Menu.Item>{user.displayname}</Menu.Item>
            <Menu.Item>
              <a href="/auth/logout">Logout</a>
            </Menu.Item>
          </Menu.Menu>
        )}
      </Container>
    </Menu>
  </div>
);

TopNav.propTypes = {
  user: PropTypes.shape({
    displayname: PropTypes.string
  }).isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(TopNav);
