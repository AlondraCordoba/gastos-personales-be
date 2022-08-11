const mongoose = require('mongoose');

const GastosSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("categorias", GastosSchema);