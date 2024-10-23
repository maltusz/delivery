const linksMenu = document.querySelectorAll(".nav-link");
let produtos = [];

document.getElementById("telefone-cliente").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Adiciona parênteses nos dois primeiros dígitos
  value = value.replace(/(\d{4})(\d)/, "$1-$2"); // Adiciona o traço entre o quarto e o quinto dígito
  e.target.value = value.substring(0, 14); // Limita o valor a 14 caracteres
});

window.addEventListener("load", function () {
  toggleModal("spinner-container");
});

document.addEventListener("DOMContentLoaded", function () {
  var element = document.getElementById("body");

  element.addEventListener("dblclick", function (e) {
    e.preventDefault();

    if (typeof element.style.touchAction !== "undefined") {
      element.style.touchAction = "manipulation";
    }
  });
});

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

// linksMenu.forEach((link) => {
//   link.classList.remove("active");
// });

// linksMenu.forEach((link) => {
//   link.addEventListener("click", (event) => {
//     linksMenu.forEach((link) => {
//       link.classList.remove("active");
//     });
//     event.currentTarget.classList.add("active");
//   });
// });

// linksMenu.forEach((link) => {
//   link.addEventListener("click", (clique) => {
//     clique.preventDefault();
//     let secao = link.getAttribute("href").substring(1);
//     let section = document.getElementById(secao);
//     let distancia = section.getBoundingClientRect().top;
//     window.scrollTo({
//       top: window.pageYOffset + distancia - 150,
//       behavior: "smooth",
//     });
//   });
// });

const removeActiveClasses = () => {
  linksMenu.forEach((link) => link.classList.remove("active"));
};

// Adicionar o comportamento de clique (scroll suave e marcar o link clicado como ativo)
linksMenu.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevenir o comportamento padrão
    const secao = link.getAttribute("href").substring(1); // Pegar o ID da seção
    const section = document.getElementById(secao);
    const distancia = section.getBoundingClientRect().top + window.pageYOffset - 150; // Ajustar a posição
    window.scrollTo({
      top: distancia,
      behavior: "smooth",
    });

    removeActiveClasses(); // Remover "active" de todos os links
    link.classList.add("active"); // Adicionar "active" ao link clicado

    // Rolar o link ativo para o centro da tela
    const navContainer = document.querySelector(".menu-nav");
    const linkPosition = link.getBoundingClientRect().left + navContainer.scrollLeft; // Posição do link
    const navWidth = navContainer.clientWidth; // Largura da barra de navegação

    // Rolar a barra de navegação
    navContainer.scrollTo({
      left: linkPosition - navWidth / 2 + link.clientWidth / 2, // Centralizar o link
      behavior: "smooth",
    });
  });
});

