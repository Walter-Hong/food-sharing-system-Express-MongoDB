/**
 *author walter 
 *注册页路由
 */

var express = require('express');
var router = express.Router();
var models = require("./models");

// 2.1注册uri匹配进入到注册页面
router.get('/register', function (req, res, next) {
    res.render('register');
});

// 2.2 注册页面提交处理逻辑
router.post('/', function (req, res, next) {
    var err = false;
    var data = req.body;
    var password = data.password;
    if (password) {
        // 密码加盐再md5处理后保存到数据库
        var salt = crypto.randomBytes(8);
        var recievedHash = crypto.createHash('md5')
            .update(password)
            .update(salt)
            .digest('hex');
        var hashedPassword = recievedHash + ',' + salt.toString('hex');
        data.password = hashedPassword;
    }

    // 根据数据创建用户
    models.User.create(data).then(function (user) {
        // 成功创建回到首页
        res.render('index');
    }).catch(next);
});

module.exports = router;
