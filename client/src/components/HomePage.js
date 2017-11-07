import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import api from '../api';
import isEmptyObject from '../utils/isEmptyObject';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      polls: []
    };
  }

  componentDidMount() {
    api.poll.getPolls().then((polls) => {
      this.setState({ loading: false, polls });
    });
  }

  pickColor = (index) => {
    const colors = ['red', 'orange', 'yellow', 'olive', 'teal', 'blue', 'violet', 'purple', 'pink'];
    return colors[index % colors.length];
  };

  render() {
    const { loading, polls } = this.state;
    const pollLinks = polls.map((poll, index) => (
      <Segment color={this.pickColor(index)} key={poll.pollid}>
        <Link key={poll.pollid} to={`/poll/${poll.pollid}`}>
          {poll.topic}
        </Link>
      </Segment>
    ));
    return (
      <Container text style={{ marginTop: '5em' }}>
        <Header as="h1">
          <Header.Content>VoteLi</Header.Content>
          <Header.Subheader>
            {isEmptyObject(this.props.user) ? (
              <div>Select a poll to see the results and vote, or sign-in to make a new poll.</div>
            ) : (
              <div>
                Select a poll to see thre results and vote,{' '}
                <Link to="/newpoll">or make a new poll!</Link>
              </div>
            )}
          </Header.Subheader>
        </Header>
        {loading && <Header as="h2">Loading...</Header>}
        {!loading && pollLinks}
      </Container>
    );
  }
}

HomePage.propTypes = {
  user: PropTypes.shape({
    displayname: PropTypes.string,
    polls: PropTypes.arrayOf(
      PropTypes.shape({
        pollid: PropTypes.number
      })
    )
  }).isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(HomePage);