// Adicionar o Intersection Observer para destacar automaticamente o link correto
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        removeActiveClasses();
        const activeLink = document.querySelector(`[href="#${id}"]`);
        activeLink.classList.add("active");

        // Rolar o link ativo para o centro da barra de navegação
        const navContainer = document.querySelector(".menu-nav");
        const linkPosition = activeLink.getBoundingClientRect().left + navContainer.scrollLeft;
        const navWidth = navContainer.clientWidth;

        navContainer.scrollTo({
          left: linkPosition - navWidth / 2 + activeLink.clientWidth / 2,
          behavior: "smooth",
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => {
  observer.observe(section);
});

function aumentar(id) {
  let num = document.getElementById(id);
  let numero = Number(num.value);
  numero = numero + 1;
  num.value = numero;
}

function diminuir(id) {
  let num = document.getElementById(id);
  let numero = Number(num.value);
  if (numero > 0) {
    numero = numero - 1;
  }
  num.value = numero;
}

function toggleModal(idModal) {
  const modal = document.getElementById("modal");
  if (idModal === "spinner-container") {
    let spinner = document.getElementById("spinner-container");
    spinner.classList.toggle("hide");
  } else if (idModal === "modal-pedido-finalizado") {
    let ultimoModal = document.getElementById("modal-pedido-finalizado");
    ultimoModal.classList.toggle("hide");
  } else if (idModal === "carrinho") {
    let carrinho = document.getElementById("carrinho");
    carrinho.classList.toggle("hide");
  } else if (idModal === "modal-checkout") {
    let carrinho_body = document.getElementById("carrinho-body");
    if (carrinho_body.innerHTML.trim() === "") {
      return alert("O carrinho está vazio! Adicione algum produto antes de prosseguirmos!");
    } else {
      let checkout = document.getElementById("modal-checkout");
      checkout.classList.toggle("hide");
    }
  } else {
    for (let produto of produtos) {
      if (produto.nome === idModal) {
        var produtoModal = produto;
      }
    }

    if (modal.classList.contains("hide")) {
      // Se contém o hide e a pessoa clicou significa que tava
      // oculto e vai abrir, ai pra isso, primeiro eu faço tudo que tenho que fazer,
      // preencho o modal com as informações de acordo o clique e depois dou o toggle no hide

      if (produtoModal.tipo === "hamburguer_normal" || produtoModal.tipo === "hamburguer_artesanal") {
        modal.innerHTML = `<div class="modal-header">
            <!-- Aqui vai ficar a imagem e o botão de fechar -->

            <img src="data:${produtoModal.imagemMimeType};base64,${produtoModal.imagem}" alt="">
            <button class="fechar-modal" onclick="toggleModal()">X</button>
        </div>
        
        <div class="modal-body">
            <!-- Aqui vai ficar a descrição do produto, os adicionais e o campo de observação-->
            <div class="desc-modal">
                <h4 id="produto" style="color: rgb(115, 115, 255)">${produtoModal.nome}</h4>
                <span>${produtoModal.desc}</span>
            </div>

            <div class="container-adicionais">
                <h2>ADICIONAIS</h2>
                <div id="molho-especial" class="adicional">
                    <h5>Molho Especial</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional1')" value="-">
                        <input type="button" id="adicional1" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional1')" value="+">    
                    </div>
                </div>

                <div id="cheddar" class="adicional">
                    <h5>Cheddar</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional2')" value="-">
                        <input type="button" id="adicional2" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional2')" value="+">    
                    </div>
                </div>
                
                <div id="bacon" class="adicional">
                    <h5>Bacon</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional3')" value="-">
                        <input type="button" id="adicional3" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional3')" value="+">    
                    </div>
                </div>

                <div id="frango" class="adicional">
                    <h5>Frango</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional4')" value="-">
                        <input type="button" id="adicional4" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional4')" value="+">    
                    </div>
                </div>
                
                <div id="calabresa" class="adicional">
                    <h5>Calabresa</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional5')" value="-">
                        <input type="button" id="adicional5" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional5')" value="+">    
                    </div>
                </div>
                
                <div id="ovo" class="adicional">
                    <h5>Ovo</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional6')" value="-">
                        <input type="button" id="adicional6" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional6')" value="+">    
                    </div>
                </div>
            
            </div>

        </div>
        <div class="modal-footer">
            <!-- Aqui vai ficar a quantidade e o botão de adicionar [] Talvez ter só a possibilidade de adicionar seja melhor -->
            <div class="botao-add" onclick="addCarrinho('modal')">
                <span>Adicionar ao carrinho</span>
                <span class="valor-item-modal">R$${produtoModal.preco}</span>
            </div>
        </div>`;

        modal.classList.toggle("hide");
      } else if (produtoModal.tipo === "acai") {
        modal.innerHTML = `<div class="modal-header">
            <!-- Aqui vai ficar a imagem e o botão de fechar -->

            <img src="data:${produtoModal.imagemMimeType};base64,${produtoModal.imagem}" alt="">
            <button class="fechar-modal" onclick="toggleModal()">X</button>
        </div>
        
        <div class="modal-body">
            <!-- Aqui vai ficar a descrição do produto, os adicionais e o campo de observação-->
            <div class="desc-modal">
                <h4 id="produto" style="color: rgb(115, 115, 255)">${produtoModal.nome}</h4>
                <span>${produtoModal.desc}</span>
            </div>

            <div class="container-adicionais">
                <h2>ADICIONAIS</h2>
                <div id="leite-po" class="adicional">
                    <h5>Leite em pó</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional1')" value="-">
                        <input type="button" id="adicional1" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional1')" value="+">    
                    </div>
                </div>

                <div id="morango" class="adicional">
                    <h5>Morango</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional2')" value="-">
                        <input type="button" id="adicional2" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional2')" value="+">    
                    </div>
                </div>
                
                <div id="confetes" class="adicional">
                    <h5>Confetes</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional3')" value="-">
                        <input type="button" id="adicional3" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional3')" value="+">    
                    </div>
                </div>

                <div id="leite-condensado" class="adicional">
                    <h5>Leite Condensado</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional4')" value="-">
                        <input type="button" id="adicional4" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional4')" value="+">    
                    </div>
                </div>
                
                <div id="banana" class="adicional">
                    <h5>Banana</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional5')" value="-">
                        <input type="button" id="adicional5" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional5')" value="+">    
                    </div>
                </div>
                
                <div id="kiwi" class="adicional">
                    <h5>Kiwi</h5>
                    <div class="botoes-quantidade">
                        <input type="button" id="dmm" onclick="diminuir('adicional6')" value="-">
                        <input type="button" id="adicional6" class="quant-adicional" value=0>
                        <input type="button" id="add" onclick="aumentar('adicional6')" value="+">    
                    </div>
                </div>
            
            </div>

        </div>
        <div class="modal-footer">
            <!-- Aqui vai ficar a quantidade e o botão de adicionar [] Talvez ter só a possibilidade de adicionar seja melhor -->
            <div class="botao-add" onclick="addCarrinho('modal')">
                <span>Adicionar ao carrinho</span>
                <span class="valor-item-modal">R$${produtoModal.preco}</span>
            </div>
        </div>`;

        modal.classList.toggle("hide");
      } else if (produtoModal.tipo === "bebida") {
        modal.innerHTML = `<div class="modal-header">
            <!-- Aqui vai ficar a imagem e o botão de fechar -->

            <img src="data:${produtoModal.imagemMimeType};base64,${produtoModal.imagem}" alt="">
            <button class="fechar-modal" onclick="toggleModal()">X</button>
        </div>
        
        <div class="modal-body">
            <!-- Aqui vai ficar a descrição do produto, os adicionais e o campo de observação-->
            <div class="desc-modal">
                <h4 id="produto" style="color: rgb(115, 115, 255)">${produtoModal.nome}</h4>
                <span>${produtoModal.desc}</span>
        </div>

        <div class="modal-footer">
            <!-- Aqui vai ficar a quantidade e o botão de adicionar [] Talvez ter só a possibilidade de adicionar seja melhor -->
            <div class="botao-add" onclick="addCarrinho('modal')">
                <span>Adicionar ao carrinho</span>
                <span class="valor-item-modal">R$${produtoModal.preco}</span>
            </div>
        </div>`;
        modal.classList.toggle("hide");
      }
    } else {
      // Se não contém o hide então ele está aberto, ai eu dou o toggle pra fechar ele. Será que preciso limpar ele primeiro?
      modal.classList.toggle("hide");
    }
  }
}

function atualizarValorTotal() {
  let carrinhoBody = document.querySelector("#carrinho-body");
  let itens = carrinhoBody.querySelectorAll(".container-carrinho-body");
  let total = 0;

  itens.forEach((item) => {
    let precoElement = item.querySelector(".infos span:nth-of-type(2)");
    let quantidadeElement = item.querySelector(".infos span:nth-of-type(1)");

    let precoTexto = precoElement.textContent.replace("Valor: R$", "").replace(",", ".");
    let quantidadeTexto = quantidadeElement.textContent.replace("Quantidade: ", "");

    let preco = parseFloat(precoTexto);
    let quantidade = parseInt(quantidadeTexto);

    if (!isNaN(preco) && !isNaN(quantidade)) {
      total += preco;
    } else {
      console.error(`Valor inválido - Preço: ${preco}, Quantidade: ${quantidade}`);
    }
  });

  let botaoFooter = document.querySelector("#botao-finalizar-pedido");
  let botaoCheckout = document.querySelector("#botao-enviar-pedido");
  botaoFooter.innerHTML = `Finalizar pedido - Total: R$${total.toFixed(2)}`;
  botaoCheckout.innerHTML = `ENVIAR PEDIDO - TOTAL: R$${total.toFixed(2)}`;
}

function addCarrinho(modal) {
  let info = document.getElementById(modal);
  let adicionaisProduto = [];
  let adicionais = info.querySelectorAll(".adicional");
  adicionais.forEach((adicional) => {
    let quantAdicional = adicional.querySelector(".quant-adicional").value;
    if (quantAdicional > 0) {
      adic = adicional.children[0].textContent;
      adicionaisProduto.push({ adic, quantAdicional });
    }
  });

  let adicionaisHTML = adicionaisProduto
    .map((adicional) => {
      return `<span class="valor">${adicional.quantAdicional} - ${adicional.adic}</span><br>`;
    })
    .join("");

  let produtoSelected = info.querySelector("#produto").innerText;

  let produtoAdd;
  for (let produto of produtos) {
    if (produto.nome === produtoSelected) {
      produtoAdd = produto;
    }
  }

  if (!produtoAdd) return;

  let carrinhoBody = document.getElementById("carrinho-body");
  let produtoNoCarrinho = carrinhoBody.querySelector(`#produto-${produtoAdd.idProd}`);

  if (produtoNoCarrinho) {
    let quantidadeSpan = produtoNoCarrinho.querySelector(".quantidade");
    let valorSpan = produtoNoCarrinho.querySelector(".valor");

    let quantidade = parseInt(quantidadeSpan.textContent.split("Quantidade: ")[1]) + 1;
    quantidadeSpan.textContent = `Quantidade: ${quantidade}`;
    valorSpan.textContent = `Valor: R$${(quantidade * produtoAdd.preco).toFixed(2)}`;
  } else {
    carrinhoBody.innerHTML += `
        <div class="container-carrinho-body" id="produto-${produtoAdd.idProd}">
            <div style="display: flex; flex-direction: row; align-items: center">
                <div class="imagem">
                    <img src="data:${produtoAdd.imagemMimeType};base64,${produtoAdd.imagem}" alt="">
                </div>        
                <div class="infos">
                    <h4>${produtoAdd.nome}</h4>
                    <span class="quantidade">Quantidade: 1</span><br>
                    <span class="valor">Valor: R$${produtoAdd.preco.toFixed(2)}</span>
                    <span>Adicionais: </span><br>
                    <div id="adicionais-carrinho">
                        ${adicionaisHTML}                    
                    </div>    
                    </div>
            </div>
            <div class="botao-remove">
                <button class="btn btn-danger" onclick="removeCarrinho('produto-${produtoAdd.idProd}')">Remover</button>
            </div>
        </div>
        `;
  }

  atualizarValorTotal();
  info.classList.toggle("hide");
}

// function addCarrinho(modal){
//     let info = document.getElementById(modal)
//     let produtoSelected = info.querySelector('#produto').innerText

//     for(let produto of produtos){
//         if(produto.nome === produtoSelected){
//             var produtoAdd = produto;
//         }
//     }
//     let carrinho = document.getElementById('carrinho')

//     let carrinhoBody = carrinho.querySelector('#carrinho-body')
//     let quantidade = 1;
//     if(carrinhoBody.children.length === 0){
//         carrinhoBody.innerHTML = `
//         <div class="container-carrinho-body" id="item-${produtoAdd.idProd}">
//             <div style="display: flex; flex-direction: row; align-items: center">
//                 <div class="imagem">
//                     <img src="data:${produtoAdd.imagemMimeType};base64,${produtoAdd.imagem}" alt="">
//                 </div>
//                 <div class="infos">
//                     <h4>${produtoAdd.nome}</h4>
//                     <span>Quantidade: ${quantidade}</span><br>
//                     <span>Valor: R$${produtoAdd.preco}</span>
//                 </div>
//             </div>
//             <div class="botao-remove">
//                 <button class="btn btn-danger" onclick="removeCarrinho('item-${produtoAdd.idProd}')">Remover</button>
//             </div>
//         </div>
//         `
//     }else{
//         let prodJaNoCarrinho = carrinhoBody.querySelectorAll('.infos')

//         prodJaNoCarrinho.forEach(function(element){
//             prod = prodJaNoCarrinho[0].children[0].textContent
//             novaQuant = quantidade + 1
//             if(prod === produtoSelected){
//                 carrinhoBody.innerHTML = `
//                     <div class="container-carrinho-body" id="item-${produtoAdd.idProd}">
//                         <div style="display: flex; flex-direction: row; align-items: center">
//                             <div class="imagem">
//                                 <img src="data:${produtoAdd.imagemMimeType};base64,${produtoAdd.imagem}" alt="">
//                             </div>
//                             <div class="infos">
//                                 <h4>${produtoAdd.nome}</h4>
//                                 <span>Quantidade: ${novaQuant}</span><br>
//                                 <span>Valor: ${produtoAdd.preco * novaQuant}</span>
//                             </div>
//                         </div>
//                         <div class="botao-remove">
//                             <button class="btn btn-danger" onclick="removeCarrinho('item-${produtoAdd.idProd}')">Remover</button>
//                         </div>
//                     </div>
//                     `
//             }else{
//                 carrinhoBody.innerHTML += `
//                     <div class="container-carrinho-body" id="item-${produtoAdd.idProd}">
//                         <div style="display: flex; flex-direction: row; align-items: center">
//                             <div class="imagem">
//                                 <img src="data:${produtoAdd.imagemMimeType};base64,${produtoAdd.imagem}" alt="">
//                             </div>
//                             <div class="infos">
//                                 <h4>${produtoAdd.nome}</h4>
//                                 <span>Quantidade: ${quantidade}</span><br>
//                                 <span>Valor: R$${produtoAdd.preco}</span>
//                             </div>
//                         </div>
//                         <div class="botao-remove">
//                             <button class="btn btn-danger" onclick="removeCarrinho('item-${produtoAdd.idProd}')">Remover</button>
//                         </div>
//                     </div>
//                     `
//             }
//         })

//         // for(let i of prodJaNoCarrinho){
//         //     if(prodJaNoCarrinho[i].h4.value == produtoSelected){
//         //         console.log("Esse produto já está no carrinho")
//         //     }else{
//         //         carrinhoBody.innerHTML += `
//         //         <div class="container-carrinho-body" id="${produtoAdd.id}">
//         //             <div style="display: flex; flex-direction: row; align-items: center">
//         //                 <div class="imagem">
//         //                     <img src="${produtoAdd.imagem}" alt="">
//         //                 </div>
//         //                 <div class="infos">
//         //                     <h4>${produtoAdd.nome}</h4>
//         //                     <span>Quantidade: ${quantidade}</span><br>
//         //                     <span>Valor: ${valorTotalItems}</span>
//         //                 </div>
//         //             </div>
//         //             <div class="botao-remove">
//         //                 <button class="btn btn-danger" onclick="removeCarrinho('${produtoAdd.id}')">Remover</button>
//         //             </div>
//         //         </div>
//         //         `
//         //         break;
//         //     }
//         // }

//     }

//     info.classList.toggle('hide')
// }

function removeCarrinho(produto) {
  let carrinhoBody = document.querySelector("#carrinho-body");
  let item = carrinhoBody.querySelector(`#${produto}`);
  carrinhoBody.removeChild(item);
  atualizarValorTotal();
}

function habilitar_troco() {
  var input_troco = document.querySelector("#troco");
  var forma_pagamento = document.querySelector("#forma-pagamento");

  if (forma_pagamento.value === "dinheiro") {
    input_troco.removeAttribute("disabled");
    input_troco.classList.remove("hide");
  } else {
    input_troco.setAttribute("disabled", true);
    input_troco.classList.add("hide");
  }
}

function criarPedido(dadosCliente, dadosProdutos) {
  let cliente = document.getElementById(dadosCliente);

  if (!validarCampos(cliente)) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return; // Interrompe a execução se a validação falhar
  }

  let forma_pagamento = cliente.querySelector("#forma-pagamento").value;
  let troco = cliente.querySelector("#troco");

  if (troco.disabled === true) {
    precisaTroco = false;
    trocoPara = 0;
  } else {
    precisaTroco = true;
    trocoPara = troco.value;
  }

  Cliente = {
    nome: cliente.querySelector("#nome-cliente").value,
    telefone: cliente.querySelector("#telefone-cliente").value,
    rua: cliente.querySelector("#rua-cliente").value,
    numero: cliente.querySelector("#numero-cliente").value,
    complemento: cliente.querySelector("#complemento-cliente").value,
    bairro: cliente.querySelector("#bairro-cliente").value,
    formadepagamento: { forma_pagamento, precisaTroco, trocoPara },
  };

  let carrinho = document.getElementById(dadosProdutos);
  let pedidosCarrinho = carrinho.getElementsByClassName("container-carrinho-body");
  let Produtos = [];

  for (var i = 0; i < pedidosCarrinho.length; i++) {
    let produto = pedidosCarrinho[i];

    let nomeItem = produto.querySelector(".infos h4").innerText;
    let quantidadeItem = parseInt(produto.querySelector(".infos span").innerText.split(" ")[1]);
    let adicionais = produto.querySelector("#adicionais-carrinho");
    let spanElements = adicionais.querySelectorAll("span.valor");

    let adicionaisArray = [];

    spanElements.forEach((span) => {
      let text = span.textContent.trim();

      let [quantidade, nome] = text.split(" - ").map((item) => item.trim());

      adicionaisArray.push({ quantidade: parseInt(quantidade), nome: nome });
    });

    let produtos = {
      item: nomeItem,
      quantidade: quantidadeItem,
      adicionais: adicionaisArray,
    };

    Produtos.push(produtos);
  }
  let obs = carrinho.querySelector("#observacoes").value;
  console.log(Produtos);

  toggleModal("spinner-container");

  fetch("/delivery/criarPedido", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: false, cliente: Cliente, produtos: Produtos, observacao: obs }),
  })
    .then((response) => response.json())
    .then((data) => {
      toggleModal("spinner-container");
      toggleModal("modal-pedido-finalizado");
      console.log("Sucesso:", data);
    })
    .catch((error) => {
      console.log("Erro:", error);
    });
}

function validarCampos(cliente) {
  const nome = cliente.querySelector("#nome-cliente").value.trim();
  const telefone = cliente.querySelector("#telefone-cliente").value.trim();
  const rua = cliente.querySelector("#rua-cliente").value.trim();
  const numero = cliente.querySelector("#numero-cliente").value.trim();
  const bairro = cliente.querySelector("#bairro-cliente").value.trim();
  const formaPagamento = cliente.querySelector("#forma-pagamento").value;

  if (!nome || !telefone || !rua || !numero || !bairro || formaPagamento === "Selecionar") {
    return false;
  }

  return true;
}
