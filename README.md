# VoteLi

VoteLi is a Node.js web application in which polls can be created, voted, and graphed.

[**Check out VoteLi**](http://voteli.herokuapp.com/)

## Getting Started

### Prerequisites

- [NodeJS](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/)

In order for the authorization component of this app to work, it needs to be registered with Twitter using [Twitter Application Management](https://apps.twitter.com/).

The callback URL also needs to be provided in the format `DOMAIN/login/twitter/return`. <br>
Example `http:127.0.0.1:5000/login/twitter/return`.

Then the application will then be issued a consumer key and consumer secret.

### Steps
- Run `npm run build` or `yarn run build`.
- Create a new database and run `setup.sql` to setup the tables needed.
- In the root directory, create a .env file (or rename the env-sample file to .env) and place the following:
  - TWITTER_CONSUMER_KEY=*CONSUMER KEY ASSIGNED BY TWIITER*
  - TWITTER_CONSUMER_SECRET=*CONSUMER SECRET ASSIGNED BY TWITTER*
  - SESSION_SECRET=*ANY RANDOM STRING OF CHARACTERS*
  - DATABASE_URL=*YOUR POSTGRES DATABASE URL*
  - REDIRECT_DOMAIN=*WEBSITE DOMAIN NAME*
  - PORT=*ANY PORT NUMBER FOR EXPRESS, EXCLUDING 3000*
- Make sure the new database with tables is running.
- Run `npm run dev` or `yarn run dev`.
- Navigate to `localhost:3000` in your browser.


## Available Scripts

In the project directory, the following commands are available:

### `npm run dev` or `yarn run dev`

Builds the app for development. It is watched by webpack for any changes in the front end (React) and back end (Express).

### `npm run lint` or `yarn run lint`

Lints both front end (React) and back end (Express).

## Libraries
- Express.js
- Massive
- Passport Twitter
- React
- Redux
- Redux Thunk
- React Router v4
- Axios
- Semantic UI React
- React Chartjs 2
- Validator
