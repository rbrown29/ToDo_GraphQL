const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
        type: String
    },
    completed: {
        type: Boolean
    }
});

module.exports = mongoose.model('Todo', TodoSchema);