var config = require('../config');
var tools = require('../api/tools');
var fmdb = require('../fmdb');
var topic_passed = fmdb.topic_passed;
var searchdata = '';

exports.upload = upload;  // posting food
exports.pass = pass;    // check the food posting
exports.index = index;   //  demonstrate the index
exports.home = home;   //  demonstrate the home page
exports.week = week;    // weekly
exports.month = month;   // monthly
exports.topic = topic;   // demonstrate one’s food posting
exports.post_index = post_index;
exports.editpost = editpost;

function index(req, res, next) {
    var regSearch = new RegExp(searchdata);
    var option = {
        condition: {title: regSearch},
        sort: {create_date: -1},
        page: req.params.page || 1,
        userInfo: req.user.info
    };
    console.log(option['condition']['title']);
    topic_passed.getTopic(option, function (err, item) {
        if (err) return next(err);
        res.render('index', {
            user: req.user,
            topic: item.topic,
            count: item.topic_count,
            user_rank: item.user_rank,
            topic_rank: item.topic_rank,
            paging: option.page,
            paging_link: '/p', 
            title: config.title,
            subfield: 0
        });
        searchdata = '';
    });
}

function home(req, res, next) {
    res.render('home', {
        user: req.user,
        title: config.title,
    });
}

function post_index(req, res, next) {
    // searchdata = req.body.searchbar;
    searchdata = req.body.text;
    res.end();
}

function week(req, res, next) {
    var option = {
        condition: {create_date: {$gte: tools.toTime(7)}},
        sort: {like_count: -1},
        page: req.params.page || 1,
        userInfo: req.user.info
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
            paging_link: '/week/p', //  address header
            title: config.title,
            subfield: 1
        });
    });
}

function month(req, res, next) {
    var option = {
        condition: {create_date: {$gte: tools.toTime(30)}},
        sort: {like_count: -1},
        page: req.params.page || 1,
        userInfo: req.user.info
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
            paging_link: '/month/p', 
            title: config.title,
            subfield: 2
        });
    });
}

function upload(req, res, next) {
    var token = req.session.token;
    if (token === undefined) return res.redirect('/user/login');
    res.render('./post/upload', {
        user: req.user,
        title: 'Add Listing'
    });
}

function editpost(req, res, next) {
    var option = {
        condition: {_id: req.params.topic},
        userInfo: req.user.info
    };
    topic_passed.getTopicById(option, function (err, item) {
        if (err || item.topic.length < 1) return next(new Error('not find topic'));
        res.render('./post/editpost', {
            user: req.user,
            topic: item.topic,
            topic_count: item.count,
            user_rank: item.user_rank,
            topic_rank: item.topic_rank,
            author: item.topic[0].author || [],
            title: item.topic[0].title
        });
    });
}

function pass(req, res, next) {
    res.render('./post/pass', {
        user: req.user,
        title: 'Review'
    });
}

//demonstrate one’s food posting
function topic(req, res, next) {
    var option = {
        condition: {_id: req.params.topic},
        userInfo: req.user.info
    };
    topic_passed.getTopicById(option, function (err, item) {
        if (err || item.topic.length < 1) return next(new Error('not find topic'));
        res.render('./user/topic', {
            user: req.user,
            topic: item.topic,
            topic_count: item.count,
            user_rank: item.user_rank,
            topic_rank: item.topic_rank,
            author: item.topic[0].author || [],
            title: item.topic[0].title
        });
    });
}