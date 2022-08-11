const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("usuarios", UsersSchema);