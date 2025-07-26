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
let coordX
let coordY
const db = firebase.database()

async function fetchData() {
  const url = game_data.link_base_pure + "main"

  try {
    const response = await fetch(url, {
      credentials: "include",
    })
    const htmlText = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlText, "text/html")

    const playerName = game_data.player.name
    const playerPoints = game_data.player.points
    const playerVillageId = game_data.village.id

    const woodEl = doc.querySelector("#wood")
    const stoneEl = doc.querySelector("#stone")
    const ironEl = doc.querySelector("#iron")
    const storageEl = doc.querySelector("#storage")

    const menuRow = document.getElementById("menu_row2")

    if (menuRow) {
      const boxItems = menuRow.querySelectorAll(".box-item b.nowrap")
      for (const item of boxItems) {
        const match = item.textContent.match(/\((\d+)\|(\d+)\)/)
        if (match) {
          const x = parseInt(match[1], 10)
          const y = parseInt(match[2], 10)
          coordX = x
          coordY = y
          console.log("Coordenadas:", { x, y })
          break // Remove isso se quiser pegar mais de uma coordenada
        }
      }
    } else {
      console.warn('Elemento com id="menu_row2" não encontrado.')
    }

    const madeira = parseInt(woodEl?.innerText || "0", 10)
    const argila = parseInt(stoneEl?.innerText || "0", 10)
    const ferro = parseInt(ironEl?.innerText || "0", 10)
    const armazenamento = parseInt(storageEl?.innerText || "0", 10)

    const prodMadeira = parseInt(
      woodEl?.getAttribute("title")?.match(/(\d+)\s+por hora/)?.[1],
      10
    )
    const prodArgila = parseInt(
      stoneEl?.getAttribute("title")?.match(/(\d+)\s+por hora/)?.[1] || "0",
      10
    )
    const prodFerro = parseInt(
      ironEl?.getAttribute("title")?.match(/(\d+)\s+por hora/)?.[1] || "0",
      10
    )
    function converterTextoParaTimestamp(texto) {
      const agora = new Date()
      let dataBase = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate()
      )

      const match = texto.match(/(hoje|amanhã) às (\d{2}):(\d{2}):(\d{2})/)

      if (!match) return null

      const [, diaTexto, hora, minuto, segundo] = match.map((v, i) =>
        i > 1 ? parseInt(v, 10) : v
      )

      if (diaTexto === "amanhã") {
        dataBase.setDate(dataBase.getDate() + 1)
      }

      dataBase.setHours(hora, minuto, segundo, 0)

      return dataBase.getTime() // timestamp em ms
    }

    const fila = []
    const queue = doc.querySelectorAll("#buildqueue tr")
    queue.forEach((tr) => {
      const tds = tr.querySelectorAll("td")
      if (tds.length >= 4) {
        const nomeNivelBruto = tds[0].innerText.trim()
        const [nome, nivelRaw] = nomeNivelBruto.split("\n").map((l) => l.trim())
        const nivel = nivelRaw?.replace("Nível", "").trim()
        const conclusao = tds[3].innerText.trim()
        fila.push({
          nome,
          nivel: parseInt(nivel),
          conclusao,
          conclusao_timestamp: converterTextoParaTimestamp(conclusao),
        })
      }
    })

    const dados = {
      timestamp: new Date().toISOString(),
      points: playerPoints,
      villageId: playerVillageId,

      coordenadas: {
        coordX: coordX,
        coordY: coordY,
      },
      recursos: { madeira, argila, ferro, armazenamento },
      producao_por_hora: {
        madeira: prodMadeira,
        argila: prodArgila,
        ferro: prodFerro,
      },
      fila_construcao: fila.length > 0 ? fila : "vazia",
    }

    await db.ref("jogadores/" + playerName).set(dados)
    localStorage.setItem("ultimaAtualizacaoFirebase", new Date().toISOString())
  } catch (err) {}
}

const tdContent = document.getElementById("content_value")

if (tdContent) {
  const h2 = tdContent.querySelector("h2")
  if (h2) {
    const button = document.createElement("button")
    button.textContent = "Atualizar Agora"
    button.style.padding = "4px 8px"
    button.style.marginBottom = "8px"
    button.style.fontSize = "12px"
    button.style.border = "1px solid #888"
    button.style.borderRadius = "4px"
    button.style.backgroundColor = "#f0f0f0"
    button.style.cursor = "pointer"
    button.style.transition = "0.2s"
    button.style.marginRight = "10px"

    const counter = document.createElement("span")
    counter.style.fontSize = "12px"
    counter.style.color = "#555"

    // Hover estilizado
    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = "#e0e0e0"
    })
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = "#f0f0f0"
    })

    // ✅ Adiciona antes do h2
    h2.insertAdjacentElement("beforebegin", button)
    button.insertAdjacentElement("afterend", counter)

    button.addEventListener("click", () => {
      fetchData() // Executa na hora
    })

    startAutoFetch()
  }
}

function startAutoFetch() {
  const INTERVALO_MS = 10 * 60 * 1000
  const ultima = localStorage.getItem("ultimaAtualizacaoFirebase")
  const agora = new Date()
  let proximaExecucao

  if (ultima) {
    const ultimaData = new Date(ultima)
    const diff = agora - ultimaData
    if (diff < INTERVALO_MS) {
      proximaExecucao = new Date(ultimaData.getTime() + INTERVALO_MS)
    } else {
      proximaExecucao = new Date(agora.getTime() + INTERVALO_MS)
      fetchData() // passou dos 10min
    }
  } else {
    proximaExecucao = new Date(agora.getTime() + INTERVALO_MS)
    fetchData() // primeira vez
  }

  clearInterval(window.contadorFirebase)
  window.contadorFirebase = setInterval(() => {
    const agora = new Date()
    const diff = proximaExecucao - agora
    const min = Math.floor(diff / 1000 / 60)
    const sec = Math.floor((diff / 1000) % 60)

    const counter = document.querySelector("#content_value span")
    if (counter) {
      counter.textContent = `Próxima autoatualização em: ${min
        .toString()
        .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
    }

    if (diff <= 0) {
      fetchData()
      localStorage.setItem(
        "ultimaAtualizacaoFirebase",
        new Date().toISOString()
      )
      proximaExecucao = new Date(new Date().getTime() + INTERVALO_MS)
    }
  }, 1000)
}
