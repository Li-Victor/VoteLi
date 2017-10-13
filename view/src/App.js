import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>
          <a href="/">Lets-Vote</a>
        </h1>

        <h1>Login</h1>

        <form action="/login" method="post">
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" />
            <br />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" />
          </div>

          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>

        <p>
          <a href="/login/facebook">Sign in with Facebook</a>
        </p>

        <h1>Register</h1>

        <form action="/register" method="post">
          <div>
            <label htmlFor="displayName">Name:</label>
            <input type="text" name="displayName" value="" />
          </div>

          <div>
            <label>Username:</label>
            <input type="text" name="username" />
            <br />
          </div>

          <div>
            <label>Password:</label>
            <input type="password" name="password" />
          </div>

          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default App;
