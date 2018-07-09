//  all the posting that need to be authorized are stored here
// When the posting is authorized by more than a specific number of people,it will be transported to topic_passed database.


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TopicSchema = new Schema({
    title: {type: String},
    category:{type: String},
    content: {type: String},
    location: {type: String},
    lat: {type: Number, default: 0},
    lng: {type: Number, default: 0},
    author_id: {type: Schema.ObjectId},
    create_date: {type: Date, default: Date.now},

    passed_count: {type: Number, default: 0},   // /the number of people voted pass
    notpassed_count: {type: Number, default: 0} // /the number of people non voted pass
});

// check the legality of the food posting
TopicSchema.statics.legal = function (topic) {
    if (!topic.title)
        return {states: -1, hint: 'need description!'};

    if(!topic.category)
        return {states: -1, hint: 'need category'};

    if (topic.title.length < 2)
        return {states: -2, hint: 'description is too short!!'};


    if (!topic.content)
        return {states: -4, hint: 'need image!'};

    return {states: 1, hint: 'ok'};
};

TopicSchema.index({author_id: 1});
TopicSchema.index({create_date: -1});

module.exports = TopicSchema;