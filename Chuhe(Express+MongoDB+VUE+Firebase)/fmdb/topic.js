var Topic = require('../models').Topic;
var topic_passed = require('./topic_passed');
var config = require('../config');
var async = require('async');

exports.legal = Topic.legal;    // check on whether the data is legal or not
exports.upload = upload;         // upload the food posting
exports.getNotPass = getNotPass;     // get the food posting that is not authorized
exports.allowPass = allowPass;      // add 1 to number of authorized food posting
exports.notPass = notPass;        // add 1 to number of non-authorized food posting
exports.getTopicById = getTopicById; // get food posting by ID

function upload(topicData, callback) {

    Topic.create(topicData, function (err, result) {
        callback(err, result);
    })
}

function getNotPass(callback) {
    var condition = {
        notpassed_count: {$lt: config.pass_count}
    };

    Topic.find(condition, function (err, topicData) {
        if (err) return callback(err, null);
        topicData = topicData[parseInt(Math.random() * topicData.length)];
        callback(err, topicData);
    });
}

function getTopicById(id, callback) {
    Topic.find({_id: id}, function (err, topicData) {
        callback(err, topicData);
    });
}

function pass(topicId, set, callback) {
    var condition = {
        _id: topicId
    };
    async.waterfall([
        function (callback) {
            Topic.update(condition, set, function (err, result) {
                callback(err, result);
            });
        },
        function (result, callback) {
            getTopicById(topicId, callback);
        }
    ], function (err, item) {
        if (err) return callback(err, null);
        overBound(item[0]);
        callback(null, item);
    });
}

function allowPass(topicId, callback) {
    pass(topicId, {$inc: {passed_count: 1}}, callback);
}

function notPass(topicId, callback) {
    pass(topicId, {$inc: {notpassed_count: 1}}, callback);
}

// Checking whether the number of users authorizing the food posting is up to a specific number.
function overBound(topic) {
    if (topic.passed_count >= config.pass_count) {
        var date = new Date();
        var TopicData = {
            title: topic.title,
            content: topic.content,
            location: topic.location,
            lat: topic.lat,
            lng: topic.lng,
            category: topic.category,
            author_id: topic.author_id,
            create_date: date,
            like_count: parseInt(Math.random() * config.start_like + 1)
        };
        // Delete the food posting
        Topic.remove({_id: topic._id}, function (err, result) {
        });

        //put the fooding posting to a set of authorized food posting
        topic_passed.createTopic(TopicData, function (err, result) {
        });
    }
}