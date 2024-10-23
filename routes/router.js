const express = require("express");
const router = express.Router();
const controle = require("../controllers/controller.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { ensureAuthenticated } = require("../auth/auth.js");

// Rotas do delivery cliente

router.get("/", controle.delivery_cliente);

router.get("/delivery/produtos", controle.delivery_produtos);

router.post("/delivery/criarPedido", controle.delivery_criar_pedido);

// Rota para mudar e verificar o status do estabelecimento

router.post("/delivery/status", controle.delivery_change_status);

router.get("/delivery/status", controle.delivery_verif_status);

// Rotas do delivery loja

router.get("/delivery/loja", ensureAuthenticated, controle.delivery_loja);

router.get("/delivery/loja", ensureAuthenticated, controle.delivery_loja);

router.get("/delivery/carregar-pedidos", ensureAuthenticated, controle.carregar_pedidos);

router.get("/delivery/pedidos", ensureAuthenticated, controle.delivery_pedidos);

router.post("/delivery/loja/alterar-tempo", ensureAuthenticated, controle.delivery_tempo_de_espera);

router.post("/delivery/loja/mudar-status", ensureAuthenticated, controle.delivery_mudar_status);

// router.get("/delivery/loja/pedidos-pendentes", ensureAuthenticated, controle.delivery_pedidos_pendentes)

// router.get("/delivery/loja/pedidos-concluidos", ensureAuthenticated, controle.delivery_pedidos_concluidos)

router.get("/delivery/loja/add-produtos", ensureAuthenticated, controle.delivery_addProdutos_get);

router.post("/delivery/loja/add-produtos", ensureAuthenticated, upload.single("imagem"), controle.delivery_addProdutos_post);

router.post("/delivery/loja/excluir-produto", controle.delivery_excluir_produto);

// Rotas de login - logout

router.get("/login", controle.delivery_login);

router.post("/login", controle.delivery_verif_login);

router.get("/logout", controle.delivery_logout);

// Rota para criar usuário

router.post("/criarUsuario", controle.criarUsuario);

router.post("/criarEstab", controle.criarEstab);

module.exports = router;
