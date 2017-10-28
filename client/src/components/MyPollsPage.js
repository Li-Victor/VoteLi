import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MyPollsPage = ({ polls }) => {
  const listOfPolls = polls.map(poll => (
    <div key={poll.pollid}>
      <Link key={poll.pollid} to={`/poll/${poll.pollid}`}>
        {poll.topic}
      </Link>
      <br />
    </div>
  ));

  return (
    <div>
      <p>My Polls</p>
      <div>{listOfPolls}</div>
    </div>
  );
};

MyPollsPage.propTypes = {
  polls: PropTypes.arrayOf(
    PropTypes.shape({
      pollid: PropTypes.number,
      topic: PropTypes.string,
      userid: PropTypes.string
    })
  ).isRequired
};

function mapStateToProps(state) {
  return {
    polls: state.user.polls
  };
}

export default connect(mapStateToProps)(MyPollsPage);
