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
    }
};
