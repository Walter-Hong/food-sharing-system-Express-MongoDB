var user = require('../fmdb').user;

// 登录后才能进行操作的
exports.auth = function (req, res, next) {
    var token = req.session.token;
    user.getUserByToken(token, function (err, user) {
        if (err) return res.json({states: -1, hint: 'server has error'});
        if (user.length < 1) return res.json({states: -2, hint: 'please login first!'});
        req.user = user[0];
        next();
    });
};

// 不需要login也能进入
exports.tryAuth = function (req, res, next) {
    var token = req.session.token;
    user.getUserByToken(token, function (err, user) {
        if (err) return res.json({states: -1, hint: 'server has error'});
        if (user.length < 1) return next();
        req.user = user[0];
        next();
    });
};