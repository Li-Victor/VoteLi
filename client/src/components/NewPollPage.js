import React from 'react';
import Validator from 'validator';

import isEmptyObject from '../utils/isEmptyObject';

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
    console.log(errors);
    console.log('submit form');
  };

  validate = (data) => {
    const errors = {};
    if (!Validator.isEmpty(data.topic)) errors.topic = 'Your poll needs a title';

    const allOptions = data.options.split('\n');
    if (allOptions.length < 2) errors.options = 'You need 2 or more options to make a poll!';

    const allNoneEmptyOptions = allOptions.every(element => !Validator.isEmpty(element));
    if (!allNoneEmptyOptions && Object.prototype.hasOwnProperty.call(errors, 'options')) {
      errors.options += ' All options cannot be blank';
    }
    if (!allNoneEmptyOptions && !Object.prototype.hasOwnProperty.call(errors, 'options')) {
      errors.options = 'All options cannot be blank';
    }
    return errors;
  };

  render() {
    return (
      <div>
        <h1>Make a new poll!</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="topic">
            Topic:
            <input
              type="text"
              id="topic"
              name="topic"
              value={this.state.topic}
              onChange={this.onChange}
            />
          </label>

          <br />

          <label htmlFor="options">
            Options (seperated by line):
            <textarea
              id="options"
              name="options"
              value={this.state.options}
              onChange={this.onChange}
            />
          </label>

          <br />
          <input type="submit" value="Make!" />
        </form>
      </div>
    );
  }
}

export default NewPollPage;
