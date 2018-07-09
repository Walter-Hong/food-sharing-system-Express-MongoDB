var path = require('path');
var config = require('../config');
var upload_img = require('./upload_img');
var tools = require('./tools');
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');
var fmdb = require('../fmdb');
var user = fmdb.user;
var topic = fmdb.topic;
var reply = fmdb.reply;
var topic_passed = fmdb.topic_passed;

exports.uploadImg = uploadImg;      //  upload the pictures of food posting
exports.uploadTopic = uploadTopic;    // upload the food posting
exports.modify = modify;    
exports.getNotPass = getNotPass;     // get the non-audited food posting
exports.notPass = notPass;        // voting for not passing the food posting
exports.allowPass = allowPass;      // voting for passing the food posting
exports.addReply = addReply;       // add a message for the food posting
exports.getReply = getReply;       // get a message for the food posting
exports.like = like;           // add a like to the food posting
exports.likeReply = likeReply;      // add a like to a comment
exports.getNewTopic = getNewTopic;
exports.deleteReply = deleteReply;
//upload the pictures of food posting
function uploadImg(req, res, next) {

    var token = req.session.token;
    user.getUserByToken(token, function (err, result) {
        if (err) return tools.parseRedirect({states: -1, hint: 'server busy!', data: ''}, res);

        if (result.length < 1) return tools.parseRedirect({states: -6, hint: 'please login first!', data: ''}, res);

         // First put the picture on the local and then upload it directly
        return upload_img.saveLocal(req, res, next, {
            maxSize: 1024 * 1024 * config.max_topic_img,
            fileName: tools.time(),
            dir: path.join(__dirname, '..', 'picture')
        }, function (fileName) {

            if (config.qiniu.ACCESS_KEY === '') {
                var url = encodeURIComponent('/picture/' + fileName);
                return tools.parseRedirect({states: 1, hint: 'Upload completion', data: url}, res);
            }
            upload_img.qiniu(path.join(__dirname, '..', 'picture', fileName), fileName, function (respErr, respBody, respInfo) {
                if (respErr) {
                    return tools.parseRedirect({states: -1, hint: 'server busy!', data: ''}, res);
                }
                if (respInfo.statusCode == 200) {
                    var url = encodeURIComponent(config.qiniu.URL + '/' + fileName);
                    return tools.parseRedirect({states: 1, hint: 'Upload completion', data: url}, res);
                } else {
                    return tools.parseRedirect({states: -2, hint: respBody, data: ''}, res);
                }

            })

        });

    });
}

// upload the food posting
function uploadTopic(req, res, next) {

    var topicData = {
        title: req.body.title,
        content: req.body.content,
        location: req.body.location,
        lat: req.body.lat,
        lng: req.body.lng,
        category: req.body.category,
        author_id: ObjectId(req.user._id)
    };

    var legal = topic.legal(topicData);
    if (legal.states !== 1) return res.json(legal);
    async.series([
        function (callback) {
            topic.upload(topicData, callback);
        },
        function (callback) {
            user.addTopicCount(topicData.author_id, callback);
        }
    ], function (err, result) {
        if (err) return res.json({states: -1, hint: 'server busy!'});

        return res.json({states: 1, hint: 'Successful submission!'});
    });
}


function modify(req, res, next) {
    var topicData = {
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        location: req.body.location,
        lat: req.body.lat,
        lng: req.body.lng,
        category: req.body.category,
        author_id: ObjectId(req.user._id)
    };


    async.series([
        function (callback) {
            topic_passed.update(topicData, callback);
        },
        function (callback) {
            user.addTopicCount(topicData.author_id, callback);
        }
    ], function (err, result) {
        if (err) return res.json({states: -1, hint: 'server busy!'});

        return res.json({states: 1, hint: 'Successful submission!'});
    });
}


function getNotPass(req, res, next) {

    topic.getNotPass(function (err, topicData) {
        if (err) return res.json({states: -1, hint: 'server busy!'});
        return res.json({states: 1, hint: 'success！', topic: topicData});
    });
}

// allowPass
function allowPass(req, res, next) {
    topic.allowPass(ObjectId(req.body._id), function (err, result) {
        if (err) return res.json({states: -1, hint: 'server busy!'});
        return res.json({states: 1, hint: 'success！'});
    });
}

// not pass the post
function notPass(req, res, next) {

    topic.notPass(ObjectId(req.body._id), function (err, result) {
        if (err) return res.json({states: -1, hint: 'server busy!'});
        return res.json({states: 1, hint: 'success！'});
    });
}

//deleteReply
function deleteReply(req, res, next) {
    var condition = {
        _id: req.body._id
    };
    // console.log(condition['_id']);
    topic_passed.deleteReply(condition, function (msg) {
        res.json(msg);
    });
}// like
function like(req, res, next) {
    var condition = {
        _id: req.body._id,
        liker_id: req.user._id
    };
    topic_passed.like(condition, function (msg) {
        res.json("success");
    });
}

// add reply
function addReply(req, res, next) {
    var condition = {
        _id: req.body._id
    };
    var replyData = {
        content: req.body.content,
        reply_id: req.user._id,
        topic_id: req.body._id
    };
    
    var legal = reply.legal(replyData);
    if (legal.states < 1) {
        return res.json(legal);
    }
    async.series([
        function (callback) {
            reply.addReply(condition, replyData, callback);
        },
        function (callback) {
            user.addReplyCount(replyData.reply_id, callback);
        }
    ], function (err, item) {
        if (err) return res.json({states: -1, hint: 'server busy!'});
        res.json({states: 1, hint: 'comment success!', _id: item[0]._id})
    });
}


function getReply(req, res, next) {
    var condition = {
        topic_id: req.body._id
    };
    reply.getReply(condition, req.user, function (err, result) {
        if (err) return res.json({states: -1, hint: 'server busy!'});
        return res.json({states: 1, hint: 'success!', data: result});
    });
}


// likeforreply
function likeReply(req, res, next) {
    var condition = {
        _id: req.body._id,
        liker_id: req.user._id
    };
    reply.likeReply(condition, function (msg) {
        res.json(msg);
    });
}

//read
function getNewTopic(req, res, next) {
    var option = {
        condition: {
            title: new RegExp(req.body.text)
        }
    };
    topic_passed.getTopic(option, function (err, item) {
        if (err) return next(err);
        res.render('index', {
            user: req.user,
            topic: item.topic,
            count: item.topic_count,
            user_rank: item.user_rank,
            topic_rank: item.topic_rank,
            paging: option.page,
            paging_link: '/p', // header
            title: config.title,
            subfield: 0
        });
        res.end();
    });
}