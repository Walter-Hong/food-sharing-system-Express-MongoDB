var user = require('../fmdb').user;

//  users must login in before using the following function.
exports.auth = function (req, res, next) {
    var token = req.session.token;
    user.getUserByToken(token, function (err, user) {
        if (err) return res.json({states: -1, hint: 'server has error'});
        if (user.length < 1) return res.json({states: -2, hint: 'please login first!'});
        req.user = user[0];
        next();
    });
};

// users don't need to login in before using the following function.
exports.tryAuth = function (req, res, next) {
    var token = req.session.token;
    user.getUserByToken(token, function (err, user) {
        if (err) return res.json({states: -1, hint: 'server has error'});
        if (user.length < 1) return next();
        req.user = user[0];
        next();
    });
};