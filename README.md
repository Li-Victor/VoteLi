# VoteLi

VoteLi is a Node.js web application in which polls can be created, voted, and graphed.

[**Check out VoteLi**](https://voteli.herokuapp.com/)

## Getting Started

### Prerequisites

- [NodeJS](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/)

In order for the authorization component of this app to work, it needs to be registered with Twitter using [Twitter Application Management](https://apps.twitter.com/).

The callback URL also needs to be provided in the format `DOMAIN/login/twitter/return`. <br>
Example: `http:127.0.0.1:5000/login/twitter/return`.

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

## User Stories
- [x] As an authenticated user, I can keep my polls and come back later to access them.
- [x] An as authenticated user, I can see the aggregate results of my polls.
- [x] As an authenticated user, I can delete polls that I decide I don't want anymore.
- [x] As an authenticated user, I can create a poll with any number of possible items.
- [x] As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
- [x] As an unauthenticated or authenticated user, I can see the results of polls in chart form.
- [x] As an authenticated user, if I don't like the options on a poll, I can create a new option.

## Libraries
- Express.js
- Massive
- Passport Twitter
- React using create-react-app
- Redux
- Redux Thunk
- React Router v4
- Axios
- Semantic UI React
- React Chartjs 2
- Validator
