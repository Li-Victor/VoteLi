import React from 'react';
import PropTypes from 'prop-types';
import api from '../api';

class PollPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    api.poll.getPollById(id).then((res) => {
      console.log(res);
      this.setState({ loading: false });
    });
  }

  render() {
    const { match } = this.props;
    const { loading } = this.state;
    return (
      <div>
        {loading && <p>Poll Page for pollid: {match.params.id}</p>}
        {!loading && <p>Done searching</p>}
      </div>
    );
  }
}

PollPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default PollPage;
