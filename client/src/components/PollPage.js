import React from 'react';
import PropTypes from 'prop-types';
import Validator from 'validator';
import { Doughnut } from 'react-chartjs-2';
import randomColor from 'randomcolor';
import { connect } from 'react-redux';
import { Container, Icon, Message } from 'semantic-ui-react';

import api from '../api';
import isEmptyObject from '../utils/isEmptyObject';
import { deletePoll } from '../actions/user';

class PollPage extends React.Component {
  constructor(props) {
    super(props);
    const pollid = this.props.match.params.id;
    const ownUserPoll =
      !isEmptyObject(this.props.user) &&
      this.props.user.polls.findIndex(poll => poll.pollid === Number(pollid)) !== -1;

    this.state = {
      loading: true,
      pollInfo: [],
      error: !Validator.isNumeric(pollid),
      pollid,
      topic: '',
      selectValue: '',
      colors: [],
      customOption: false,
      customValue: '',
      ownUserPoll
    };
  }

  componentDidMount() {
    const { error, pollid } = this.state;
    if (!error) {
      // request to get the poll
      api.poll
        .getPollById(pollid)
        .then((pollInfo) => {
          this.setState({
            loading: false,
            pollInfo,
            topic: pollInfo[0].topic,
            colors: randomColor({ count: pollInfo.length })
          });
        })
        .catch(() => {
          this.setState({ loading: false, error: true });
        });
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    const customSelectOpion = e.target.selectedIndex - 1 === this.state.pollInfo.length;
    this.setState({
      selectValue: customSelectOpion ? 'custom' : e.target.value,
      customOption: customSelectOpion
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { pollid, customOption } = this.state;
    // selectValue is the value when user picks a custom option
    const selectValue = customOption
      ? Validator.escape(this.state.customValue)
      : Validator.escape(this.state.selectValue);

    // error if select value is empty
    if (Validator.isEmpty(selectValue)) {
      if (customOption) window.alert('Your custom voted cannot be empty');
      else window.alert('You must choose which option to vote for.');
    } else {
      api.poll
        .vote(pollid, selectValue)
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          window.alert(err.response.data);
        });
    }
  };

  changeCustomValue = (e) => {
    this.setState({
      customValue: e.target.value
    });
  };

  deletePoll = (e) => {
    if (window.confirm('Are you sure you want to remove this poll?')) {
      const pollid = e.target.id;

      this.props.deletePoll(pollid).then(() => {
        this.props.history.push('/mypolls');
      });
    }
  };

  tweet = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=Help Me Vote! ${window.location
      .href}`;
    window.open(twitterUrl);
  };

  render() {
    const {
      loading,
      pollInfo,
      pollid,
      error,
      colors,
      topic,
      customOption,
      customValue,
      selectValue,
      ownUserPoll
    } = this.state;
    const chartData = {
      labels: [],
      votes: []
    };
    const choices = pollInfo.map((choice) => {
      chartData.labels.push(choice.option);
      chartData.votes.push(choice.votes);
      return (
        <option key={choice.choicesid} value={choice.option}>
          {choice.option}
        </option>
      );
    });

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
      <Container style={{ marginTop: '5em' }}>
        {error && (
          <Message negative>
            <Message.Header>This poll does not exist.</Message.Header>
            <a href="/">Go Back to HomePage.</a>
          </Message>
        )}

        {loading &&
          !error && (
            <Message icon>
              <Icon name="circle notched" loading />
              <Message.Content>
                <Message.Header>Just one second</Message.Header>
                We are fetching Poll Page for pollid: {pollid} for you.
              </Message.Content>
            </Message>
          )}

        {!loading &&
          !error && (
            <div>
              <h2>{topic}</h2>
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="vote">
                  I&apos;d like to vote for ...
                  <select value={selectValue} onChange={this.handleChange}>
                    <option value="" disabled>
                      Choose an option....
                    </option>
                    {choices}
                    {!isEmptyObject(this.props.user) && (
                      <option value="custom">I&apos;d like a custom option</option>
                    )}
                  </select>
                </label>

                {customOption &&
                  !isEmptyObject(this.props.user) && (
                    <label htmlFor="customOption">
                      Vote with my own option:
                      <input
                        type="text"
                        id="customOption"
                        name="customOption"
                        value={customValue}
                        onChange={this.changeCustomValue}
                      />
                    </label>
                  )}

                <input type="submit" id="vote" value="Vote!" />
              </form>

              <Doughnut data={data} />
              {!loading &&
                !error &&
                !isEmptyObject(this.props.user) &&
                ownUserPoll && (
                  <button id={pollid} onClick={this.deletePoll}>
                    Delete!
                  </button>
                )}
              {!loading && !error && <button onClick={this.tweet}>Share On Twitter</button>}
            </div>
          )}
      </Container>
    );
  }
}

PollPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  user: PropTypes.shape({
    displayname: PropTypes.string,
    polls: PropTypes.arrayOf(
      PropTypes.shape({
        pollid: PropTypes.number
      })
    )
  }).isRequired,
  deletePoll: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, { deletePoll })(PollPage);
