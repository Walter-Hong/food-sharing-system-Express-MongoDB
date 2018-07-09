
var express = require('express');
var user    = require('./controllers/user');
var post    = require('./controllers/post');
var auth    = require('./controllers/auth');
var router  = express.Router();
var config  = require('./config');

router.get('/', post.index);             // index
router.get('/home', post.home);             // home page
router.post('/', post.post_index);       //add a post API for getting the re-render request
router.get('/week', post.week);          // ranking list of the week
router.get('/month', post.month);        // ranking list of the month
router.get('/p/:page', post.index);      //  pagination of the home pag
router.get('/week/p/:page', post.week);  // pagination of weekly
router.get('/month/p/:page', post.week); // pagination of monthly
router.get('/post/up', post.upload);     // upload food posting
router.get('/post/pass', post.pass);     // authorize food posting
router.get('/topic/:topic', post.topic); // a particular food posting 
router.get('/post/edit/:topic', post.editpost);     //edit

router.get('/user/new', user.new);       // new user register
router.get('/user/login', user.login);   // login
router.get('/auths/:type', auth.index);   // login
router.get('/auth/wb', auth.wbSign);     // weibo
router.get('/auth/qq', auth.qqSign);     // qq
router.get('/user/out', user.out);       // logout
router.get('/user/edit', user.edit);     // page for modifying the user information
router.get('/user/center', user.center); //user center


router.get('/user/chat/:name', user.chat); //  chat with someone
router.get('/post/buy/:name', user.buy); // buy


router.get('/people/:name', user.index);      //  a particular user’s home page 
router.get('/people/:name/:page', user.index);// pagination of a particular user’s home page
router.get('/reply/:name', user.reply);       //  a particular user’s comment
router.get('/reply/:name/:page', user.reply); // pagination of a particular user’s comment

// In this page,data are transported mainly through iframe.

router.use('/uploadredirect', function (req, res, next) {
	res.send('helloWorld!');
});

module.exports = router;