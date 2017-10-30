import React from 'react';
import PropTypes from 'prop-types';
import Validator from 'validator';
import api from '../api';

class PollPage extends React.Component {
  constructor(props) {
    super(props);
    const pollid = this.props.match.params.id;
    this.state = {
      loading: true,
      pollInfo: [],
      error: !Validator.isNumeric(pollid),
      pollid
    };
  }

  componentDidMount() {
    const { error, pollid } = this.state;
    if (!error) {
      api.poll.getPollById(pollid).then((pollInfo) => {
        this.setState({ loading: false, pollInfo });
      });
    }
  }

  render() {
    const { loading, pollInfo, pollid, error } = this.state;
    const choices = pollInfo.map(choice => (
      <p key={choice.choicesid}>
        Option: {choice.option} Votes: {choice.votes}
      </p>
    ));
    return (
      <div>
        {error && <h1>This poll does not exist</h1>}
        {loading && !error && <p>Loading Poll Page for pollid: {pollid}...</p>}
        {!loading &&
          !error && (
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
