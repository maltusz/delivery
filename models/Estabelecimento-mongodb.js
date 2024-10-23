const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schemaEstabelecimento = new mongoose.Schema({
  isOpen: {
    type: Boolean,
    required: true,
  },
  tempoEspera: {
    type: Number,
    required: true,
  },
});

schemaEstabelecimento.plugin(AutoIncrement, { inc_field: "idEstabelecimento" });
module.exports = mongoose.model("estabelecimento", schemaEstabelecimento);
