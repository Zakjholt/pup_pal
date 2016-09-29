var mongoose = require('mongoose');

var trickSchema = mongoose.Schema({
    name: String,
    user: {
        _id: String,
        count: Number
    }
});

module.exports = mongoose.model('Trick', trickSchema);
