import React from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      polls: []
    };
  }

  componentDidMount() {
    api.poll.getPolls().then((polls) => {
      this.setState({ loading: true, polls });
    });
  }

  render() {
    const { loading, polls } = this.state;
    const pollLinks = polls.map(poll => (
      <div key={poll.pollid}>
        <Link key={poll.pollid} to={`/poll/${poll.pollid}`}>
          {poll.topic}
        </Link>
        <br />
      </div>
    ));
    return (
      <div>
        {!loading && <p>Loading...</p>}
        {loading && pollLinks}
      </div>
    );
  }
}

export default HomePage;
