var dbConnection = require('./dbConnection');

module.exports = {
    getPolls: function () {
        return dbConnection.then((db) => {
            return db.poll.find();
        });
    },

    getPollById: function (id) {
        return dbConnection.then((db) => {
            return db.poll.findOne({
                pollid: id
            });
        });
    },

    getPollOptionsById: function (id) {
        return dbConnection.then((db) => {
            return db.getPollOptionsById([id]);
        })
    }
};
