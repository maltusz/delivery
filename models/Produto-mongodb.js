const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const schemaProduto = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
    },
    nome: {
        type: String,
        required: true,
    },
    preco: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    imagem: {
        type: String,
        required: true,
    },
    imagemMimeType: {
        type: String,
        required: true,
    }
})

schemaProduto.plugin(AutoIncrement, { inc_field: 'idProd' });
module.exports = mongoose.model('produto', schemaProduto)