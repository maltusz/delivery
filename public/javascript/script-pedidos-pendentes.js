let pedidos = [];
let produtos = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    pedidos = await carregarPedidos();
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

async function carregarPedidos() {
  try {
    const response = await fetch("/delivery/carregar-pedidos?status=false");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
    throw new Error("Erro ao carregar pedidos");
  }
}

document.querySelectorAll(".navbar button").forEach((button) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".navbar button").forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });
});

function toggleModalClose() {
  const modal = document.getElementById("modal");
  modal.classList.toggle("hide");
}

function toggleModal(idPedido) {
  const modal = document.getElementById("modal");
  for (let pedido of pedidos) {
    if (idPedido == pedido.idPedido) {
      var pedidoModal = pedido;
    }
  }

  let valorPedido = 0;
  pedidoModal.produtos.forEach((p) => {
    for (prod of produtos) {
      if (p.item == prod.nome) {
        valorPedido += prod.preco;
      }
    }
  });

  if (modal.classList.contains("hide")) {
    let prod;
    pedidoModal.produtos.forEach((p) => {
      prod += `
        <p>Produto: ${p.item}</p>
        <p>Quantidade: ${p.quantidade}</p>${p.adicionais && p.adicionais.length > 0 ? `<p>Adicionais: ${p.adicionais[0].quantidade}, ${p.adicionais[0].nome}</p>` : `<p>Adicionais: Nenhum</p>`}
          `;
    });
    modal.innerHTML = `<div class="modal-header">
        <h2>PEDIDO N°: ${pedidoModal.idPedido}</h2>
        <a class="btn" onclick="toggleModalClose()">FECHAR</a>
    </div>
        
    <div class="modal-body">
        <div class="dados-cliente">
        <h4>DADOS DO CLIENTE</h4>
            <p>Nome: ${pedidoModal.cliente.nome}</p>
            <p>Telefone: ${pedidoModal.cliente.telefone}</p>
            <p>Endereço: ${pedidoModal.cliente.rua}, ${pedidoModal.cliente.numero}, 
                ${pedidoModal.cliente.bairro}, ${pedidoModal.cliente.complemento}
            </p>
        </div>
          <div class="dados-produtos">
        <h4>PRODUTOS</h4>
          ${prod}
          </div>
        
        <div class="dados-pedido">
            <h4>VALOR DO PEDIDO:</h4>
            <h5>R$${valorPedido}</h5>
        </div>

        <div class="dados-pedido">
            <h4>FORMA DE PAGAMENTO</h4>
                <p>Forma de pagamento: ${pedidoModal.cliente.formadepagamento.forma_pagamento}</p>
                <p>Troco: R$ ${pedidoModal.cliente.formadepagamento.trocoPara}</p>
                <p>Observações: ${pedidoModal.observacao}</p>
        </div>    
    </div>

    <div class="modal-footer">
        <button onclick="imprimirPedido()">IMPRIMIR</button>
    </div>`;
    modal.classList.toggle("hide");
  } else {
    modal.classList.toggle("hide");
  }
}

function imprimirPedido(pedido) {
  let pedidoModal;
  for (let ped of pedidos) {
    if (pedido == ped.idPedido) {
      pedidoModal = ped;
    }
  }
  let modal = `
        <div class="modal-header">
            <h2>PEDIDO N°: ${pedidoModal.idPedido}</h2>
            <button class="fechar-modal" onclick="toggleModal()">FECHAR</button>
        </div>
            
        <div class="modal-body">
            <div class="dados-cliente">
                <p>Cliente: ${pedidoModal.cliente.nome}</p>
                <p>Telefone: ${pedidoModal.cliente.telefone}</p>
                <p>Endereço: ${pedidoModal.cliente.rua}, ${pedidoModal.cliente.numero}, 
                    ${pedidoModal.cliente.bairro}, ${pedidoModal.cliente.complemento}
                </p>
            </div>
            <div class="dados-produtos">
                <p>Produto: ${pedidoModal.produtos[0].item}</p>
                <p>Quantidade: ${pedidoModal.produtos[0].quantidade}</p>
                <p>Adicionais: ${pedidoModal.produtos[0].adicionais[0].quantidade}, ${pedidoModal.produtos[0].adicionais[0].nome}</p>
            </div>
            <div class="dados-pedido">
                <p>Forma de pagamento: ${pedidoModal.cliente.formadepagamento.forma_pagamento}</p>
                <p>Troco: R$ ${pedidoModal.cliente.formadepagamento.trocoPara}</p>
                <p>Observações: ${pedidoModal.observacao}</p>
            </div>    
        </div>

        <div class="modal-footer">
            <button onclick="imprimirPedido()">IMPRIMIR</button>
        </div>`;
  const printWindow = window.open("", "_blank", "width=300,height=600");

  // Estilos para impressão no formato de impressora fiscal
  const styles = `
        <style>
            @page {
                size: 80mm auto;
                margin: 0;
            }
            body {
                font-family: Arial, sans-serif;
                width: 80mm;
                margin: 0;
                padding: 10px;
                box-sizing: border-box;
                align-items: center;
                display: flex;
                flex-direction: column;
            }
            .modal-header, .modal-footer {
                margin-bottom: 10px;
            }
            .modal-header h2 {
                font-size: 16px;
                margin-bottom: 5px;
            }
            .modal-body {
                margin-bottom: 10px;
            }
            .modal-body p {
                font-size: 14px;
                margin: 3px 0;
            }
        </style>
    `;

  // Conteúdo HTML do modal que será impresso
  printWindow.document.write(`
        <html>
        <head>
            <title>Imprimir Pedido</title>
            ${styles}
        </head>
        <body>
            ${modal}
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                };
            </script>
        </body>
        </html>
    `);

  printWindow.document.close();
}

async function mudarStatus(idP) {
  fetch("/delivery/loja/mudar-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idPedido: idP }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message, data.error);
      window.location.reload();
    })
    .catch((error) => {
      console.log("Erro:", error);
    });
}
