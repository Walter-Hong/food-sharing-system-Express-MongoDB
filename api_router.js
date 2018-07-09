
var express = require('express');
var user = require('./api/user');
var post = require('./api/post');
var middlewares = require('./api/middlewares');
var router = express.Router();

// 用户
router.post('/user/new', user.new);             // add new user
router.post('/user/login', user.login);         // login

router.post('/user/avatar', user.uploadAvatar); // login avatar
router.post('/user/islogin', user.isLogin);     // return to the login status
router.post('/user/edit', middlewares.auth, user.edit);  // edit profile

// food postings
router.post('/post/edit/:id', post.modify);    // modify
router.post('/post/upload', post.uploadImg);    // upload pictures for food posting
router.post('/post/new', middlewares.auth, post.uploadTopic);     // upload food posting
router.post('/post/like', middlewares.auth, post.like);           // like
router.post('/post/likereply', middlewares.auth, post.likeReply); // likeacomment
router.post('/post/addreply', middlewares.auth, post.addReply);   // comment to a food posting
router.post('/post/getNewTopic', post.getNewTopic); //This router is for supporting search function that request index for re-render index page
router.post('/post/deleteReply', post.deleteReply)

router.get('/post/notpass', post.getNotPass);   // return a food posting that is not authorized
router.post('/post/allowPass', post.allowPass); // add 1 to the number of authorized food postings
router.post('/post/notpass', post.notPass);     //  add 1 to the number of non-authorized food postings
router.post('/post/getreply', middlewares.tryAuth, post.getReply);   //  get the comment of food postings

module.exports = router;