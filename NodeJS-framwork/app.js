/**
 * 项目总体配置
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var crypto = require('crypto');
var models = require('./models');
var app = express();

/**
 *session 存储配置
 */
global.storeMemory = new session.MemoryStore({
    reapInterval: 60000 * 10
});

/**
 * 设置view渲染引擎为jade
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * 设置中间件和静态路径
 */

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


//  1. 声明路由转发
// app.use('/', register);


// 捕获404事件
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 错误处理

// 开发状态打印错误信息
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 部署状态隐藏错误
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
