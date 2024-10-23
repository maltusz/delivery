const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const schemaUsuario = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    }
});

schemaUsuario.pre('save', async function (next) {
    if (this.isModified('senha') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
    }
    next();
});

schemaUsuario.methods.comparePassword = function (senha) {
    return bcrypt.compare(senha, this.senha);
};

schemaUsuario.plugin(AutoIncrement, { inc_field: 'idUsuario' });
module.exports = mongoose.model('usuario', schemaUsuario);