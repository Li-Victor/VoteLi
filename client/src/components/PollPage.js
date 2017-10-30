import React from 'react';
import PropTypes from 'prop-types';
import Validator from 'validator';
import { Doughnut } from 'react-chartjs-2';
import randomColor from 'randomcolor';

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
      api.poll
        .getPollById(pollid)
        .then((pollInfo) => {
          this.setState({ loading: false, pollInfo });
        })
        .catch(() => {
          this.setState({ loading: false, error: true });
        });
    }
  }

  render() {
    const { loading, pollInfo, pollid, error } = this.state;
    const chartData = {
      labels: [],
      votes: []
    };
    const choices = pollInfo.map((choice) => {
      chartData.labels.push(choice.option);
      chartData.votes.push(choice.votes);
      return (
        <p key={choice.choicesid}>
          Option: {choice.option} Votes: {choice.votes}
        </p>
      );
    });

    const colors = randomColor({ count: 3 });

    const data = {
      labels: chartData.labels,
      datasets: [
        {
          data: chartData.votes,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }
      ]
    };

    return (
      <div>
        {error && <h1>This poll does not exist</h1>}
        {loading && !error && <p>Loading Poll Page for pollid: {pollid}...</p>}
        {!loading &&
          !error && (
            <div>
              {choices}
              <h2>{pollInfo[0].topic}</h2>
              <Doughnut data={data} />
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
