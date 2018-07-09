/*
 * turn a json  into a redirection address
 * json = {
 * 	states: *,
 * 	hint: *,
 *   data: *
 * }
 * */
exports.parseRedirect = function (json, res) {
    res.redirect('/uploadredirect/' + json.states + '/' + json.hint + '/' + json.data);
};


//  time formatting
exports.time = function () {
    var date = new Date();
    return '' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds() + '_' + date.getMilliseconds() + '_' + Math.random();
};

// get the date earlier than a specific number of days
exports.toTime = function (to) {
    var now = new Date();
    var tomo = new Date(now - 1000 * 60 * 60 * 24 * to);
    return '' + tomo.getFullYear() + '-' + (tomo.getMonth() + 1) + '-' + tomo.getDate() + ' 00:00:00';
};

// filter script label
exports.filterTag = function (text) {
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//, '&frasl;');
    return text;
};

exports.checkChar = function (str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    if (pattern.test(str)) {
        return -1;
    } else {
        return 1;
    }
};