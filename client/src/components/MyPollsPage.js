import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';

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

  const pickColor = (index) => {
    const colors = ['red', 'orange', 'yellow', 'olive', 'teal', 'blue', 'violet', 'purple', 'pink'];
    return colors[index % colors.length];
  };

  const listOfPolls = polls.map((poll, index) => (
    <Segment color={pickColor(index)} key={poll.pollid}>
      <Link
        key={poll.pollid}
        to={`/poll/${poll.pollid}`}
        style={{ fontSize: '16px', marginRight: '12px' }}
      >
        {poll.topic}
      </Link>
      <Button id={poll.pollid} size="mini" negative icon onClick={removePoll}>
        <Icon name="delete" />
      </Button>
    </Segment>
  ));

  return (
    <Container text style={{ marginTop: '5em' }}>
      <Header as="h1">My Polls</Header>
      <div>{listOfPolls}</div>
    </Container>
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
