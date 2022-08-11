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
    categoryId: {
        type: String
    }
});

module.exports = mongoose.model("gastos", GastosSchema);