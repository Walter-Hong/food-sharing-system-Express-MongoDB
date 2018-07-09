var user = require('../fmdb').user;

exports.new = newUser; // new user
exports.login = login;   // login
exports.out = out;     // logout
exports.index = index;   // demonstrate one’s home page
exports.edit = edit;    // modifying user information
exports.center = center;  // User center
exports.reply = reply;   // someone’s reply
exports.chat = chat;   // chat
exports.buy = buy;   // buy

function newUser(req, res, next) {
    var user = req.user;
    user.info = req.session.tempInfo;
    res.render('./user/new.html', {
        user: user,
        title: 'register'
    });
}

function login(req, res, next) {
    res.render('./user/login.html', {
        user: req.user,
        title: 'login'
    });
}

function edit(req, res, next) {
    var user = req.user.info;
    if (user === undefined) return res.redirect('/user/login');

    res.render('./user/edit', {
        user: req.user,
        title: 'profile'
    });
}

function index(req, res, next) {
    var option = {
        condition: {},
        sort: {create_date: -1},
        page: req.params.page || 1,
        userInfo: req.user.info,
        name: req.params.name
    };

    user.getUserTopicByName(option, function (err, item) {
        if (err) return next(err);
        res.render('./user/index', {
            user: req.user,
            topic: item.topic,
            user_rank: item.user_rank,
            topic_rank: item.topic_rank,
            count: item.topic_count,
            author: item.topic.author,
            paging: option.page,
            paging_link: '/people/' + item.topic.author.loginname, 
            title: req.params.name
        })
    });
}

function out(req, res, next) {
    req.session.destroy();
    res.redirect('/');
}

function center(req, res, next) {

    var user = req.user.info;
    if (user === undefined) return res.redirect('/user/login');

    res.render('./user/center', {
        user: req.user,
        title: 'user center'
    });
}

function reply(req, res, next) {
    var option = {
        name: req.params.name,
        page: req.params.page || 1
    };
    user.getReplyByName(option, function (err, item) {
        if (err) return next(err);
        res.render('./user/reply', {
            user: req.user,
            user_rank: item.user_rank,
            topic_rank: item.topic_rank,
            reply: item.reply,
            author: item.author,
            count: item.author.reply_count,
            paging: option.page,
            paging_link: '/reply/' + item.author.loginname, 
            title: 'all comment'
        });
    });

}

function buy(req, res, next) {
    var option = {
        condition: {},
        sort: {like_count: -1},
        page: req.params.page || 1,
        userInfo: req.user.info,
        name: req.params.name
    };

    user.getUserTopicByName(option, function (err, item) {
        if (err) return next(err);
        res.render('./user/buy', {
            user: req.user,
            topic: item.topic,
            user_rank: item.user_rank,
            topic_rank: item.topic_rank,
            count: item.topic_count,
            author: item.topic.author,
            paging: option.page,
            paging_link: '/people/' + item.topic.author.loginname, 
            title: req.params.name
        })
    });
}

function chat(req, res, next) {
    var option = {
        name: req.params.name,
        page: req.params.page || 1
    };


    user.getReplyByName(option, function (err, item) {
        if (err) return next(err);
        res.render('./user/chat', {
            user: req.user,
            title: 'chat with ' + req.params.name,
            user_rank: item.user_rank,
            topic_rank: item.topic_rank,
            reply: item.reply,
            author: item.author,
            count: item.author.reply_count
        });
    });

}