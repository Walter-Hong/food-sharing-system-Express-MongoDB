var express = require('express');
var router = express.Router();
// var models = require("../models");

// 2.1注册uri匹配进入到注册页面
router.get('/', function (req, res, next) {
    res.render('register');
});

// 2.2 注册页面提交处理逻辑
router.post('/', function (req, res, next) {
    var err = false;
    var data = req.body;
    var password = data.password;
    res.render('index', {title: 'register success!'});
});

module.exports = router;
