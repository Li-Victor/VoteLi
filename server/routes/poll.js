import express from 'express';

import pollModel from '../models/poll';

const router = express.Router();
// need authentication middleware

// GET /api/poll
// gets all the polls, just need the topic and id for each poll
router.get('/', (req, res) => {
  const db = req.app.get('db');
  pollModel.getPolls(db).then((polls) => {
    res.status(200).send(polls);
  });
});

// GET /api/poll/:id
// gets the poll by id
router.get('/:pollid', (req, res) => {
  const db = req.app.get('db');
  const pollid = Number(req.params.pollid);

  pollModel.getPollById(db, pollid).then((poll) => {
    if (poll) {
      return res.status(200).send(poll);
    }
    return res.status(404).send('this poll does not exist');
  });
});

// POST /api/poll
// adds a new poll from a userid
router.post('/', (req, res) => {
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
});

// POST /api/poll/:pollid/option
// adds a new option to a poll determined by the id
router.post('/:pollid/option', (req, res) => {
  const db = req.app.get('db');
  const pollid = Number(req.params.pollid);
  const option = req.query.option;

  pollModel.postPollOptionById(db, pollid, option).then((result) => {
    console.log(result);
    return res.status(200).send("new option for a poll. Redirect to this poll's page");
  });
});

// PUT /api/poll/:pollid
// casts a vote to a particular poll and also logs the user's ip
router.put('/:pollid', (req, res) => {
  const db = req.app.get('db');
  const pollid = Number(req.params.pollid);
  const option = req.query.option;

  pollModel.putPollById(db, pollid, option).then((result) => {
    console.log(result);
    return res.status(200).send(`casts a vote to ${option}`);
  });
});

// DELETE /api/poll/:id
// deletes a poll by its id
router.delete('/:pollid', (req, res) => {
  const db = req.app.get('db');
  const pollid = Number(req.params.pollid);

  pollModel.deletePollById(db, pollid).then((result) => {
    console.log(result[0].question);
    return res.status(200).send(`Successfully deleted ${result[0].question} poll`);
  });
});

export default router;
