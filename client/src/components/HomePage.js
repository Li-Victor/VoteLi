import React from 'react';
import api from '../api';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    api.poll.getPolls().then((res) => {
      console.log(res);
      this.setState({ loading: true });
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <div>
        {!loading && <p>Loading...</p>}
        {loading && <p>Rest of the polls</p>}
      </div>
    );
  }
}

export default HomePage;
