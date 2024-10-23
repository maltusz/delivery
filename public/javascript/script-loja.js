function changeEstabelecimento() {
  let idEstab = 1;
  fetch("/delivery/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: idEstab }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      window.location.href = "/delivery/loja";
    });
}

function toggleModalTempo() {
  let modal = document.getElementById("modal");
  if (modal.classList.contains("hide")) {
    modal.innerHTML = `
      <div class="modal-content"> 
            <div class="modal-header">
              <h3 style="margin-bottom: 0;">Tempo de espera</h3>
              <button class="btn btn-danger" onclick="toggleModalTempo()">FECHAR</button>
            </div>
            <div class="modal-body">
                <span></span>
                <div class="body-dados">
                    <label for="tempo-espera">Digite o novo tempo de espera: (em minutos)</label>
                    <input type="number" name="tempo-espera" id="tempo-espera">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-success" onclick="alterarTempoEspera()">ALTERAR TEMPO</button>
            </div>
        </div> 
    `;
    modal.classList.toggle("hide");
  } else {
    modal.classList.toggle("hide");
  }
}

async function alterarTempoEspera() {
  let s = document.getElementById("spinner-container");
  s.classList.toggle("hide");
  const tempo = document.getElementById("tempo-espera").value;
  try {
    const response = await fetch("/delivery/loja/alterar-tempo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tempoEspera: tempo }),
    })
      .then((response) => response.json())
      .then((data) => {
        s.classList.toggle("hide");
        alert("Tempo de espera alterado com sucesso!");
        window.location.reload();
      });
  } catch (err) {
    console.log("Erro: ", err);
  }
}

async function logout() {
  try {
    let response = await fetch("/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        console.log("Não conseguimos redirecionar! :(");
      }
    });
  } catch (err) {
    console.log("Erro: ", err);
  }
}
