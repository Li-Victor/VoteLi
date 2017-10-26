import express from 'express';
import Validator from 'validator';
import isAuthenticated from '../middlewares/isAuthenticated';
import checkErrorNewPoll from '../utils/checkErrorNewPoll';

const router = express.Router();
router.use(isAuthenticated);

// GET /api/poll
// gets all the polls, just need the topic and id for each poll
router.get('/', (req, res) => {
  const db = req.app.get('db');
  db.poll.find().then((polls) => {
    res.status(200).send(polls);
  });
});

// GET /api/poll/:id
// gets the poll by id
router.get('/:pollid', (req, res) => {
  const db = req.app.get('db');
  const pollid = Number(req.params.pollid);

  db.poll
    .findOne({
      pollid
    })
    .then((poll) => {
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
  const { newPollInfo } = req.body;

  const topic = Validator.escape(newPollInfo.topic);
  const options = newPollInfo.options.split('\n').map(option => Validator.escape(option));

  const error = checkErrorNewPoll(topic, options);
  if (!Validator.isEmpty(error)) {
    return res.status(400).json({ errors: { global: error } });
  }

  const userid = req.user.id;

  return db.poll
    .insert({
      userid,
      topic
    })
    .then((poll) => {
      const pollid = poll.pollid;
      const arr = options.map(option => ({
        pollid,
        option
      }));

      return db.choices.insert(arr);
    })
    .then(result => res.status(200).json({ pollid: result[0].pollid }));
});

// POST /api/poll/:pollid/option
// adds a new option to a poll determined by the id
router.post('/:pollid/option', (req, res) => {
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
  const pollid = Number(req.params.pollid);
  const option = req.query.option;

  db
    .putPollById([pollid, option])
    .then(() =>
      // shows all the votes for this poll
      db.choices.find({
        pollid
      })
    )
    .then((result) => {
      console.log(result);
      return res.status(200).send(`casts a vote to ${option}`);
    });
});

// DELETE /api/poll/:id
// deletes a poll by its id
router.delete('/:pollid', (req, res) => {
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
