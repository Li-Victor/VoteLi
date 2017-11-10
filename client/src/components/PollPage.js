import React from 'react';
import PropTypes from 'prop-types';
import Validator from 'validator';
import { Doughnut } from 'react-chartjs-2';
import randomColor from 'randomcolor';
import { connect } from 'react-redux';
import {
  Button,
  Confirm,
  Container,
  Dimmer,
  Form,
  Header,
  Icon,
  Loader,
  Message
} from 'semantic-ui-react';

import api from '../api';
import isEmptyObject from '../utils/isEmptyObject';
import { deletePoll } from '../actions/user';
import PollPageFooter from './PollPageFooter';

class PollPage extends React.Component {
  constructor(props) {
    super(props);
    const pollid = this.props.match.params.id;
    // checks empty user props object and checks if match param id is in the user's polls
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
      ownUserPoll,
      openConfirm: false,
      dimmerActive: false
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

  onCancel = () => {
    this.setState({ openConfirm: false });
  };

  onConfirm = () => {
    const { pollid } = this.state;
    this.setState({ dimmerActive: true });
    this.props.deletePoll(pollid).then(() => {
      this.props.history.push('/mypolls');
    });
  };

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

  removePoll = () => {
    this.setState({
      openConfirm: true
    });
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
      ownUserPoll,
      openConfirm,
      dimmerActive
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
              <Confirm
                open={openConfirm}
                content="Are you sure you want to remove this poll?"
                onCancel={this.onCancel}
                onConfirm={this.onConfirm}
              />
              <Dimmer active={dimmerActive} page>
                <Loader size="massive">Deleting</Loader>
              </Dimmer>

              <Header as="h1">{topic}</Header>

              <Form onSubmit={this.handleSubmit}>
                <Form.Field inline>
                  <label htmlFor="vote">I&apos;d like to vote for ...</label>
                  <select value={selectValue} onChange={this.handleChange}>
                    <option value="" disabled>
                      Choose an option....
                    </option>
                    {choices}
                    {ownUserPoll && <option value="custom">I&apos;d like a custom option</option>}
                  </select>
                </Form.Field>

                {customOption &&
                  ownUserPoll && (
                    <Form.Field inline required>
                      <label htmlFor="customOption">Vote with my own option:</label>
                      <input
                        type="text"
                        id="customOption"
                        name="customOption"
                        value={customValue}
                        onChange={this.changeCustomValue}
                      />
                    </Form.Field>
                  )}

                <Button
                  primary
                  type="submit"
                  disabled={
                    Validator.isEmpty(selectValue) ||
                    (customOption && Validator.isEmpty(customValue))
                  }
                >
                  Vote
                </Button>
              </Form>

              <Doughnut data={data} />
              <PollPageFooter
                loading={loading}
                error={error}
                ownUserPoll={ownUserPoll}
                removePoll={this.removePoll}
                tweet={this.tweet}
                pollid={pollid}
              />
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
