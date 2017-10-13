const pollModel = require('../models/poll');

module.exports = {
  // GET /api/polls
  // gets all the polls
  getPolls(req, res, next) {
    const db = req.app.get('db');
    pollModel.getPolls(db).then((polls) => {
      res.status(200).send(polls);
    });
  },

  // GET /api/poll/:id
  // gets the poll by id
  getPollById(req, res, next) {
    const db = req.app.get('db');
    const id = Number(req.params.id);

    pollModel.getPollById(db, id).then((poll) => {
      if (poll) {
        return res.status(200).send(poll);
      }
      return res.status(404).send('this poll does not exist');
    });
  },

  // GET /api/pollOptions/:id
  // gets the options by the poll id
  getPollOptionsById(req, res, next) {
    const db = req.app.get('db');
    const id = Number(req.params.id);

    pollModel.getPollOptionsById(db, id).then((options) => {
      if (options.length > 0) {
        const arr = options.map(option => option.option);
        return res.status(200).send(arr);
      }
      return res.status(404).send('this poll does not exist');
    });
  },

  // POST /api/poll
  // adds a new poll
  postPoll(req, res, next) {
    const db = req.app.get('db');
    const question = req.query.question;
    const userid = Number(req.query.userid);
    // options will be delimited by "⦰⦰"
    const options = req.query.options.split('⦰⦰');

    pollModel.postPoll(db, userid, question, options).then(result =>
      // res.redirect('/poll/')
      // result contains the inserted choices
      res.status(200).send('this will redirect to the new poll page')
    );
  },

  // POST /api/pollOption/:id
  // adds a new option to a poll determined by the id
  postPollOptionById(req, res, next) {
    const db = req.app.get('db');
    const pollid = Number(req.params.id);
    const option = req.query.option;

    pollModel.postPollOptionById(db, pollid, option).then((result) => {
      console.log(result);
      return res.status(200).send("new option for a poll. Redirect to this poll's page");
    });
  },

  // PUT /api/poll/:id
  // casts a vote to a particular poll and also logs the user's ip
  putPollById(req, res, next) {
    const db = req.app.get('db');
    const pollid = Number(req.params.id);
    const option = req.query.option;

    pollModel.putPollById(db, pollid, option).then((result) => {
      console.log(result);
      return res.status(200).send(`casts a vote to ${option}`);
    });
  },

  // DELETE /api/poll/:id
  // deletes a poll by its id
  deletePollById(req, res, next) {
    const db = req.app.get('db');
    const pollid = Number(req.params.id);

    pollModel.deletePollById(db, pollid).then((result) => {
      console.log(result[0].question);
      return res.status(200).send(`Successfully deleted ${result[0].question} poll`);
    });
  }
};
