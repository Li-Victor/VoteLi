module.exports = {

    findById: function (db, id, cb) {
        db.users.findOne({
            id: id
        }).then((user) => {
            if(user) cb(null, user);
            else { cb(new Error('User ' + id + ' does not exist.')); }
        });
    },

    findByUsername: function (db, username, cb) {
        db.users.findOne({
            username: username
        }).then((user) => {
            if(user) cb(null, user);
            else { cb(null, null); }
        });

    },

    registerByUsername: function (db, username, password, displayname, cb) {
        db.users.findOne({
            username: username
        }).then((user) => {

            //adds a new user, since db cannot find one
            if(!user) {

                db.users.insert({
                    displayname: displayname,
                    username: username,
                    password: password
                }).then((newUser) => {
                    if(newUser) cb(null, newUser);
                    else { cb(new Error('Something wrong with inserting with registerByUsername function')); }
                });

            } else {
                cb(null, null);
            }

        });

    },

    fbUser: function (db, username, password, displayName, cb) {
        db.users.findOne({
            username: username
        }).then((user) => {

            if(user) cb(null, user);
            else {

                db.users.insert({
                    displayname: displayName,
                    username: username,
                    password: password
                }).then((newUser) => {
                    if(newUser) cb(null, newUser);
                    else { cb(new Error('Something wrong with inserting with fbUser function')); }
                });

            }

        });

    }
};
