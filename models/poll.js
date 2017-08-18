module.exports = {
    getPolls: function (db) {
        return db.poll.find();
    },

    getPollById: function (db, id) {
        return db.poll.findOne({
            pollid: id
        });
    },

    getPollOptionsById: function (db, id) {
        return db.getPollOptionsById([id]);
    },

    postPoll: function (db, userid, question, options) {
        return db.poll.insert({
            userid: userid,
            question: question
        }).then((poll) => {
            var pollid = poll.pollid;
            var arr = options.map(function (option) {
                return {
                    pollid: pollid,
                    option: option
                }
            });

            return db.choices.insert(arr);
        });
    },

    postPollOptionById: function (db, pollid, option) {
        return db.choices.insert({
            pollid: pollid,
            option: option
        }).then(() => {
            //shows all the votes for this poll
            return db.choices.find({
                pollid: pollid
            });
        });
    },

    putPollById: function (db, pollid, option) {
        return db.putPollById([pollid, option])
            .then(() => {
                //shows all the votes for this poll
                return db.choices.find({
                    pollid: pollid
                });
            });
    },

    deletePollById: function (db, pollid) {
        return db.poll.destroy({
            pollid: pollid
        });
    }
};
