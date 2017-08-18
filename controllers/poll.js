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
        var db = req.app.get('db');
        var question = req.query.question;
        var userid = Number(req.query.userid);
        //options will be delimited by "⦰⦰"
        var options = req.query.options.split('⦰⦰');

        pollModel.postPoll(db, userid, question, options).then((result) => {
            //res.redirect('/poll/')
            //result contains the inserted choices
            return res.status(200).send('this will redirect to the new poll page');
        });
    },

    //POST /api/pollOption/:id
    //adds a new option to a poll determined by the id
    postPollOptionById: function (req, res, next) {
        var db = req.app.get('db');
        var pollid = Number(req.params.id);
        var option = req.query.option;

        pollModel.postPollOptionById(db, pollid, option).then((result) => {
            console.log(result);
            return res.status(200).send('new option for a poll. Redirect to this poll\'s page');
        });
    },

    //PUT /api/poll/:id
    //casts a vote to a particular poll and also logs the user's ip
    putPollById: function (req, res, next) {
        var db = req.app.get('db');
        var pollid = Number(req.params.id);
        var option = req.query.option;

        pollModel.putPollById(db, pollid, option).then((result) => {
            console.log(result);
            return res.status(200).send('casts a vote to ' + option);
        });
    },

    //DELETE /api/poll/:id
    //deletes a poll by its id
    deletePollById: function (req, res, next) {
        var db = req.app.get('db');
        var pollid = Number(req.params.id);

        pollModel.deletePollById(db, pollid).then((result) => {
            console.log(result[0].question);
            return res.status(200).send('Successfully deleted ' + result[0].question + ' poll');
        });
    }
};
