var pollModel = require('../models/poll');

module.exports = {

    //GET /api/polls
    //gets all the polls
    getPolls: function (req, res, next) {
        var db = req.app.get('db');
        pollModel.getPolls(db).then((polls) => {
            res.status(200).send(polls);
        });
    },

    //GET /api/poll/:id
    //gets the poll by id
    getPollById: function (req, res, next) {
        var db = req.app.get('db');
        var id = Number(req.params.id);

        pollModel.getPollById(db, id).then((poll) => {
            if(poll) { return res.status(200).send(poll); }
            else { return res.status(404).send('this poll does not exist'); }
        });
    },

    //GET /api/pollOptions/:id
    //gets the options by the poll id
    getPollOptionsById: function (req, res, next) {
        var db = req.app.get('db');
        var id = Number(req.params.id);

        pollModel.getPollOptionsById(db, id).then((options) => {
            if(options.length > 0) {
                var arr = options.map(function (option) {
                    return option.option;
                });
                return res.status(200).send(arr);
            }
            else { return res.status(404).send('this poll does not exist'); }
        });
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
};
