import express from 'express';
import Validator from 'validator';
import isAuthenticated from '../middlewares/isAuthenticated';
import checkErrorNewPoll from '../utils/checkErrorNewPoll';

const router = express.Router();

// GET /api/poll
// gets all the polls, just need the topic and id for each poll
router.get('/', (req, res) => {
  const db = req.app.get('db');
  db.poll.find({}, { columns: ['pollid', 'topic'] }).then((polls) => {
    res.status(200).send(polls);
  });
});

// GET /api/poll/:id
// gets the poll by id
router.get('/:pollid', (req, res) => {
  const db = req.app.get('db');
  let pollid = req.params.pollid;

  if (!Validator.isNumeric(pollid)) {
    return res.status(404).send('This poll does not exist');
  }

  pollid = Validator.toInt(pollid);
  return db.getPollById([pollid]).then((poll) => {
    if (poll.length >= 2) {
      return res.status(200).send(poll);
    }
    return res.status(404).send('This poll does not exist');
  });
});

// makes a couple of requsts
// 1. insert topics for new poll
// 2. insert choices for the new poll
// 3. get all user's polls
// returns new created pollid and user's info
function responseNewPoll(db, topic, options, userid, req, res) {
  const insertTopicAndChoices = db.poll.insert({ userid, topic }).then((poll) => {
    const pollid = poll.pollid;
    const arr = options.map(option => ({
      pollid,
      option
    }));
    return db.choices.insert(arr);
  });

  const getUserPolls = insertTopicAndChoices.then(() =>
    db.poll.find({
      userid
    })
  );

  // accessing previous promise results
  // resultInsertTopicAndChoices and polls is the result of the two promises
  return Promise.all([
    insertTopicAndChoices,
    getUserPolls
  ]).then(([resultInsertTopicAndChoices, polls]) => {
    const { id, displayname } = req.user;
    return res.status(200).json({
      pollid: resultInsertTopicAndChoices[0].pollid,
      user: {
        id,
        displayname,
        polls
      }
    });
  });
}

// POST /api/poll
// adds a new poll from a userid
router.post('/', isAuthenticated, (req, res) => {
  const db = req.app.get('db');
  const { newPollInfo } = req.body;

  const topic = Validator.escape(newPollInfo.topic);
  const options = newPollInfo.options.split('\n').map(option => Validator.escape(option));

  const error = checkErrorNewPoll(topic, options);
  if (!Validator.isEmpty(error)) {
    return res.status(400).json({ errors: { global: error } });
  }

  const userid = req.user.id;

  return responseNewPoll(db, topic, options, userid, req, res);
});

// POST /api/poll/:pollid/option
// adds a new option to a poll determined by the id
router.post('/:pollid/option', isAuthenticated, (req, res) => {
  const db = req.app.get('db');
  const pollid = Number(req.params.pollid);
  const option = req.query.option;

  db.choices
    .insert({
      pollid,
      option
    })
    .then(() =>
      // shows all the votes for this poll
      db.choices.find({
        pollid
      })
    )
    .then((result) => {
      console.log(result);
      return res.status(200).send("new option for a poll. Redirect to this poll's page");
    });
});

// PUT /api/poll/:pollid
// casts a vote to a particular poll and also logs the user's ip
router.put('/:pollid', (req, res) => {
  const db = req.app.get('db');
  let pollid = req.params.pollid;

  if (!Validator.isNumeric(pollid)) {
    return res.status(404).send('This poll does not exist');
  }

  pollid = Validator.toInt(pollid);
  const option = Validator.escape(req.body.option);

  return db
    .putPollById([pollid, option])
    .then(() => res.status(200).send('casted a vote'))
    .catch(() => res.status(404).send('error casting a vote'));
});

// DELETE /api/poll/:id
// deletes a poll by its id
router.delete('/:pollid', isAuthenticated, (req, res) => {
  const db = req.app.get('db');
  const pollid = Number(req.params.pollid);

  db.poll
    .destroy({
      pollid
    })
    .then((result) => {
      console.log(result[0].question);
      return res.status(200).send(`Successfully deleted ${result[0].question} poll`);
    });
});

export default router;
