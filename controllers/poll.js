module.exports = {

    //GET /api/polls
    //gets all the polls
    getPolls: function (req, res, next) {

    },

    //GET /api/poll/:id
    //gets the poll by id
    getPollById: function (req, res, next) {

    },

    //GET /api/pollOptions/:id
    //gets the options by the poll id
    getPollOptionsById: function (req, res, next) {

    },

    //POST /api/poll
    //adds a new poll
    postPoll: function (req, res, next) {

    },

    //POST /api/pollOption/:id
    //adds a new option to a poll determined by the id
    postPollOptionById: function (req, res, next) {

    },

    //PUT /api/poll/:id
    //casts a vote to a particular poll and also logs the user's ip
    putPollById: function (req, res, next) {

    },

    //DELETE /api/poll/:id
    //deletes a poll by its id
    deletePollById: function (req, res, next) {

    }
}
