let pedidos = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pedidos = await carregarPedidos();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
    }
});

async function carregarPedidos() {
    try {
        const response = await fetch('/delivery/carregar-pedidos?status=true');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        throw new Error('Erro ao carregar pedidos');
    }
}

document.querySelectorAll('.navbar button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.navbar button').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

function toggleModal(idPedido){
    const modal = document.getElementById('modal');
    for(let pedido of pedidos){
        if(idPedido == pedido.idPedido){
            var pedidoModal = pedido;
        }
    }

    if(modal.classList.contains('hide')){
        modal.innerHTML = `
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
        </div>`
        modal.classList.toggle('hide')
    }else{
        modal.classList.toggle('hide')
    }
}