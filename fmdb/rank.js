var User = require('../models/index').User;
var TopicPassed = require('../models/index').TopicPassed;

exports.user = user;       // top 5 users ranked by score
exports.topic = topic;     // get the first four food postings ranked by the numbers of likes


function user(callback) {
    User.find({}).sort({topic_count: -1}).limit(5).exec(function (err, user) {
        if (err) return callback(err, []);
        for (var i = 0; i < user.length; i++) {
            user[i].avatar = user[i].fullAvatar;
        }
        callback(err, user);
    });
}

function topic(callback) {
    TopicPassed.find({}).sort({like_count: -1}).limit(4).exec(function (err, topic) {
        callback(err, topic);
    });
}