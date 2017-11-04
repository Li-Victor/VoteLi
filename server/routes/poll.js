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
  const userip = req.ip;

  // if user is logged in for voting, then check choices table for userid
  // if user is not logged in for voting, then check choices table for userip
  if (req.isAuthenticated()) {
    const userid = req.user.id;
    // see if user with userid has voted from the logs
    return db.log
      .find({ pollid, userid })
      .then((logResult) => {
        // checks if there is an option for that poll. If not, insert new row
        // after checking, add to log the userip
        if (logResult.length === 0) {
          return db.choices.find({ pollid, option }).then((findResult) => {
            if (findResult.length === 0) {
              return db.choices
                .insert({ pollid, option, votes: 1 })
                .then(() => db.log.insert({ pollid, userid, userip }))
                .then(() => res.status(200).send('casted a vote'));
            }

            return db
              .putPollById([pollid, option])
              .then(() => db.log.insert({ pollid, userid, userip }))
              .then(() => res.status(200).send('casted a vote'));
          });
        }
        return res.status(404).send('Error: You can only vote once a poll. [user-or-ip-voted]');
      })
      .catch(() => res.status(404).send('This poll does not exist'));
  }

  // casting a vote when not logged in
  // less lines of code because we are not checking for custom options
  return db.log
    .find({ pollid, userip })
    .then((logResult) => {
      if (logResult.length === 0) {
        return db
          .putPollById([pollid, option])
          .then(() => db.log.insert({ pollid, userip }))
          .then(() => res.status(200).send('casted a vote'));
      }
      return res.status(404).send('Error: You can only vote once a poll. [user-or-ip-voted]');
    })
    .catch(() => res.status(404).send('This poll does not exist'));
});

// DELETE /api/poll/:pollid
// deletes a poll by its pollid
router.delete('/:pollid', isAuthenticated, (req, res) => {
  const db = req.app.get('db');
  let pollid = req.params.pollid;

  if (!Validator.isNumeric(pollid)) {
    return res.status(404).send('This poll does not exist');
  }

  pollid = Validator.toInt(pollid);
  const userid = req.user.id;

  return db.poll
    .destroy({
      pollid,
      userid
    })
    .then(result => res.status(200).send(`Successfully deleted Poll: ${result[0].topic} poll`));
});

export default router;
