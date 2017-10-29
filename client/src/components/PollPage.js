import React from 'react';
import PropTypes from 'prop-types';
import api from '../api';

class PollPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pollInfo: []
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    api.poll.getPollById(id).then((pollInfo) => {
      this.setState({ loading: false, pollInfo });
    });
  }

  render() {
    const { match } = this.props;
    const { loading, pollInfo } = this.state;
    const choices = pollInfo.map(choice => (
      <p key={choice.choicesid}>
        Option: {choice.option} Votes: {choice.votes}
      </p>
    ));
    return (
      <div>
        {loading && <p>Poll Page for pollid: {match.params.id}</p>}
        {!loading && (
          <div>
            <h1>{pollInfo[0].topic}</h1>
            {choices}
          </div>
        )}
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
