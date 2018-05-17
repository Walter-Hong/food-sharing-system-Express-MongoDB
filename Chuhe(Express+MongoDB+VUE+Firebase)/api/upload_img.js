var fs = require('fs');
var path = require('path');
var qiniu = require('qiniu');
var tools = require('./tools');
var config = require('../config');
var formidable = require('formidable');

/*
* 图片保存在本地
* 需要传入的几个值
* {
* 	maxSize: ***,
*   dir: ***,
* 	fileName: ***,
* }
* */
exports.saveLocal = function (req, res, next, config, callback) {

    var form = formidable.IncomingForm();

    form.uploadDir = config.dir;
    form.keepExtensions = true;

    form.parse(req, function (err, fields, file) {
        if (err)
            return tools.parseRedirect({states: -1, hint: 'server error', data: ''}, res);

        if (file.avatar === undefined)
            return tools.parseRedirect({states: -2, hint: 'upload file error', data: ''}, res);

        file = file.avatar;

        if (file.size > config.maxSize) {
            fs.unlink(file.path, function (err) {
                return tools.parseRedirect({
                    states: -3,
                    hint: 'img size over' + (config.maxSize / 1024 / 1024) + 'm',
                    data: ''
                }, res);
            });
            return;
        }

        var type = ['image/png', 'image/jpeg', 'image/gif'];
        if (type.indexOf(file.type) === -1) {
            fs.unlink(file.path, function (err) {
                return tools.parseRedirect({states: -4, hint: 'img type error', data: ''}, res);
            });
            return;
        }

        var userFileName = config.fileName + path.extname(file.name);
        fs.rename(file.path, path.join(config.dir, userFileName), function (err) {
            if (err) return tools.parseRedirect({states: -5, hint: 'img site error', data: ''}, res);
            callback(userFileName);
        });

    });

};

exports.qiniu = function (localFile, fileName, callback) {
    var accessKey = config.qiniu.ACCESS_KEY;
    var secretKey = config.qiniu.SECRET_KEY;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
        scope: config.qiniu.BUCKET
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    var configs = new qiniu.conf.Config();

    // 空间对应的机房
    configs.zone = qiniu.zone.Zone_z2;
    var formUploader = new qiniu.form_up.FormUploader(configs);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = fileName;
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
        callback(respErr, respBody, respInfo);
    });

};