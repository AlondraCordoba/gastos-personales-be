const mongoose = require('mongoose');

const GastosSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    }, 
    money: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("gastos", GastosSchema);