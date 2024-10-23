const modeloPedido = require("../models/Pedido-mongodb.js");
const modeloProduto = require("../models/Produto-mongodb.js");
const modeloUsuario = require("../models/Usuario-mongodb.js");
const modeloEstabelecimento = require("../models/Estabelecimento-mongodb.js");
const path = require("path");
const passport = require("passport");

// Controle do delivery cliente

const delivery_cliente = async (req, res) => {
  try {
    let estabelecimento = await modeloEstabelecimento.findOne({ idEstabelecimento: 1 });
    let status = estabelecimento.isOpen;
    let tempoEspera = estabelecimento.tempoEspera;
    const produtos = await modeloProduto.find();
    res.render("index", { produtos, status, tempoEspera });
  } catch (error) {
    res.send("Houve um erro");
    console.log(error);
  }
};

const delivery_produtos = async (req, res) => {
  try {
    const produtos = await modeloProduto.find();
    res.json(produtos);
  } catch (error) {
    res.send("Houve um erro", error);
  }
};

const delivery_criar_pedido = async (req, res) => {
  let client = req.app.get("whatsappClient"); //
  let numeroWhatsApp = `55${req.body.cliente.telefone}@c.us`;
  try {
    const status = req.body.status;
    const cliente = req.body.cliente;
    const produtos = req.body.produtos;
    const observacao = req.body.observacao;

    const novoPedido = new modeloPedido({
      status,
      cliente,
      produtos,
      observacao,
    });

    await novoPedido.save();
    // await client.sendMessage(numeroWhatsApp, `Oba ${req.body.cliente.nome}! Seu pedido foi confirmado e está sendo preparado! Logo logo sairá para entrega!`);

    res.status(201).json({ message: "Pedido adicionado com sucesso!" });
  } catch (error) {
    res.status(500).send("Houve um erro ao criar o pedido.");
    console.error("Erro ao criar pedido:", error);
  }
};

// Controle para verificar status

const delivery_change_status = async (req, res) => {
  let id = req.body.id;
  try {
    const estabelecimento = await modeloEstabelecimento.findOne({ idEstabelecimento: id });
    if (estabelecimento.isOpen == true) {
      await modeloEstabelecimento.updateOne({ idEstabelecimento: id }, { isOpen: false });
      res.status(200).json({ message: "Estabelecimento fechado com sucesso." });
    } else {
      await modeloEstabelecimento.updateOne({ idEstabelecimento: id }, { isOpen: true });
      res.status(200).json({ message: "Estabelecimento aberto com sucesso." });
    }
  } catch (err) {
    res.status(500).json("Erro ao mudar status do estabelecimento: ", err);
  }
};

const delivery_verif_status = async (req, res) => {
  try {
    let estabelecimento = await modeloEstabelecimento.findOne({ idEstabelecimento: 1 });
    let status = estabelecimento.isOpen;
    res.render("index", { status });
  } catch (err) {
    res.status(500).send("Erro ao procurar o status do estabelecimento: ", err);
  }
};

// Controle do delivery loja

const delivery_loja = async (req, res) => {
  try {
    let estabelecimento = await modeloEstabelecimento.findOne({ idEstabelecimento: 1 });
    let status = estabelecimento.isOpen;
    let tempo = estabelecimento.tempoEspera;
    res.render("loja", { status, tempo });
  } catch {
    res.render("Houver um erro", error);
  }
};

