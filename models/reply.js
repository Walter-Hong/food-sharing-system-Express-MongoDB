var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ReplySchema = new Schema({
    content: {type: String},
    reply_id: {type: ObjectId},
    topic_id: {type: ObjectId},
    create_date: {type: Date, default: Date.now},
    like_count: {type: Number, default: 0},
    liker_id: [Schema.Types.ObjectId]
});

ReplySchema.statics.legal = function (replyData) {
    if (replyData.content === undefined || replyData.content.length < 1 || replyData.content.length > 150) {
        return {states: -2, hint: 'error on the number of data'};
    }
    if (replyData.reply_id === undefined) {
        return {states: -2, hint: 'id of the user is NULL'};
    }
    if (replyData.topic_id === undefined) {
        return {states: -2, hint: 'id of the posting is NULL'};
    }
    return {states: 1, hint: 'the data is legal'};
};

ReplySchema.index({topic_id: 1});
ReplySchema.index({reply_id: 1});
ReplySchema.index({create_date: -1});

module.exports = ReplySchema;