import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Confirm,
  Container,
  Dimmer,
  Header,
  Icon,
  Loader,
  Segment
} from 'semantic-ui-react';

import { deletePoll } from '../actions/user';

class MyPollsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openConfirm: false,
      pollid: undefined,
      dimmerActive: false
    };
  }

  onCancel = () => {
    this.setState({ openConfirm: false });
  };

  onConfirm = () => {
    const { pollid } = this.state;
    this.setState({ openConfirm: false, dimmerActive: true });
    if (!(pollid === undefined)) {
      this.props.dp(pollid).then(() => {
        window.location.reload();
      });
    }
  };

  removePoll = (e) => {
    this.setState({
      pollid: e.target.id,
      openConfirm: true
    });
  };

  pickColor = (index) => {
    const colors = ['red', 'orange', 'yellow', 'olive', 'teal', 'blue', 'violet', 'purple', 'pink'];
    return colors[index % colors.length];
  };

  render() {
    const listOfPolls = this.props.polls.map((poll, index) => (
      <Segment color={this.pickColor(index)} textAlign="center" key={poll.pollid}>
        <Link
          key={poll.pollid}
          to={`/poll/${poll.pollid}`}
          style={{ fontSize: '16px', marginRight: '12px' }}
        >
          {poll.topic}
        </Link>
        <Button id={poll.pollid} size="mini" negative icon onClick={this.removePoll}>
          <Icon name="delete" />
        </Button>
      </Segment>
    ));

    const { openConfirm, dimmerActive } = this.state;

    return (
      <Container text style={{ marginTop: '5em' }}>
        <Dimmer active={dimmerActive} page>
          <Loader size="massive">Deleting</Loader>
        </Dimmer>

        <Header as="h1">VoteLi</Header>
        <Header as="h3" style={{ marginTop: 0 }}>
          <Header.Content>Below are polls you own.</Header.Content>
          <Header.Subheader>
            Select a poll to see the results and vote,{' '}
            <Link to="/newpoll">or make a new poll!</Link>
          </Header.Subheader>
        </Header>
        <div>{listOfPolls}</div>
        <Confirm
          open={openConfirm}
          content="Are you sure you want to remove this poll?"
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
        />
      </Container>
    );
  }
}

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
