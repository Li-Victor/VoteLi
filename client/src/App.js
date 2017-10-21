import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import UserRoute from './routes/UserRoute';
import TopNav from './components/TopNav';
import HomePage from './components/HomePage';
import MyPollsPage from './components/MyPollsPage';
import NewPollPage from './components/NewPollPage';

const App = ({ location }) => (
  <div>
    <TopNav />
    <Route location={location} path="/" exact component={HomePage} />
    <UserRoute location={location} path="/mypolls" exact component={MyPollsPage} />
    <UserRoute location={location} path="/newpoll" exact component={NewPollPage} />
  </div>
);

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default App;
