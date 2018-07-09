var https = require('https');
var qs = require('querystring');
var config = require('../config');



function getAccessToken(code, callback) {

    var data = qs.stringify({
        client_id: config.wb.ID,
        client_secret: config.wb.SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: config.wb.CALLBACK_URI
    });

    var options = {
        hostname: 'api.weibo.com',
        port: 443,
        path: '/oauth2/access_token?' + data,
        method: 'POST'
    };

    var req = https.request(options, function (res) {

        res.setEncoding('utf8');
        res.on('data', function (result) {
            result = JSON.parse(result);
            if (result.error_code) return callback(new Error('get weibo access_token error'));

            var access = {
                id: result.uid,
                token: result.access_token
            };
            return callback(null, access);
        });
    });

    req.on('error', function (err) {
        return callback(err, null);
    });

    req.write('');
    req.end();
}

/*
 * 
 * info = {
 *   name: *,
 *   desc: *,
 *   avatar: *,
 *   type: 'wb'
 * }
 * 
 * */
function getInfo(access, callback) {

    var options = {
        hostname: 'api.weibo.com',
        port: 443,
        path: '/2/users/show.json?uid=' + access.id + '&access_token=' + access.token,
        method: 'GET'
    };

    var req = https.request(options, function (res) {

        res.setEncoding('utf8');
        res.on('data', function (result) {
            result = JSON.parse(result);
            if (result.error_code) return callback(new Error('get weibo info error'));

            var info = {
                name: result.name,
                desc: result.description,
                avatar: result.avatar_large,
                type: 'wb'
            };
            return callback(null, info);
        });
    });

    req.on('error', function (err) {
        return callback(err, null);
    });

    req.write('');
    req.end();
}

exports.authType = 'wb';
exports.getAccessToken = getAccessToken;
exports.getInfo = getInfo;
