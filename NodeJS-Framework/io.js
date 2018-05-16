/**
 *
 * socket.io事件监听与处理
 */
var io = require('socket.io')();


/**
 * 全局变量，保存用户id对应的连接socket
 * @type {{用户连接socket}}
 */
var users = [];


/**
 * socket 连接开始
 */
io.sockets.on('connection', function (socket) {

//new user login
    socket.on('login', function (nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        }
        else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        }
    });
    //user leaves
    socket.on('disconnect', function () {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });

    //new message get
    socket.on('postMsg', function (msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function (imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
    //new Notification
    socket.on('noti', function (config) {
        socket.broadcast.emit('notification', socket.nickname, config);
    });

    // /**
    //  * 发送消息事件处理
    //  */
    //     //上次发消息时间变量
    // var lastTime = 0;
    //
    // socket.on('send', function (data) {
    //     //创建时间对象
    //     var oDate = new Date();
    //     //判断发言间隔，若小于900毫秒返回提示
    //     if (oDate.getTime() - lastTime < 900) {
    //         socket.emit('send_result', {code: 1, msg: 'send too quick'});
    //     } else {
    //         // 判断用户是否在线，不在线返回系统消息
    //         if (users.indexOf(socket.nickname) <= -1)
    //             socket.emit('send_result', {
    //                 code: 2,
    //                 msg: 'user not online',
    //                 time: oDate.getTime(),
    //                 uid: socket.nickname,
    //                 cid: data.author
    //             });
    //         else {
    //             //向好友发送消息
    //             json_user[data.cid].s.emit('send_msg', {
    //                 msg: data.msg,
    //                 uid: socket.nickname,
    //                 time: oDate.getTime(),
    //                 cid: data.author
    //             });
    //             //通知发送消息成功
    //             socket.emit('send_result', {code: 0, msg: '成功', time: oDate.getTime(), uid: cur_uid, cid: data.cid});
    //             //更新最后发送时间
    //             lastTime = oDate.getTime();
    //         }
    //     }
    // });


});
//
//
//
//
// io.on('connection', function (socket) {
//     // 连接成功返回消息
//     socket.emit('open', '连接成功');
//
//     //当前session
//     var cur_session = '';
//     // 当前用户的 id
//     var cur_uid = '';
//
//     /**
//      * 调用方法获取session中存在的用户的id，同时向该id的所有好友发送上线通知
//      */
//     getSessionAndCookie(socket.handshake, function (err, status) {
//         //如果有错误信息，打印错误信息
//         if (err != null) {
//             console.error(err.message);
//         } else if (status == true) {
//             //无错误情况保存获取到的session
//             cur_session = socket.handshake.session;
//             //session中存在用户对象则保存用户id
//             if (cur_session.user != undefined) {
//                 //保存session中的用户id到cur_uid 变量
//                 cur_uid = cur_session.user.id;
//                 //保存当前用户id 的socket对象
//                 json_user[cur_uid] = {s: socket};
//                 //数据库检索所有好友id并向好友发送上线通知
//                 models.Contact.getCidByUid(cur_uid, models).then(function (cids) {
//                     //遍历所有好友id
//                     for (var i in cids) {
//                         // 若当前id在线则向其发出好友在线消息
//                         if (json_user[cids[i].cid])
//                             json_user[cids[i].cid].s.emit('online', {
//                                 uid: cur_uid
//                             });
//                     }
//                 }).catch(function (error) {
//                     //数据库错误打印
//                     console.log(error);
//                 });
//             }
//         } else {
//             console.log("用户未登录");
//         }
//     })
//
//     /**
//      * 关闭连接后删除保存的socket，并广播下线通知
//      */
//     socket.on('disconnect', function () {
//         //删除保存的socket
//         delete json_user[cur_uid];
//         //遍历广播下线通知
//         for (var i in json_user) {
//             json_user[i].s.emit('offline', {uid: cur_uid});
//         }
//     });
//
//     /**
//      * 自定义退出事件处理
//      */
//     socket.on('exit', function () {
//         console.log(cur_uid + '退出');
//         delete json_user[cur_uid];
//     });
//
//     /**
//      * 发送消息事件处理
//      */
//         //上次发消息时间变量
//     var lastTime = 0;
//
//     socket.on('send', function (data) {
//         //创建时间对象
//         var oDate = new Date();
//         //判断发言间隔，若小于900毫秒返回提示
//         if (oDate.getTime() - lastTime < 900) {
//             socket.emit('send_result', {code: 1, msg: '发言过于频繁，900毫秒之内发言一次'});
//         } else {
//             // 判断用户是否在线，不在线返回系统消息
//             if (!json_user[data.cid])
//                 socket.emit('send_result', {
//                     code: 2,
//                     msg: '发送失败：此用户不在线',
//                     time: oDate.getTime(),
//                     uid: cur_uid,
//                     cid: data.cid
//                 });
//             else {
//                 //向好友发送消息
//                 json_user[data.cid].s.emit('send_msg', {
//                     msg: data.msg,
//                     uid: cur_uid,
//                     time: oDate.getTime(),
//                     cid: data.cid
//                 });
//                 //通知发送消息成功
//                 socket.emit('send_result', {code: 0, msg: '成功', time: oDate.getTime(), uid: cur_uid, cid: data.cid});
//                 //更新最后发送时间
//                 lastTime = oDate.getTime();
//             }
//         }
//     });
//
//
//     /**
//      * 获取当前用户所有分组
//      */
//     socket.on('get_user_group', function (data) {
//         //根据当前用户id查找数据库中所有分组
//         models.Group.getByUid(cur_uid, models).then(function (group) {
//             //初始化分组数组
//             var arr = [];
//             for (var i = 0, len = group.length; i < len; i++) {
//                 //初始化数组放入查找结果
//                 arr[i] = {};
//                 arr[i].gid = group[i].gid;
//                 arr[i].tname = group[i].name;
//             }
//             //返回分组数组
//             socket.emit('get_user_group_result', arr);
//         }).catch(function (error) {
//             console.log(error);
//         });
//     });
//
//     /**
//      * 获取用户好友
//      */
//     socket.on('get_user_list', function (data) {
//         //数据库查询，切换到数据库
//         querySql(db, 'USE ' + settings.database.name, function (result) {
//             //数据库查询语句，根据用户id返回用户好友数据
//             var sql = 'SELECT contact.cid, contact.gid, user.nick, user.sign, user.avatar FROM contact, user WHERE contact.cid=user.id and contact.uid=' + cur_uid + (data ? (data.gid != null ? ' and gid=' + data.gid : '') : '');
//             querySql(db, sql, function (result) {
//                 //初始化结果数组
//                 var arr = [];
//                 for (var i = 0, len = result.length; i < len; i++) {
//                     //放入查询结果
//                     arr[i] = result[i];
//                     //根据是否存在用户链接设置用户在线状态标志
//                     if (json_user[arr[i].cid])
//                         arr[i].online = true;
//                     else
//                         arr[i].online = false;
//                 }
//                 //返回获取结果数组
//                 socket.emit('get_user_list_result', arr);
//             });
//         });
//     });
//
//
//     /**
//      * 获取用户信息
//      */
//     socket.on('get_user_info', function (data) {
//         //数据库查询，切换到数据库
//         querySql(db, 'USE ' + settings.database.name, function (result) {
//             //查询语句，如果传入查询data则查询data中的id的用户信息，否则查询当前用户信息
//             querySql(db, 'SELECT * FROM user WHERE id=' + (data ? data.cid : cur_uid), function (result) {
//                 //放入查询结果，删除id密码字段
//                 var json = {};
//                 json = result[0];
//                 json.uid = result[0].id;
//                 delete json.id;
//                 delete json.pass;
//                 //返回获取到的用户信息
//                 socket.emit('get_user_info_result', json);
//             });
//         });
//     });
//
//     /**
//      * 设置个性签名
//      */
//     socket.on('update_sign', function (data) {
//         //数据库查询，切换到数据库
//         querySql(db, 'USE ' + settings.database.name, function (result) {
//             //修改数据库中当前用户的个性签名
//             querySql(db, 'UPDATE user SET sign="' + data.sign + '" WHERE id=' + cur_uid, function (result) {
//                 // 返回修改个性签名成功状态码
//                 socket.emit('update_sign_result', {code: 0});
//             }, function (result) {
//                 // 出错返回修改个性签名失败状态码
//                 socket.emit('update_sign_result', {code: 1});
//             });
//         });
//     });
//
//     /**
//      * 修改昵称
//      */
//     socket.on('update_nick', function (data) {
//         //数据库查询，切换到数据库
//         querySql(db, 'USE ' + settings.database.name, function (result) {
//             //修改数据库中当前用户的个性签名
//             querySql(db, 'UPDATE user SET nick="' + data.nick + '" WHERE id=' + cur_uid, function (result) {
//                 // 返回修改昵称成功状态码
//                 socket.emit('update_nick_result', {code: 0});
//             }, function (result) {
//                 // 返回修改昵称成功状态码
//                 socket.emit('update_nick_result', {code: 1});
//             });
//         });
//     });
//
//     /**
//      * 在线查找好友
//      */
//     socket.on('query_buddy', function (data) {
//         //数据库查询，切换到数据库
//         querySql(db, 'USE ' + settings.database.name, function (result) {
//             //初始化参数
//             var sql = '';
//             var arr = [];
//             //若存在id添加id字段（QQ号）
//             if (data.id) {
//                 arr.push('id=' + data.id);
//             }
//             //若存在email添加email字段
//             if (data.email) {
//                 arr.push('email=\'' + data.email + '\'');
//             }
//             //若存在昵称添加昵称字段
//             if (data.nick) {
//                 arr.push('nick LIKE \'%' + data.nick + '%\'');
//             }
//             //排除本身id字段
//             if (cur_uid) {
//                 arr.push('id!=' + cur_uid);
//             }
//             //若arr有参数，添加对应查询
//             if (arr.length) {
//                 sql = 'SELECT id, nick, email, avatar, login_count FROM user WHERE ' + arr.join(' AND ');
//             } else {
//                 //否则查询所有用户
//                 sql = 'SELECT id, nick, email, avatar, login_count FROM user';
//             }
//             //若存在降序参数，添加逆序查询字段
//             if (data.desc) {
//                 sql += ' ORDER BY ' + data.desc + ' DESC';
//             }
//             //若存在升序参数，添加升序查询字段
//             if (data.asc) {
//                 sql += ' ORDER BY ' + data.asc + ' ASC';
//             }
//             //若存在分页参数，添加分页查询字段
//             if (data.rows) {
//                 sql += ' LIMIT ' + data.rows;
//             }
//             //控制台输出查询语句
//             console.log(sql);
//             //开始数据库查询
//             querySql(db, sql, function (result) {
//                 //添加查询结果到数组
//                 var arrUser = [];
//                 for (var i = 0, len = result.length; i < len; i++) {
//                     arrUser[i] = result[i];
//                     //若存在相应用户连接添加在线标志
//                     if (json_user[arrUser[i].id])
//                         arrUser[i].online = true;
//                     else arrUser[i].online = false;
//                 }
//                 if (arrUser.length)
//                     // 查询结果不为空返回用户数组
//                     socket.emit('query_buddy_result', {err: 0, data: arrUser});
//                 else
//                     //为空返回错误无数据标志
//                     socket.emit('query_buddy_result', {err: 1, msg: '无数据'});
//             });
//         });
//     });
//
//     /**
//      * 加好友判断
//      */
//     socket.on('add_buddy', function (data) {
//         //数据库查询，切换到数据库
//         querySql(db, 'USE ' + settings.database.name, function (result) {
//             //查找数据库联系人表看是否为好友
//             querySql(db, 'SELECT * FROM contact WHERE uid=' + cur_uid + ' AND cid=' + data.uid, function (result) {
//                 //若不是好友
//                 if (!result.length) {
//                     //若有对应用户连接，即用户在线
//                     if (json_user[data.uid]) {
//                         //生成添加好友请求信息
//                         var result = {};
//                         result.cid = cur_uid;
//                         if (data.msg) result.msg = data.msg;
//                         //先用户发送请求好友请求信息
//                         json_user[data.uid].s.emit('apply_buddy', result);
//                     } else {
//                         //若用户不在线返回消息失败信息
//                         socket.emit('add_buddy_result', {err: 1, msg: '此用户不在线，不能添加好友'});
//                     }
//                 } else {
//                     //若已经为好友返回不能重复添加好友信息
//                     socket.emit('add_buddy_result', {err: 2, msg: '不能重复添加好友'});
//                 }
//             });
//         });
//
//     });
//
//     /**
//      * 添加好友处理
//      * act 1 表示同意，2表示拒绝
//      */
//     socket.on('adder_audit', function (data) {
//         //若用户点击了同意
//         if (data.act == 1) {
//             //插入一方好友信息
//             data.cid = cur_uid;
//             models.Contact.create(data).then(function (contact) {
//                 //交换插入另一方好友信息
//                 data.cid = data.uid;
//                 data.uid = cur_uid;
//                 models.Contact.create(data).catch(function (error) {
//                     console.log(error);
//                 });
//             }).catch(function (error) {
//                 console.log(error);
//             });
//
//             var user_c = {};
//             var user_u = {};
//             //数据库查询用户信息，分别发送添加对方请求
//             querySql(db, 'USE ' + settings.database.name, function (result) {
//                 //查找添加的好友信息
//                 querySql(db, 'SELECT * FROM user WHERE id=' + cur_uid, function (result) {
//                     var json = {};
//                     json = result[0];
//                     json.uid = result[0].id;
//                     json.gid = 0;
//                     //若存在当前用户连接，添加用户在线标志
//                     if (json_user[json.uid])
//                         json.online = true;
//                     else
//                         json.online = false;
//                     //若存在分组标志，添加分组字段
//                     if (data.gid)
//                         json.gid = data.gid;
//                     //删除无用字段
//                     delete json.id;
//                     delete json.pass;
//                     //保存好友信息
//                     user_c = json;
//                     // 查找用户信息
//                     querySql(db, 'SELECT * FROM user WHERE id=' + data.uid, function (result) {
//                         //保存搜索结果
//                         var json = {};
//                         json = result[0];
//                         json.uid = result[0].id;
//                         json.gid = 0;
//                         if (json_user[json.uid]) json.online = true;
//                         else json.online = false;
//                         //若存在分组标志，添加分组字段
//                         if (data.gid)
//                             json.gid = data.gid;
//                         //删除无用字段
//                         delete json.id;
//                         delete json.pass;
//                         //保存用户信息
//                         user_u = json;
//                         //向双方发送添加结果
//                         socket.emit('adder_audit_result', {err: 0, user: user_u});
//                         json_user[data.uid].s.emit('adder_audit_result', {err: 0, user: user_c});
//                     });
//                 });
//             });
//         } else if (data.act == 2) {
//             // 若操作为拒绝，返回拒绝信息
//             json_user[data.uid].s.emit('adder_audit_result', {err: 1, uid: cur_uid});
//         }
//     });
//
//     /**
//      * 检查邮箱是否存在
//      */
//     socket.on('check_email', function (data) {
//         // 从数据库用户表检索该邮箱对应的用户
//         models.User.getByEmail(data.email, models).then(function (user) {
//             // 若返回结果不为空，发送已经被注册通知
//             if (user != null)
//                 socket.emit('check_email_result', {code: 1});
//             else
//                 //未被注册返回可以注册通知
//                 socket.emit('check_email_result', {code: 0});
//         }).catch(function (error) {
//             console.log(error);
//         });
//     });
//
//     /**
//      * 用户注册
//      */
//     socket.on('user_reg', function (data) {
//         //保存传入的密码
//         var password = data.password;
//         //若密码不为空，加密密码
//         if (password) {
//             //生成随机八位盐数据
//             var salt = crypto.randomBytes(8);
//             //根据随机盐值生成对应的md5hash
//             var recievedHash = crypto.createHash('md5')
//                 .update(password)
//                 .update(salt)
//                 .digest('hex');
//             //在hash密码后添加加密的盐
//             var hashedPassword = recievedHash + ',' + salt.toString('hex');
//             //更新为加密后的密码
//             data.password = hashedPassword;
//         }
//         //根据data数据包创建新用户
//         models.User.create(data).then(function (user) {
//             //令用户的qq号等于用户id
//             var uid = user.id;
//             user.username = uid;
//             user.update({username: uid}).catch(function (error) {
//                 console.log(error);
//             });
//             //创建用户的对应的分组
//             user.createGroup({'uid': uid});
//             //返回注册成功结果
//             socket.emit('user_reg_result', {code: 0, uid: uid});
//         }).catch(function (error) {
//             //若存在错误返回注册失败结果
//             socket.emit('user_reg_result', {code: 1, error: error});
//         });
//     });
// });
//
//
//
//
//
// /**
//  * 获取seesion和cookie，若获取到添加session到数据包
//  * @param handshakeData
//  * @param callback
//  * @returns
//  */
// function getSessionAndCookie(handshakeData, callback) {
//     // 通过客户端的cookie字符串来获取其session数据
//     var Cookies = {};
//     handshakeData.headers.cookie && handshakeData.headers.cookie.split(';').forEach(function (Cookie) {
//         var parts = Cookie.split('=');
//         Cookies[parts[0].trim()] = decodeURIComponent((parts[1] || '' ).trim());
//     });
//
//     handshakeData.cookie = Cookies;
//
//     var connect_sid = handshakeData.cookie['appSession'].split('.')[0].split(':')[1];
//     if (connect_sid) {
//         global.storeMemory.get(connect_sid, function (error, session) {
//             if (error) {
//                 callback(error, false);
//             }
//             else {
//                 // save the session data and accept the connection
//                 handshakeData.session = session || {};
//                 callback(null, true);
//             }
//         });
//     }
//     else {
//         callback({message: 'nosession'});
//     }
// }
//
// /**
//  * sql执行方法
//  * @param 数据库连接
//  * @param 查询语句
//  * @param 成功回调
//  * @param 错误回调
//  */
// function querySql(objConnect, strSql, fnSucc, fnError) {
//     objConnect.query(strSql, function (err, data) {
//         if (err) {
//             if (fnError) fnError(err);
//         } else {
//             if (fnSucc) fnSucc(data);
//         }
//     });
// }

module.exports = io;