var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var config = require('../config');
var tools = require('../api/tools');

var UserSchema = new Schema({
    loginname: {type: String},
    password: {type: String},
    description: {type: String},
    avatar: {type: String, default: 'user_default.png'},
    email: {type: String},
    wb: {type: String}, // contact information of micro-blog
    qq: {type: String},    // contact information of QQ

    type: {type: String},
    token: {type: String},

    wbid: {type: String}, // uid of micro-blog
    qqid: {type: String},    // qopenid of QQ
    topic_count: {type: Number},
    reply_count: {type: Number}
});

UserSchema.virtual('fullAvatar').get(function () {


    if (this.avatar.indexOf('http://q.qlogo.cn') !== -1 || this.avatar.indexOf('sinaimg.cn') !== -1)
        return this.avatar;
    return '/avatar/' + this.avatar;
});

// token
UserSchema.statics.createToken = function () {
    var token = new Date().getTime() + config.token_secret + Math.random();
    var hash = crypto.createHash('md5');
    hash.update(token);
    return hash.digest('hex');
};


UserSchema.statics.cryptoPassword = function (pwd) {
    pwd = pwd + config.password_secret;
    var hash = crypto.createHash('md5');
    hash.update(pwd);
    return hash.digest('hex');
};


UserSchema.statics.legal = function (user) {
    user.description = user.description || '';

    if (!user.loginname || !user.password || !user.email)
        return {states: -1, hint: 'please fill in the blank completely!'};

    if (tools.checkChar(user.loginname) !== 1)
        return {states: -4, hint: 'your name contains illegal character'};

    if (user.loginname.length < 3 || user.loginname.length > 12 || user.email.length > 100 || user.description.length > 150)
        return {states: -3, hint: 'the length of the data is illegal'};

    if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(user.email))
        return {states: -2, hint: 'incorrect e-mail format!!'};

    return {states: 1, hint: 'legal input'};
};

UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({token: 1}, {unique: true});
module.exports = UserSchema;