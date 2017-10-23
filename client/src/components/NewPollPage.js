import React from 'react';

class NewPollPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      options: ''
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('submit form');
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
