/**
 * @author zhisheng create on 2016/6/30 0030.
 */


var config = {};
//连接地址
config.host = window.location.host;


//页面加载完成后socket连接到服务器
window.onload = function () {
    var _sock = io.connect('ws://' + config.host + '/');
    var sock = null;

    _sock.on('open', function (data) {
        sock = _sock;

        if (!sock) {
            alert('没有连接到服务器');
            return;
        }

        var reg = new ModelReg(sock);
        reg.init();
    });
};

//绑定界面元素
function ModelReg(sock) {
    this.nick = document.querySelectorAll('.user_nick')[0];
    this.pass = document.querySelectorAll('.user_pass')[0];
    this.repass = document.querySelectorAll('.user_repass')[0];
    this.email = document.querySelectorAll('.user_email')[0];
    this.btnSubmit = document.querySelectorAll('#submit_input')[0];
    this.sock = sock;
}

//界面原型方法
ModelReg.prototype = {
    //原型初始化
    init: function () {
        this.addEvent();
    },
    //绑定事件方法
    addEvent: function () {
        var _this = this;

        // 昵称失去焦点
        this.nick.onblur = function () {
            _this.checkNick(this);
        };
        //昵称获得焦点
        this.nick.onfocus = function () {
            _this.iptFocus(this, 'tips', '请输入昵称');
        };

        // 密码
        this.pass.onblur = function () {
            _this.checkPass(this);
        };

        this.pass.onfocus = function () {
            _this.iptFocus(this, 'tips', '不含空格的6-16位字符或不小于9位纯数字');
        };

        // 重复密码
        this.repass.onblur = function () {
            _this.checkRePass(this);
        };

        this.repass.onfocus = function () {
            _this.iptFocus(this, 'tips', '请重新输入密码');
        };

        // 邮箱
        this.email.onblur = function () {
            _this.checkEmail(this);
        }

        this.email.onfocus = function () {
            _this.iptFocus(this, 'tips', '请输入邮箱');
        };

        // 注册按钮
        this.btnSubmit.onclick = function () {
            _this.regSubmit(this);
        };
    },
    //input获得焦点方法
    iptFocus: function (obj, type, msg) {
        obj.parentNode.className = 'bg_txt bg_focus';
        if (type) this.showtip(obj, type);
        if (msg) this.showtip(obj, type, msg);
    },
    //检查昵称
    checkNick: function (obj) {
        if (!obj.value.length) this.showtip(obj, 'fail', '昵称不可以为空');
        else {
            this.showtip(obj, 'succ');
            return true;
        }
    },
    //检查密码
    checkPass: function (obj) {
        var re1 = /\s/;
        var re2 = /^\d{0,8}$/;
        var re3 = /(^[\w]{0,5}$)|(^[\w]{17,}$)/;
        var re4 = /[\u4E00-\u9FA5]+/;
        var result = 0;
        var str = obj.value;

        if (str) {
            if (re1.test(str)) result = 1;  // 包含空格
            if (re2.test(str)) result = 2;  // 9位以下的纯数字
            if (re3.test(str)) result = 3;  // 长度不在6-16个字符内
            if (re4.test(str)) result = 4;  // 长度不在6-16个字符内
        }

        if (obj.value.length) {
            if (result == '0') {
                this.showtip(obj, 'succ');
                return true;
            }
            if (result == '1') this.showtip(obj, 'fail', '不能包含空格');
            if (result == '2') this.showtip(obj, 'fail', '不能是9位以下纯数字');
            if (result == '3') this.showtip(obj, 'fail', '长度为6-16个字符');
            if (result == '4') this.showtip(obj, 'fail', '密码不允许使用中文');
        } else {
            this.showtip(obj, 'fail', '密码不能为空');
        }
    },
    //检查密码是否一致
    checkRePass: function (obj) {
        if (obj.value.length) {
            if (obj.value == this.pass.value) {
                this.showtip(obj, 'succ');
                return true;
            }
            else this.showtip(obj, 'fail', '两次密码输入不一致');
        } else {
            this.showtip(obj, 'fail', '重复密码不能为空');
        }
    },
    // 检查邮箱
    checkEmail: function (obj, callback) {
        var _this = this;
        if (obj.value.length) {
            var re = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (re.test(obj.value)) {
                _this.sock.removeAllListeners('check_email_result');
                _this.sock.on('check_email_result', function (data) {
                    if (callback) callback(data);

                    if (data.code) {
                        _this.showtip(obj, 'fail', '此邮箱已注册');
                    } else {
                        _this.showtip(obj, 'succ', '可以注册');
                        return true;
                    }
                });
                _this.sock.emit('check_email', {email: _this.email.value});
            } else {
                this.showtip(obj, 'fail', '请输入正确的邮箱格式');
            }
        } else {
            this.showtip(obj, 'fail', '邮箱不能为空');
        }
    },
    // 提交注册
    regSubmit: function (obj) {
        var _this = this;
        //放置对象到当前域
        var passNick = this.checkNick(this.nick);
        var passPass = this.checkPass(this.pass);
        var passRePass = this.checkRePass(this.repass);
        //检查邮箱允许注册
        this.checkEmail(this.email, function (data) {
            if (data.code == 0 && passNick && passPass && passRePass) {
                _this.sock.removeAllListeners('user_reg_result');
                //监听返回结果，如果成功隐藏表单显示xx
                _this.sock.on('user_reg_result', function (data) {
                    var regForm = document.querySelectorAll('.reg_form')[0];
                    regForm.style.display = 'none';

                    var regMain = document.querySelectorAll('.reg_main')[0];
                    var regUid = regMain.querySelectorAll('.rember_uin .red_text')[0];

                    regUid.innerHTML = data.uid;
                    regMain.style.display = 'block';
                });
                //发送注册请求
                _this.sock.emit('user_reg', {nick: _this.nick.value, password: _this.pass.value, email: _this.email.value});
            }
        });
    },
    //显示提示
    showtip: function (obj, type, msg) {
        var parent = parents(obj, 'box');
        var ipt = parent.querySelectorAll('.new_txt')[0];
        var iptbg = ipt.parentNode;
        var info = parent.querySelectorAll('.info')[0];
        var tips = info.querySelectorAll('.tips')[0];
        var tip = tips.children[0];

        switch (type) {
            case 'succ':
                tip.className = 'ok';
                iptbg.className = 'bg_txt';
                break;
            case 'fail':
                tip.className = 'error';
                iptbg.className = 'bg_error';
                break;
            case 'tips':
                tip.className = 'tip';
            default:
                break;
        }

        if (msg) tip.innerHTML = msg;
        else tip.innerHTML = '&nbsp;';
    },

};

//获取父节点
function parents(obj, klass) {
    var re = new RegExp('\\b' + klass + '\\b', 'ig');
    while (obj) {
        if (re.test(obj.className)) return obj;
        obj = obj.parentNode;
    }
}

//添加class
function addClass(obj, klass) {
    var re = new RegExp('\\b' + klass + '\\b', 'ig');
    if (!re.test(obj.className)) obj.className += (' ' + klass);
}


//删除class
function removeClass(obj, klass) {
    var re = new RegExp('\\b' + klass + '\\b', 'ig');
    if (re.test(obj.className)) obj.className = obj.className.replace(re, '');
    obj.className = trim(obj.className);
}

//剔除结果89
function trim(str) {
    var result = str;
    result = str.replace(/(\s+)/ig, ' ');
    result = result.replace(/^\s+/ig, '');
    result = result.replace(/\s+$/ig, '');
    return result;
}
