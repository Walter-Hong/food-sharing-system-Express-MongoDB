
/**
 *
 * socket.io
 */
var io = require('socket.io')();


/**
 * socket
 * @type {{user connect socket}}
 */
var users = [];


/**
 * socket begin
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

   


});
//
//
//
//
// io.on('connection', function (socket) {
//     
//     socket.emit('open', 'connect success');
//
//     
//     var cur_session = '';
//     
//     var cur_uid = '';
//
//     /**
//      * session id
//      */
//     getSessionAndCookie(socket.handshake, function (err, status) {
//         //print err
//         if (err != null) {
//             console.error(err.message);
//         } else if (status == true) {
//             
//             cur_session = socket.handshake.session;
//             
//             if (cur_session.user != undefined) {
//                 
//                 cur_uid = cur_session.user.id;
//                
//                 json_user[cur_uid] = {s: socket};
//                 
//                 models.Contact.getCidByUid(cur_uid, models).then(function (cids) {
//                    
//                     for (var i in cids) {
//                         
//                         if (json_user[cids[i].cid])
//                             json_user[cids[i].cid].s.emit('online', {
//                                 uid: cur_uid
//                             });
//                     }
//                 }).catch(function (error) {
//                     
//                     console.log(error);
//                 });
//             }
//         } else {
//             console.log("no log");
//         }
//     })
//
//     /**
//      * close socket，
//      */
//     socket.on('disconnect', function () {
//         //socket
//         delete json_user[cur_uid];
//         //
//         for (var i in json_user) {
//             json_user[i].s.emit('offline', {uid: cur_uid});
//         }
//     });
//
//     
//     socket.on('exit', function () {
//         console.log(cur_uid + '退出');
//         delete json_user[cur_uid];
//     });
//
//     
//         //last time
//     var lastTime = 0;
//
//     socket.on('send', function (data) {
//         
//         var oDate = new Date();
//         
//         if (oDate.getTime() - lastTime < 900) {
//             socket.emit('send_result', {code: 1, msg: '<900ms'});
//         } else {
//             // online or not 
//             if (!json_user[data.cid])
//                 socket.emit('send_result', {
//                     code: 2,
//                     msg: 'sorry he offline',
//                     time: oDate.getTime(),
//                     uid: cur_uid,
//                     cid: data.cid
//                 });
//             else {
//                 
//                 json_user[data.cid].s.emit('send_msg', {
//                     msg: data.msg,
//                     uid: cur_uid,
//                     time: oDate.getTime(),
//                     cid: data.cid
//                 });
//                 
//                 socket.emit('send_result', {code: 0, msg: '成功', time: oDate.getTime(), uid: cur_uid, cid: data.cid});
//                 
//                 lastTime = oDate.getTime();
//             }
//         }
//     });
//
//
//     /**
//      * group chat
//      */
//     socket.on('get_user_group', function (data) {
//         
//         models.Group.getByUid(cur_uid, models).then(function (group) {
//             
//             var arr = [];
//             for (var i = 0, len = group.length; i < len; i++) {
//                 
//                 arr[i] = {};
//                 arr[i].gid = group[i].gid;
//                 arr[i].tname = group[i].name;
//             }
//             
//             socket.emit('get_user_group_result', arr);
//         }).catch(function (error) {
//             console.log(error);
//         });
//     });
//
//     
//     socket.on('get_user_list', function (data) {
//         //check database
//         querySql(db, 'USE ' + settings.database.name, function (result) {
//             
//             var sql = 'SELECT contact.cid, contact.gid, user.nick, user.sign, user.avatar FROM contact, user WHERE contact.cid=user.id and contact.uid=' + cur_uid + (data ? (data.gid != null ? ' and gid=' + data.gid : '') : '');
//             querySql(db, sql, function (result) {
//               
//                 var arr = [];
//                 for (var i = 0, len = result.length; i < len; i++) {
//                     
//                     arr[i] = result[i];
//                    
//                     if (json_user[arr[i].cid])
//                         arr[i].online = true;
//                     else
//                         arr[i].online = false;
//                 }
//                 
//                 socket.emit('get_user_list_result', arr);
//             });
//         });
//     });
//
//
//    
// 
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