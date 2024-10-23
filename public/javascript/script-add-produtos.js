let produtos = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    produtos = await carregarProdutos();
  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
  }
});

async function carregarProdutos() {
  try {
    const response = await fetch("/delivery/produtos");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    throw new Error("Erro ao carregar produtos");
  }
}

function toggleModalCadastro() {
  let modal = document.getElementById("modal");
  if (modal.classList.contains("hide")) {
    modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
          <h5 style="margin: 0">Cadastrar produto</h5>
          <button class="but btn btn-danger" style="margin: 0" onclick="toggleModalCadastro()">VOLTAR</button>
        </div>

        <div class="modal-body">
          <form action="/delivery/loja/add-produtos" method="POST" enctype="multipart/form-data">
            <label for="nome-produto">Nome do produto *</label>
            <div class="form-group">
              <input class="input-prod" type="text" name="nome" id="nome-produto" />
            </div>
            <label for="tipo-produto">Tipo *</label>
            <div class="form-produtos">
              <select class="tipo-produto" name="tipo" id="tipo-produto">
                <option value="" data-default disabled selected>Selecione:</option>
                <option value="acai">AÇAI</option>
                <option value="bebida">BEBIDA</option>
                <option value="hamburguer_artesanal">HAMBURGUER ARTESANAL</option>
                <option value="hamburguer_normal">HAMBURGUER NORMAL</option>
              </select>
            </div>
            <label for="descricao-produto">Descrição *</label>
            <div class="form-group">
              <input class="input-prod" type="text" name="descricao" id="descricao-produto" />
            </div>
            <label for="preco-produto">Preço *</label>
            <div class="form-group">
              <input class="input-prod" type="number" name="preco" id="preco-produto" />
            </div>
            <label for="img-prod">Imagem *</label>
            <div class="form-group">
              <input type="file" class="form-control-file" id="img-prod" name="imagem" />
            </div>

            <button class="btn btn-success" style="width: 100%">ENVIAR</button>
          </form>
        </div>
      </div>`;
    modal.classList.toggle("hide");
  } else {
    modal.classList.toggle("hide");
  }
}

function toggleModalEditar(p) {
  let modal = document.getElementById("modal");
  if (modal.classList.contains("hide")) {
    let produtoModal = produtos.find((prod) => prod.idProd == p);

    if (produtoModal) {
      modal.innerHTML = `

    
      <div class="modal-content">
        <div class="modal-header">
          <h5 style="margin: 0">Cadastrar produto</h5>
          <button class="but btn btn-danger" style="margin: 0" onclick="toggleModalEditar()">VOLTAR</button>
        </div>

        <div class="modal-body">
          <form action="/delivery/loja/add-produtos" method="POST" enctype="multipart/form-data">
            <label for="idProd">ID Produto</label>
            <div class="form-group">
              <input class="input-prod" type="text" name="idProd" id="idProd" value="${produtoModal.idProd}" readonly/>
            </div>
            <label for="nome-produto">Nome do produto *</label>
            <div class="form-group">
              <input class="input-prod" type="text" name="nome" id="nome-produto" value="${produtoModal.nome}"/>
            </div>
            <label for="tipo-produto">Tipo *</label>
            <div class="form-produtos">
              <select class="tipo-produto" name="tipo" id="tipo-produto">
                <option value="acai" ${produtoModal.tipo === "acai" ? "selected" : ""}>AÇAI</option>
                    <option value="bebida" ${produtoModal.tipo === "bebida" ? "selected" : ""}>BEBIDA</option>
                    <option value="hamburguer_artesanal" ${produtoModal.tipo === "hamburguer_artesanal" ? "selected" : ""}>HAMBURGUER ARTESANAL</option>
                    <option value="hamburguer_normal" ${produtoModal.tipo === "hamburguer_normal" ? "selected" : ""}>HAMBURGUER NORMAL</option>
              </select>
            </div>
            <label for="descricao-produto">Descrição *</label>
            <div class="form-group">
              <input class="input-prod" type="text" name="descricao" id="descricao-produto" value="${produtoModal.desc}"/>
            </div>
            <label for="preco-produto">Preço *</label>
            <div class="form-group">
              <input class="input-prod" type="number" name="preco" id="preco-produto" value="${produtoModal.preco}"/>
            </div>
            <label for="img-prod">Imagem *</label>
            <div class="form-group">
              <input type="file" class="form-control-file" id="img-prod" name="imagem" />
            </div>

            <button class="btn btn-success" style="width: 100%" onclick="editarProduto()">ENVIAR</button>
          </form>
        </div>
      </div>
    
            `;
    }

    modal.classList.toggle("hide");
  } else {
    modal.classList.toggle("hide");
  }
}

function toggleModalExcluir(i) {
  let modal = document.getElementById("modal-excluir");
  if (modal.classList.contains("hide")) {
    modal.innerHTML = `
    <div class="modal-excluir-content">
        <div class="header-excluir">
          <h5>Tem certeza que deseja excluir o produto?</h5>
          <button class="btn btn-danger" onclick="toggleModalExcluir()">VOLTAR</button>
        </div>
        <div class="body-excluir">
          <span>Digite seu usuário e senha para prosseguir:</span>
          <div class="body-dados">
            <label for="usuario">Usuário</label>
            <input type="text" name="usuario" id="usuario" />
            </div>
            <div class="body-dados">
                <label for="usuario">Senha</label>
                <input type="password" name="senha" id="senha" />
            </div>
          </div>
          <div class="footer-excluir">
              <button class="btn btn-danger" onclick="excluirProduto(${i})">EXCLUIR</button>
          </div>
        </div>
      </div>
      `;
    modal.classList.toggle("hide");
  } else {
    modal.classList.toggle("hide");
  }
}

function toggleSpinner() {
  let modal = document.getElementById("spinner-container");
  modal.classList.toggle("hide");
}

function excluirProduto(id) {
  let user = document.getElementById("usuario").value;
  let senha = document.getElementById("senha").value;

  toggleSpinner();
  fetch("/delivery/loja/excluir-produto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id, username: user, password: senha }),
  })
    .then((response) => response.json())
    .then((data) => {
      toggleSpinner();
      toggleModalExcluir();
    })
    .catch((error) => {
      console.log("Erro:", error);
    });
}
