var TopicPassed = require('../models').TopicPassed;
var ObjectId = require('mongoose').Types.ObjectId;
var config = require('../config');
var user = require('./user');
var rank = require('./rank');
var async = require('async');

exports.getTopic = getTopic;    // get a list of food posting
exports.createTopic = createTopic; // create a food listing
exports.deleteReply = deleteReply;
exports.like = like;        
exports.update = update;       
exports.getTopicById = getTopicById;

// get a list of food posting including the list of food posting and the list of users
function getTopic(option, cd) {
    async.series({
        topic: function (callback) {
            topic(option, callback);
        },
        topic_count: function (callback) {
            count(option, callback);
        },
        user_rank: function (callback) {
            rank.user(callback);
        },
        topic_rank: function (callback) {
            rank.topic(callback);
        }
    }, function (err, item) {
        cd(err, item);
    });
}

// get food posting by food posting ID
function getTopicById(option, cd) {
    async.series({
        topic: function (callback) {
            TopicPassed.find(option.condition, function (err, topic) {
                if (err) return callback(err, null);
                var userInfo = option.userInfo;

                liked(userInfo, topic, callback);
            })
        },
        count: function (callback) {
            count(option, callback);
        },
        user_rank: function (callback) {
            rank.user(callback);
        },
        topic_rank: function (callback) {
            rank.topic(callback);
        }
    }, function (err, item) {
        cd(err, item);
    });
}

// create a food posting
function createTopic(topic, callback) {
    TopicPassed.create(topic, function (err, result) {
        callback(err, result);
    });
}


function update(condition, callback) {
    TopicPassed.findByIdAndUpdate(condition.id, condition, {new: true}, function (err, tank) {
        if (err) return callback({states: -1, hint: 'server busy!'});
        return callback({states: 1, hint: 'edit success!'});
    });

}


function deleteReply(condition, callback) {
    // console.log(condition['_id']);
    TopicPassed.remove(condition, function (err) {
        if (err) return callback({states: -1, hint: 'server busy!'});
        return callback({states: 1, hint: 'success!'});
    });

}


function like(condition, callback) {
    TopicPassed.find(condition, function (err, topic) {
        if (err) return callback({states: -1, hint: 'server busy!'});
        // if (topic.length > 0) return callback({states: -2, hint: '已经赞过咯'});

        var like_count = parseInt(Math.random() * config.like + 1);

        TopicPassed.update({_id: condition._id}, {
            $inc: {like_count: like_count},
            $push: {liker_id: ObjectId(condition.liker_id)}
        }, function (err, result) {
            if (err) return callback({states: -1, hint: 'server busy!'});

            return callback({states: 1, hint: 'success!'});
        });
    });
}



function liked(userInfo, topic, callback) {
    var topicData = [];
    (function iteration(i) {
        if (i >= topic.length) {
            return callback(null, topicData);
        }
        user.getUserById(topic[i].author_id, function (err, user) {

            if (err) return callback(err, null);
            topic[i].author = user[0];
            // check whether it has been added a like
            if (userInfo) {
                topic[i].liked = topic[i].liker_id.indexOf(userInfo._id) === -1 ? 0 : 1;
            } else {
                topic[i].liked = 0;
            }

            topicData.push(topic[i]);
            iteration(++i);
        });
    })(0)
}

// get the food posting
function topic(option, callback) {
    var req = option.req;
    var page = option.page;
    var sort = option.sort;
    var condition = option.condition;
    var userInfo = option.userInfo;
    TopicPassed.find(condition)
        .limit(config.topic_limit)
        .skip(config.topic_limit * (page - 1))
        .sort(sort).exec(function (err, topic) {

        if (err) return callback(err, null);
        liked(userInfo, topic, callback);

    })
}

// the number of food posting
function count(option, callback) {
    TopicPassed.count(option.condition, function (err, count) {
        callback(err, count);
    });
}