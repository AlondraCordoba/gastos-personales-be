const mongoose = require('mongoose');

const CategoriasSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    monto: {
        type: String,
        require: true
    },
    idUser: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("categorias", CategoriasSchema);