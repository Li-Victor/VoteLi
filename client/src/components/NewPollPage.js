import React from 'react';
import PropTypes from 'prop-types';
import Validator from 'validator';
import { connect } from 'react-redux';
import { Button, Container, Form, Header, Message, TextArea } from 'semantic-ui-react';

import isEmptyObject from '../utils/isEmptyObject';
import { makeNewPoll } from '../actions/user';

class NewPollPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        topic: '',
        options: ''
      },
      loading: false,
      errors: {}
    };
  }

  onChange = (e) => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const sanitizedData = {
      topic: Validator.escape(this.state.data.topic),
      options: Validator.escape(this.state.data.options)
    };
    const errors = this.validate(sanitizedData);
    this.setState({ errors });
    // no errors meaning errors is an empty object
    if (isEmptyObject(errors)) {
      this.setState({ loading: true });
      this.props
        .makeNewPoll(sanitizedData)
        .then((res) => {
          this.setState({ loading: false });
          this.props.history.push(`/poll/${res}`);
        })
        .catch(err => this.setState({ errors: err.response.data.errors, loading: false }));
    }
  };

  validate = (data) => {
    const errors = {};
    if (Validator.isEmpty(data.topic)) errors.topic = 'Your poll needs a topic!';

    const allOptions = data.options.split('\n');
    if (allOptions.length < 2) errors.options = 'You need 2 or more options to make a poll!';

    const allNoneEmptyOptions = allOptions.every(element => !Validator.isEmpty(element));
    if (!allNoneEmptyOptions && Object.prototype.hasOwnProperty.call(errors, 'options')) {
      errors.options += ' All options cannot be blank!';
    }
    if (!allNoneEmptyOptions && !Object.prototype.hasOwnProperty.call(errors, 'options')) {
      errors.options = 'All options cannot be blank!';
    }
    return errors;
  };

  render() {
    const { data, errors, loading } = this.state;
    return (
      <Container text style={{ marginTop: '5em' }}>
        <Header as="h1" disabled={loading}>
          Make a new poll!
        </Header>
        <Form onSubmit={this.handleSubmit} loading={loading}>
          {errors.global && <h2>{errors.global}</h2>}
          <Form.Field required>
            <label htmlFor="topic">Topic:</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={data.topic}
              onChange={this.onChange}
            />
          </Form.Field>
          {errors.topic && (
            <Message negative>
              <Message.Header>{errors.topic}</Message.Header>
            </Message>
          )}

          <Form.Field
            id="options"
            name="options"
            control={TextArea}
            label="Options (seperated by line):"
            value={data.options}
            onChange={this.onChange}
            autoHeight
            rows={2}
            required
          />
          {errors.options && (
            <Message negative>
              <Message.Header>{errors.options}</Message.Header>
            </Message>
          )}

          <Button primary type="submit">
            Make
          </Button>
        </Form>
      </Container>
    );
  }
}

NewPollPage.propTypes = {
  makeNewPoll: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default connect(null, { makeNewPoll })(NewPollPage);
