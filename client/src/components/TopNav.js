import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Container, Dropdown, Icon, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import isEmptyObject from '../utils/isEmptyObject';

const TopNav = ({ user }) => {
  const logout = () => {
    window.location.href = '/auth/logout';
  };

  return (
    <Menu fixed="top">
      <Container>
        <Menu.Item header href="/">
          VoteLi
        </Menu.Item>
        {isEmptyObject(user) ? (
          <Menu.Item>
            <Button color="twitter" onClick={() => window.location.replace('/login/twitter')}>
              <Icon name="twitter" /> Sign in with Twitter
            </Button>
          </Menu.Item>
        ) : (
          <Menu.Menu position="right">
            <Menu.Item name="mypolls" as={Link} to="/mypolls">
              My Polls
            </Menu.Item>
            <Menu.Item name="newpoll" as={Link} to="/newpoll">
              New Poll
            </Menu.Item>
            <Dropdown text={user.displayname} pointing item>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        )}
      </Container>
    </Menu>
  );
};

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
