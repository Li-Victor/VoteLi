export default {
  findById(db, id, cb) {
    db.users
      .findOne({
        id
      })
      .then((user) => {
        if (user) cb(null, user);
        else {
          cb(new Error(`User ${id} does not exist.`));
        }
      });
  },

  findByUsername(db, username, cb) {
    db.users
      .findOne({
        username
      })
      .then((user) => {
        if (user) cb(null, user);
        else {
          cb(null, null);
        }
      });
  },

  registerByUsername(db, username, password, displayname, cb) {
    db.users
      .findOne({
        username
      })
      .then((user) => {
        // adds a new user, since db cannot find one
        if (!user) {
          db.users
            .insert({
              displayname,
              username,
              password
            })
            .then((newUser) => {
              if (newUser) cb(null, newUser);
              else {
                cb(new Error('Something wrong with inserting with registerByUsername function'));
              }
            });
        } else {
          cb(null, null);
        }
      });
  },

  fbUser(db, username, password, displayName, cb) {
    db.users
      .findOne({
        username
      })
      .then((user) => {
        if (user) cb(null, user);
        else {
          db.users
            .insert({
              displayname: displayName,
              username,
              password
            })
            .then((newUser) => {
              if (newUser) cb(null, newUser);
              else {
                cb(new Error('Something wrong with inserting with fbUser function'));
              }
            });
        }
      });
  }
};
