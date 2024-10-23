require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const rota = require("./routes/router.js");
const usuario = require("./models/Usuario-mongodb.js");
const mysql = require("mysql2");

// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode");
// const bcrypt = require("bcrypt");
// const fs = require("fs");

// const sslOptions = {
//   key: fs.readFileSync(process.env.SSL_KEY_PATH),
//   cert: fs.readFileSync(process.env.SSL_CERT_PATH),
// };

// const client = new Client({
//   authStrategy: new LocalAuth(),
// });

// client.on("qr", (qr) => {
//   console.log("QR Code gerado:", qr);
//   qrcode.generate(qr, { small: true });
//   console.log("Escaneie o QR Code para conectar ao WhatsApp.");
// });

// client.on("ready", async () => {
//   console.log("WhatsApp Web conectado e pronto para uso!");

//   const numeroTeste = `553892161821@c.us`;

//   try {
//     await client.sendMessage(numeroTeste, "Teste de envio de mensagem!");
//     console.log("Mensagem de teste enviada!");
//   } catch (error) {
//     console.error("Erro ao enviar mensagem de teste:", error);
//   }
// });

// client.initialize();

// app.set("whatsappClient", client);

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "delivery",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL: " + err.stack);
    return;
  }
  console.log("Conectado ao MySQL com o ID " + connection.threadId);
});

mongoose.connect(process.env.MONGODB_URL_CONNECTION);

let mongodb = mongoose.connection;

mongodb.on("error", () => {
  console.log("Houver um erro no carregamento do banco de dados");
});
mongodb.once("open", () => {
  console.log("BD carregado");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await usuario.findOne({ usuario: username });
      if (!user) return done(null, false, { message: "Usuário incorreto." });

      const match = await user.comparePassword(password);
      if (!match) return done(null, false, { message: "Senha incorreta." });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usuario.findById(id);
    if (!user) {
      return done(new Error("Usuário não encontrado"));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "views")]);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", rota);

app.listen(process.env.PORT, () => {
  console.log(`Server rodando na porta ${process.env.PORT}`);
});
