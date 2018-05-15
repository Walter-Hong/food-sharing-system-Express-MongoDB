var express = require('express');
var user = require('./api/user');
var post = require('./api/post');
var middlewares = require('./api/middlewares');
var router = express.Router();

// 用户
router.post('/user/new', user.new);             // 增加新用户
router.post('/user/login', user.login);         // 站内登录

router.post('/user/avatar', user.uploadAvatar); // 上传头像
router.post('/user/islogin', user.isLogin);     // 返回登录状态
router.post('/user/edit', middlewares.auth, user.edit);  // edit profile

// 食物帖子
router.post('/post/upload', post.uploadImg);    // 上传食物帖子图片
router.post('/post/new', middlewares.auth, post.uploadTopic);     // 上传食物帖子
router.post('/post/like', middlewares.auth, post.like);           // 喜欢一条食物帖子
router.post('/post/likereply', middlewares.auth, post.likeReply); // 喜欢一条评论
router.post('/post/addreply', middlewares.auth, post.addReply);   // 给一条食物帖子留言
router.post('/post/getNewTopic', post.getNewTopic); //This router is for supporting search function that request index for re-render index page

router.get('/post/notpass', post.getNotPass);   // 返回一条还没有审核的食物帖子
router.post('/post/allowPass', post.allowPass); // 食物帖子通过数加一
router.post('/post/notpass', post.notPass);     // 食物帖子不通过数加一
router.post('/post/getreply', middlewares.tryAuth, post.getReply);   // 获取食物帖子的留言

module.exports = router;