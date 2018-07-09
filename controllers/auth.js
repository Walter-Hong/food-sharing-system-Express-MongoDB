var qq = require('../middlewares/qq_auth');
var wb = require('../middlewares/wb_auth');
var User = require('../models').User;
var config = require('../config');

exports.index = index;

function index(req, res, next) {
    if (req.params.type === undefined) {
        console.log(1);
        return next(new Error('auth type error'));
    }
    var state = User.createToken();
    req.session.state = state;

    if (req.params.type === 'qq') {
        res.redirect('https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + config.qq.ID + '&redirect_uri=' + config.qq.CALLBACK_URI + '&state=' + state);
    }

    if (req.params.type === 'wb') {
        res.redirect('https://api.weibo.com/oauth2/authorize?client_id=' + config.wb.ID + '&redirect_uri=' + config.wb.CALLBACK_URI + '&response_type=code&state=' + state);
    }

}

// login via QQ 
exports.qqSign = auth.bind(qq);

// login via micro-blog
exports.wbSign = auth.bind(wb);

function auth(req, res, next) {
    var This = this;
    var user = {state_login: false};
    var code = req.query.code;
    if (req.session.state !== req.query.state) {
        console.log(req.session.state, req.query.state);
        return next();
    }

    var idField = This.authType + 'id';
    This.getAccessToken(code, function (err, access) {
        if (err) return next(err);
        var condition = {};
        condition = This.authType === 'qq' ? condition = {qqid: access.id} : condition = {wbid: access.id};

        User.find(condition, function (err, result) {

            // new user
            if (result.length === 0) {
                //  get information after being authorized
                This.getInfo(access, function (err, info) {
                    if (err) next(err);

                    // store the message temperately
                    req.session.tempInfo = info;
                    req.session.access = access;
                    return res.redirect('/user/new');
                });
            }

            // old user
            if (result.length > 0) {
                // refresh the token
                var token = User.createToken();
                User.update(condition, {$set: {token: token}}, function (err, result) {
                    if (err) return next(err);
                    req.session.token = token;
                    return res.redirect('/');
                });
            }
        });
    });
}