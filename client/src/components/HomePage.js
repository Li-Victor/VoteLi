import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Segment } from 'semantic-ui-react';

import api from '../api';

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
      <Container>
        {loading && <p>Loading...</p>}
        {!loading && pollLinks}
      </Container>
    );
  }
}

export default HomePage;
