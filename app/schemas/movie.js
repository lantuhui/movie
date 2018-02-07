const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MovieSchema = new Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    year: Number,
    summary: String,
    poster: String,
    flash: String,
    // pv: {
    //     type: Number,
    //     default: 0
    // },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        update: {
            type: Date,
            default: Date.now()
        }
    }
});

MovieSchema.pre('save', function(next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now();
    }

    next();
});

MovieSchema.statics = {
    fetch: function() {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec()
    },
    findById: function(id) {
        return this
            .findOne({_id: id})
            .exec()
    }
};

module.exports = MovieSchema;


