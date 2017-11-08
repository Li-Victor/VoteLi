import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Container, Dropdown, Icon, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import isEmptyObject from '../utils/isEmptyObject';

const TopNav = ({ user, history }) => {
  const handleItemClick = (e, { name }) => history.push(`/${name}`);
  const logout = () => {
    window.location.href = '/auth/logout';
  };

  return (
    <div>
      <Menu fixed="top">
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
              <Menu.Item name="mypolls" link onClick={handleItemClick}>
                My Polls
              </Menu.Item>
              <Menu.Item name="newpoll" link onClick={handleItemClick}>
                New Poll
              </Menu.Item>
              <Dropdown text={user.displayname} pointing className="link item">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          )}
        </Container>
      </Menu>
    </div>
  );
};

TopNav.propTypes = {
  user: PropTypes.shape({
    displayname: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

// <Menu.Item>{user.displayname}</Menu.Item>
// <Menu.Item href="/auth/logout">Logout</Menu.Item>
export default withRouter(connect(mapStateToProps)(TopNav));
