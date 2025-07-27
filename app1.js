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

function calcularDistancia(x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy).toFixed(2)
}

let dadosCache = {}
let pontosPrincipal
function atualizarTabela(coordSelecionada = {}) {
  const { coordX: selecX, coordY: selecY } = coordSelecionada
  tabela.innerHTML = ""

  for (let jogador in dadosCache) {
    const dados = dadosCache[jogador]
    const tempo = new Date(dados.timestamp)
    const minutosPassados = (Date.now() - tempo.getTime()) / 60000

    const status = minutosPassados > 20 ? "Deslogado" : "Logado"
    const statusClass =
      minutosPassados > 20 ? "status-deslogado" : "status-logado"

    const playerPoints = dados.points
    const coordX = dados.coordenadas?.coordX ?? null
    const coordY = dados.coordenadas?.coordY ?? null
    const coordenadasTexto =
      coordX !== null && coordY !== null ? `(${coordX}|${coordY})` : "N/A"
    let distancia = "-"
    if (selecX && selecY && coordX !== null && coordY !== null) {
      distancia = calcularDistancia(selecX, selecY, coordX, coordY)
    }

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

    const selectEl = document.getElementById("seletor-aldeia")
    const aldeiaSelecionadaId = selectEl ? selectEl.value : null
    const villageIdJogador = dados.villageId || null

    const atacarLink =
      aldeiaSelecionadaId && villageIdJogador
        ? `https://brc2.tribalwars.com.br/game.php?village=${aldeiaSelecionadaId}&screen=place&target=${villageIdJogador}`
        : "#"

    const atacarBtn =
      aldeiaSelecionadaId &&
      villageIdJogador &&
      pontosPrincipal / playerPoints < 20
        ? `
      <a href="${atacarLink}" target="_blank" class="ataque-link">
        <button class="botao-atacar">⚔️ Atacar</button>
      </a>`
        : `<button class="botao-atacar" disabled>Selecionar aldeia</button>`

    console.log(atacarLink)
    console.log(villageIdJogador)

    const armazenamento = dados.recursos.armazenamento
    // Verifica percentual e define cor para cada recurso
    const corRecurso = (valor) => {
      const porcentagem = (valor / armazenamento) * 100
      if (porcentagem >= 100) return "color: red; font-weight: bold"
      if (porcentagem >= 75) return "color: orange; font-weight: bold"
      return ""
    }
    linha.innerHTML = `
  <td class="status-cell">
  <span class="status-indicador ${statusClass}" title="${status}"></span>
</td>
  <td>${jogador}</td>
  <td>${coordenadasTexto}</td>
  <td>${distancia}</td>
  <td>${atacarBtn}</td>
  <td>${playerPoints}</td>
  <td>${tempo.toLocaleString()}</td>
  <td style="${corRecurso(recursos.madeira)}">${recursos.madeira}</td>
  <td style="${corRecurso(recursos.argila)}">${recursos.argila}</td>
  <td style="${corRecurso(recursos.ferro)}">${recursos.ferro}</td>
  <td>${dados.recursos.armazenamento}</td>

`

    tabela.appendChild(linha)
  }

  document.querySelectorAll(".ataque-link .botao-atacar").forEach((botao) => {
    botao.addEventListener("click", (e) => {
      e.target.classList.add("ataque-animacao")
      setTimeout(() => {
        e.target.classList.remove("ataque-animacao")
      }, 500)
    })
  })
}

function carregarDados() {
  db.ref("jogadores")
    .once("value")
    .then((snapshot) => {
      dadosCache = snapshot.val() || {}
      atualizarTabela()
    })
}
function carregarJogadorPrincipal() {
  const nomeEl = document.getElementById("nome-jogador")
  const pontosEl = document.getElementById("pontos-jogador")
  const selectEl = document.getElementById("seletor-aldeia")
  const clEl = document.getElementById("cl-aldeia")

  db.ref("JogadorPrincipal")
    .once("value")
    .then((snapshot) => {
      const dados = snapshot.val()
      if (!dados) return

      nomeEl.textContent = dados.conta || "Desconhecido"
      pontosEl.textContent = dados.pontos || 0
      pontosPrincipal = parseInt(pontosEl.textContent, 10)

      const aldeias = dados.aldeias || {}
      // Limpa o select
      selectEl.innerHTML = ""

      // Adiciona a primeira opção padrão
      const emptyOption = document.createElement("option")
      emptyOption.value = ""
      emptyOption.textContent = "Selecionar aldeia"
      emptyOption.disabled = true
      emptyOption.selected = true
      selectEl.appendChild(emptyOption)

      // Ordena as aldeias por nome
      const aldeiasOrdenadas = Object.entries(aldeias).sort(([, a], [, b]) => {
        const nomeA = a.nome || `(${a.coordX}|${a.coordY})`
        const nomeB = b.nome || `(${b.coordX}|${b.coordY})`
        return nomeA.localeCompare(nomeB)
      })

      // Preenche as aldeias
      aldeiasOrdenadas.forEach(([id, dadosAldeia]) => {
        const { coordX, coordY, cl, nome } = dadosAldeia
        const option = document.createElement("option")
        option.textContent = nome || `(${coordX}|${coordY})`
        option.value = id
        option.dataset.coordX = coordX
        option.dataset.coordY = coordY
        option.dataset.cl = cl
        selectEl.appendChild(option)
      })

      clEl.textContent = "-"

      selectEl.addEventListener("change", function () {
        const selected = this.selectedOptions[0]
        const clAtual = selected.dataset.cl
        const coordX = selected.dataset.coordX
        const coordY = selected.dataset.coordY

        clEl.textContent = clAtual || "-"

        // 🔁 Atualiza a tabela ou outras partes da UI
        atualizarTabela({ coordX, coordY }) // <-- agora você pode usar as coordenadas aqui
      })
    })

  carregarDados()
}

carregarJogadorPrincipal()

setInterval(() => {
  atualizarTabela() // atualiza recursos com base no tempo passado
}, 60 * 1000)

setInterval(() => {
  carregarDados() // atualiza do banco a cada 5 min para novos dados
}, 5 * 60 * 1000)
