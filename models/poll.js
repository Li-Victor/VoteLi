module.exports = {
  getPolls(db) {
    return db.poll.find();
  },

  getPollById(db, id) {
    return db.poll.findOne({
      pollid: id
    });
  },

  getPollOptionsById(db, id) {
    return db.getPollOptionsById([id]);
  },

  postPoll(db, userid, question, options) {
    return db.poll
      .insert({
        userid,
        question
      })
      .then((poll) => {
        const pollid = poll.pollid;
        const arr = options.map(option => ({
          pollid,
          option
        }));

        return db.choices.insert(arr);
      });
  },

  postPollOptionById(db, pollid, option) {
    return db.choices
      .insert({
        pollid,
        option
      })
      .then(() =>
        // shows all the votes for this poll
        db.choices.find({
          pollid
        })
      );
  },

  putPollById(db, pollid, option) {
    return db.putPollById([pollid, option]).then(() =>
      // shows all the votes for this poll
      db.choices.find({
        pollid
      })
    );
  },

  deletePollById(db, pollid) {
    return db.poll.destroy({
      pollid
    });
  }
};
