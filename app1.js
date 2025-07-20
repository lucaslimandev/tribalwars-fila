// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDgmpnI5eIEKfNO80VKpTCXv9v24gbHL8M",
  authDomain: "luczutilityscript.firebaseapp.com",
  databaseURL: "https://luczutilityscript-default-rtdb.firebaseio.com",
  projectId: "luczutilityscript",
  storageBucket: "luczutilityscript.appspot.com",
  messagingSenderId: "833792829994",
  appId: "1:833792829994:web:b1c5b0828f5af126f97153",
  measurementId: "G-4RNEE09GC9",
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html" // redireciona se não estiver logado
  }
})

const db = firebase.database()
const tabela = document.querySelector("#players-table tbody")

let dadosCache = {}

function atualizarTabela() {
  tabela.innerHTML = ""

  for (let jogador in dadosCache) {
    const dados = dadosCache[jogador]
    const tempo = new Date(dados.timestamp)
    const minutosPassados = (Date.now() - tempo.getTime()) / 60000

    const status = minutosPassados > 20 ? "Deslogado" : "Logado"
    const statusColor = minutosPassados > 20 ? "#dc3545" : "#28a745"

    const playerPoints = dados.points

    const recursos = {
      madeira: Math.floor(
        dados.recursos.madeira +
          dados.producao_por_hora.madeira * (minutosPassados / 60)
      ),
      argila: Math.floor(
        dados.recursos.argila +
          dados.producao_por_hora.argila * (minutosPassados / 60)
      ),
      ferro: Math.floor(
        dados.recursos.ferro +
          dados.producao_por_hora.ferro * (minutosPassados / 60)
      ),
    }

    let filaHtml = ""

    if (
      dados.fila_construcao === "vazia" ||
      !dados.fila_construcao ||
      dados.fila_construcao.length === 0
    ) {
      filaHtml = "<i>Fila vazia</i>"
    } else {
      const primeiro = dados.fila_construcao[0]
      const resto = dados.fila_construcao.slice(1)

      let tooltipConteudo = ""
      if (resto.length > 0) {
        tooltipConteudo = resto
          .map(
            (item) =>
              `<div><strong>${item.nome} (Nível ${item.nivel})</strong><br><small>Conclui: ${item.conclusao}</small></div>`
          )
          .join("")
      } else {
        tooltipConteudo = "<div><em>Nenhum outro item</em></div>"
      }

      filaHtml = `
        <div class="tooltip-container">
          <div class="tooltip-primeiro">
            ${primeiro.nome} (Nível ${primeiro.nivel})<br>
            <small>Conclui: ${primeiro.conclusao}</small>
          </div>
          <div class="tooltip-texto">${tooltipConteudo}</div>
        </div>
      `
    }

    const linha = document.createElement("tr")

    linha.innerHTML = `
      <td style="background:${statusColor}; color: white; font-weight: bold">${status}</td>
      <td>${jogador}</td>
      <td>${playerPoints}</td>
      <td>${tempo.toLocaleString()}</td>
      <td>${recursos.madeira}</td>
      <td>${recursos.argila}</td>
      <td>${recursos.ferro}</td>
      <td>${dados.recursos.armazenamento}</td>
      <td>${filaHtml}</td>
    `

    tabela.appendChild(linha)
  }
}

function carregarDados() {
  db.ref("jogadores")
    .once("value")
    .then((snapshot) => {
      dadosCache = snapshot.val() || {}
      atualizarTabela()
    })
}

carregarDados()

setInterval(() => {
  atualizarTabela() // atualiza recursos com base no tempo passado
}, 60 * 1000)

setInterval(() => {
  carregarDados() // atualiza do banco a cada 5 min para novos dados
}, 5 * 60 * 1000)
