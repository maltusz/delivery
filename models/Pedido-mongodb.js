const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schemaPedido = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      required: true,
    },
    cliente: {
      nome: {
        type: String,
        required: true,
      },
      telefone: {
        type: String,
        required: true,
      },
      rua: {
        type: String,
        required: true,
      },
      numero: {
        type: Number,
        required: true,
      },
      complemento: {
        type: String,
      },
      bairro: {
        type: String,
        required: true,
      },
      formadepagamento: {
        forma_pagamento: {
          type: String,
          required: true,
        },
        precisaTroco: {
          type: Boolean,
          required: true,
        },
        trocoPara: {
          type: Number,
          required: true,
        },
      },
    },
    produtos: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
    observacao: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

schemaPedido.plugin(AutoIncrement, { inc_field: "idPedido" });

module.exports = mongoose.model("pedidos", schemaPedido);
