import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { deletePoll } from '../actions/user';

const MyPollsPage = ({ polls, dp }) => {
  const removePoll = (e) => {
    if (window.confirm('Are you sure you want to remove this poll?')) {
      const pollid = e.target.id;

      dp(pollid).then(() => {
        window.location.reload();
      });
    }
  };

  const listOfPolls = polls.map(poll => (
    <div key={poll.pollid}>
      <Link key={poll.pollid} to={`/poll/${poll.pollid}`}>
        {poll.topic}
      </Link>
      <button id={poll.pollid} onClick={removePoll}>
        Delete!
      </button>
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
  ).isRequired,
  dp: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    polls: state.user.polls
  };
}

export default connect(mapStateToProps, { dp: deletePoll })(MyPollsPage);
