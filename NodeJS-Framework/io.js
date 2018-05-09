/**
 *
 * socket.io事件监听与处理
 */
var io = require('socket.io')();


/**
 * socket 连接开始
 */
io.on('connection', function (socket) {
    // 发生消息
    socket.emit('open', '连接成功');
    /**
     * 接收到事件处理
     */
    socket.on('exit', function () {
        console.log('退出');
    });

});

module.exports = io;