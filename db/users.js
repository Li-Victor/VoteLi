var records = [
    {id: 1, username: 'username', password: 'password', displayName: 'First user'},
    {id: 1982584305101139, username: 'victoremail', password: 'victorpassword', displayName: 'Victor Li'}
];

module.exports = {

    findById: function (id, cb) {

        process.nextTick(function () {
            for(var i = 0; i < records.length; i++) {
                var record = records[i];
                if(record.id === Number(id)) {
                    return cb(null, records[i]);
                }
            }
            return cb(new Error('User ' + id + ' does not exist'));

        });

    },

    findByUsername: function (username, cb) {
        process.nextTick(function () {
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            if(record.username === username) {
                //return userObject
                return cb(null, record);
            }
        }
            return cb(null, null);
        });
    }

}
