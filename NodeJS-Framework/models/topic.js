// 待审核的帖子都存在这里
// 当帖子的同意通过人数到了指定数量时就会把数据转移到 topic_passed 数据库里

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TopicSchema = new Schema({
    title: {type: String},
    content: {type: String},
    location: {type: String},
    lat: {type: Number, default: 0},
    lng: {type: Number, default: 0},
    author_id: {type: Schema.ObjectId},
    create_date: {type: Date, default: Date.now},

    passed_count: {type: Number, default: 0},   // 同意通过的数量
    notpassed_count: {type: Number, default: 0} // 不同意通过的数量
});

// 验证帖子合法性
TopicSchema.statics.legal = function (topic) {
    if (!topic.title)
        return {states: -1, hint: 'need description!'};

    if (topic.title.length < 2)
        return {states: -2, hint: 'description is too short!!'};


    if (!topic.content)
        return {states: -4, hint: 'need image!'};

    return {states: 1, hint: 'ok'};
};

TopicSchema.index({author_id: 1});
TopicSchema.index({create_date: -1});

module.exports = TopicSchema;