const delivery_pedidos = async (req, res) => {
  const stt = req.query.status;
  try {
    const pedidos = await modeloPedido.find({ status: stt });
    if (stt === "false") {
      res.render("pedidos-pendentes", { pedidos });
    } else {
      res.render("pedidos-concluidos", { pedidos });
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar os pedidos." });
  }
};

const carregar_pedidos = async (req, res) => {
  const stt = req.query.status;
  try {
    const pedidos = await modeloPedido.find({ status: stt });
    if (stt === "false") {
      res.json(pedidos);
    } else {
      res.json(pedidos);
    }
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar os pedidos." });
  }
};

// const delivery_config = async (req, res) => {
//   try {
//     res.render(path.join(__dirname, "Delivery/cliente/config"));
//   } catch {
//     res.render("Houver um erro", error);
//   }
// };

const delivery_addProdutos_get = async (req, res) => {
  try {
    const produtos = await modeloProduto.find();
    res.render("add-produtos", { produtos });
  } catch {
    res.render("Houver um erro", error);
  }
};

const delivery_addProdutos_post = async (req, res) => {
  const produtos = await modeloProduto.find();
  const { tipo, nome, preco, descricao, idProd } = req.body;
  const imagem = req.file ? req.file.buffer.toString("base64") : null;
  const imagemMimeType = req.file ? req.file.mimetype : null;

  try {
    const produtoExistente = await modeloProduto.findOne({ idProd: idProd });

    if (produtoExistente) {
      console.log("achei o produto");
      await modeloProduto.updateOne({ idProd }, { $set: { tipo, nome, preco, desc: descricao, imagem, imagemMimeType } });
    } else {
      console.log("não achei o produto");
      const novoProduto = new modeloProduto({
        tipo,
        nome,
        preco,
        desc: descricao,
        imagem,
        imagemMimeType,
      });

      await novoProduto.save();
    }

    res.render("add-produtos", { produtos });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const delivery_excluir_produto = async (req, res, next) => {
  const { username, password, id } = req.body;

  passport.authenticate("local", async (err, authenticatedUser, info) => {
    if (err) {
      return next(err);
    }
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Autenticação falhou", info: info.message });
    }

    try {
      const result = await modeloProduto.deleteOne({ idProd: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.status(200).json({ message: "Produto excluído com sucesso!" });
    } catch (error) {
      res.status(400).json({ message: "Erro ao excluir o produto", error });
    }
  })(req, res, next);
};

const delivery_tempo_de_espera = async (req, res) => {
  const tempo = req.body.tempoEspera;
  try {
    const resultado = await modeloEstabelecimento.updateOne({ idEstabelecimento: 1 }, { $set: { tempoEspera: tempo } });
    if (resultado.modifiedCount > 0) {
      return res.json({ sucesso: true, mensagem: "Tempo de espera alterado com sucesso." });
    } else {
      return res.json({ sucesso: false, mensagem: "Nenhuma alteração realizada." });
    }
  } catch (err) {
    return res.json({ sucesso: false, mensagem: "Erro ao tentar alterar o tempo de espera." });
  }
};

const delivery_mudar_status = async (req, res) => {
  let id = req.body.idPedido;
  let num = await modeloPedido.findOne({ idPedido: id });
  // let client = req.app.get("whatsappClient");
  // let numeroWhatsApp = `55${num.cliente.telefone}@c.us`;
  try {
    await modeloPedido.updateOne({ idPedido: id }, { status: true });
    // await client.sendMessage(numeroWhatsApp, "Seu pedido saiu para entrega!");
    // console.log("Mensagem enviada com sucesso!");
    res.json({ message: "Status do pedido alterado com sucesso!" });
  } catch (err) {
    res.json({ message: "Houve um erro: ", error: err });
  }
};

// Controle de autenticação

const delivery_login = (req, res) => {
  res.render("login");
};

const delivery_verif_login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log("Autenticação falhou: ", info.message);
      return res.json({ status: false, message: "Usário ou senha inválidos!" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log("Autenticação bem-sucedida");
      return res.json({ status: true });
    });
  })(req, res, next);
};

const delivery_logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};

// Controle para criação de usuário e estabelecimento

const criarUsuario = async (req, res) => {
  const { username, password } = req.body;
  try {
    const usuarioExiste = await modeloUsuario.findOne({ usuario: username });
    if (usuarioExiste) {
      return res.status(400).json({ message: "Usuário já existe." });
    }

    const novoUsuario = new modeloUsuario({ usuario: username, senha: password });
    await novoUsuario.save();

    res.status(201).json({ message: "Usuário criado com sucesso.", user: novoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário.", error });
  }
};

const criarEstab = async (req, res) => {
  const { tempE, isO } = req.body;
  try {
    const novoEstab = new modeloEstabelecimento({ tempoEspera: tempE, isOpen: isO });
    await novoEstab.save();

    res.status(201).json({ message: "Estabelecimento criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar estabelecimento: ", error });
  }
};

module.exports = {
  criarEstab,
  delivery_cliente,
  delivery_produtos,
  delivery_loja,
  carregar_pedidos,
  delivery_pedidos,
  delivery_verif_status,
  delivery_change_status,
  delivery_tempo_de_espera,
  delivery_addProdutos_get,
  delivery_addProdutos_post,
  delivery_excluir_produto,
  delivery_mudar_status,
  delivery_login,
  delivery_verif_login,
  delivery_logout,
  criarUsuario,
  delivery_criar_pedido,
};
