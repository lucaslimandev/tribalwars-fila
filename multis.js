setInterval(() => {
  if (window.location.href.includes("screen=main#")) {
    window.location.href = game_data.link_base_pure + "main"
  }
}, 60000) // 15000 ms = 15 segundos

// Lista de configurações que serão armazenadas no localStorage
const configKeys = [
  "upadorClassico",
  "uparAutomatico",
  "upadorSemi",
  "upadorscript",
  "recursosMissoes",
  "autoColeta",
  "desbloquearColeta",
  "sequenciaMulti",
  "uparFazendaAutomatico",
  "autorecruit",
  "lanca",
  "espada",
  "barbaro",
  "explorador",
  "cavalariaLeve",
  "cavalariaPesada",
  "catapulta",
  "ariete",
]

// Função para obter valores do localStorage ou definir padrão
function getConfig(key, defaultValue) {
  const villageId = game_data.village.id
  const fullKey = `${key}_${villageId}`
  let value = localStorage.getItem(fullKey)
  return value === null ? defaultValue : value === "true"
}

// Função para definir valores no localStorage
function setConfig(key, value) {
  const villageId = game_data.village.id
  const fullKey = `${key}_${villageId}`
  localStorage.setItem(fullKey, value)
}

// Criar botão de configurações
function createMenuButton() {
  let questlog = document.getElementById("questlog_new")
  if (!questlog) return

  let menuButton = document.createElement("div")
  menuButton.id = "configButton"

  menuButton.onclick = () => {
    let menu = document.getElementById("configMenu")
    menu.style.display = menu.style.display === "none" ? "block" : "none"
  }

  questlog.appendChild(menuButton)
}

// Criar menu de configurações com switches
function createConfigMenu() {
  let menu = document.createElement("div")
  menu.id = "configMenu"
  menu.style.display = "none"
  menu.style.position = "fixed"
  menu.style.top = "80px"
  menu.style.right = "10px"
  menu.style.backgroundColor = "#222"
  menu.style.color = "white"
  menu.style.padding = "15px"
  menu.style.borderRadius = "5px"
  menu.style.zIndex = "9999"
  menu.style.fontSize = "14px"
  menu.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.2)"
  menu.style.width = "250px"

  configKeys.forEach((key) => {
    let container = document.createElement("div")
    container.style.display = "flex"
    container.style.justifyContent = "space-between"
    container.style.alignItems = "center"
    container.style.marginBottom = "8px"

    let label = document.createElement("span")
    label.innerText = key.replace(/([A-Z])/g, " $1").trim()
    label.style.flex = "1"

    let switchContainer = document.createElement("label")
    switchContainer.classList.add("switch")

    let toggle = document.createElement("input")
    toggle.type = "checkbox"
    toggle.checked = getConfig(key, true)
    toggle.onchange = () => {
      setConfig(key, toggle.checked)
      window[key] = toggle.checked
      console.log(
        `🔧 ${key} agora está ${toggle.checked ? "ATIVO" : "DESATIVADO"}`
      )
    }

    let slider = document.createElement("span")
    slider.classList.add("slider")

    switchContainer.appendChild(toggle)
    switchContainer.appendChild(slider)

    container.appendChild(label)
    container.appendChild(switchContainer)
    menu.appendChild(container)
  })

  document.body.appendChild(menu)
}

// Criar estilo do botão de configurações e switches
GM_addStyle(`
    #configButton {
        font-size: 9pt;
        font-family: Verdana, Arial;
        width: 25px;
        height: 25px;
        border: 1px solid #603000;
        background-color: #E9D0A9;
        margin: 10px;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        position: relative;
        text-align: center;
        box-shadow: rgba(60, 30, 0, 0.7) 2px 2px 2px;
        border-radius: 3px;
        background-image: url(https://dsbr.innogamescdn.com/asset/95eda994/graphic/quests_new/quest_icon.png);
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 34px;
        height: 20px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 20px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #4CAF50;
    }

    input:checked + .slider:before {
        transform: translateX(14px);
    }
`)

// Criar os elementos na página
createMenuButton()
createConfigMenu()

// Aplicar configurações ao script
configKeys.forEach((key) => {
  window[key] = getConfig(key, true)
})

// Mensagem de log
console.log("⚙️ Auto Up Configurado! Chaves carregadas:", window)

let porcentagemFazenda = 15

if (window.location.href.includes("screen=main")) {
  if (upadorscript) {
    const buildQueue = document.querySelector("#buildqueue")

    // Verifica se o elemento buildQueue existe
    if (buildQueue) {
      // Seleciona todas as linhas <tr> com classes que começam com 'lit' ou 'sortable'
      const buildOrders = buildQueue.querySelectorAll(
        'tr[class^="lit no"], tr[class^="sortable"]'
      )

      // Obtém o tamanho da fila
      const queueSize = buildOrders.length

      // Verifica se a fila está vazia
      if (queueSize > 0) {
        console.log(`Tamanho da fila de construções: ${queueSize}`)

        // Executa uma ação se o tamanho da fila for maior que 5
        if (queueSize < 4) {
          // Ação a ser executada
          construir()
        }
      } else {
      }
    } else {
      console.log("nãoexiste")
      construir()
    }
  }

  if (recursosMissoes) {
    // Define o intervalo de tempo em milissegundos (15 minutos = 900000 milissegundos)
    const interval = 0.5 * 60 * 1000

    // Função para atualizar a página
    function reloadPage() {
      $(document).ready(function () {
        var $questDiv = $("#new_quest")
        if ($questDiv.length) {
          $questDiv.click()

          setTimeout(function () {
            var $link = $('a.tab-link[data-tab="reward-tab"]')
            if ($link.length) {
              $link.click()

              function processButton() {
                // Seleciona todos os botões individuais de reivindicação
                var $claimButtons = $(
                  "a.btn.btn-confirm-yes.reward-system-claim-button"
                )
                if ($claimButtons.length === 0) {
                  console.log(
                    "Não há mais botões para clicar ou todos já foram reivindicados."
                  )
                  $(".popup_box_close.tooltip-delayed").click()
                  return
                }

                // Flag para verificar se algum botão foi clicado
                var buttonClicked = false

                // Itera sobre cada botão de reivindicação individual
                $claimButtons.each(function () {
                  var $button = $(this)
                  var $column = $button.closest("td") // Assume que o botão está dentro de uma célula de tabela

                  // Procura pelo aviso apenas na coluna do botão atual
                  var $warning = $column.find("span.small.warn")
                  if ($warning.length) {
                    console.log(
                      "Aviso encontrado na coluna, ação cancelada para este botão."
                    )
                  } else {
                    $button.click()
                    console.log("Botão reivindicado.")
                    buttonClicked = true
                    return false // Sai do loop each após clicar no botão
                  }
                })

                if (!buttonClicked) {
                  console.log(
                    "Todos os botões processados ou ação cancelada devido ao aviso."
                  )
                  $(".popup_box_close.tooltip-delayed").click()
                } else {
                  // Espera 2 segundos para verificar o próximo botão
                  setTimeout(processButton, 2000)
                }
              }

              // Inicia o processo com um pequeno atraso para garantir que a página esteja completamente carregada
              setTimeout(processButton, 1000)
            } else {
              console.error("Elemento não encontrado!")
            }
          }, 2000)
        } else {
          console.error("Elemento não encontrado!")
        }
      })
    }
    function reloadPage2() {
      location.reload()
    }
    // Configura o temporizador para atualizar a página a cada 15 minutos
    setTimeout(reloadPage, interval)
    setTimeout(reloadPage2, interval * 10)
  }

  function construir() {
    if (uparFazendaAutomatico) {
      if (typeof jQuery == "undefined") {
        var script = document.createElement("script")
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js"
        document.getElementsByTagName("head")[0].appendChild(script)
      }
      function verificarEOcupar() {
        var ocupacao = parseInt($("#pop_current_label").text())
        var total = parseInt($("#pop_max_label").text())
        var porcentagemDisponivel = ((total - ocupacao) / total) * 100
        console.log(
          "Porcentagem disponível: " + porcentagemDisponivel.toFixed(2) + "%"
        )

        if (porcentagemDisponivel < porcentagemFazenda) {
          var farmRow = $("#main_buildrow_farm")
          var recursosComWarn = farmRow.find('td[class*="warn"]')
          var construindoFarm = $("#buildqueue .buildorder_farm")

          if (recursosComWarn.length > 0) {
            console.log(
              "Não pode construir, um ou mais recursos estão com aviso."
            )
          } else if (construindoFarm.length > 0) {
            console.log("Não pode construir, já há uma fazenda em construção.")
          } else {
            var buildLink = farmRow.find(
              'a.btn.btn-build[data-building="farm"]'
            )
            if (buildLink.length > 0) {
              buildLink[0].click()
              console.log(
                "Cliquei no link de construção do nível: " +
                  buildLink.attr("data-level-next")
              )
            } else {
              console.log("Nenhum link de construção encontrado.")
            }
          }
        } else {
          console.log("A porcentagem disponível é suficiente.")
          fazendaDisponivel()
        }
      }

      verificarEOcupar()
    }
    function fazendaDisponivel() {
      if (upadorSemi) {
        if (/*window.location.href.includes("screen=main"*/ true) {
          ;("use strict")
          let buildingObject
          let selection
          let scriptStatus = false // false == script not running, true == script running
          let isBuilding = false // Prevents sending multiple orders of the same building. false == building can be built

          class BQueue {
            constructor(bQueue, bQueueLength) {
              this.buildingQueue = bQueue
              this.buildingQueueLength = bQueueLength
            }
            add(building, display) {
              this.buildingQueue.push(building)
              if (display) {
                let ele = document.createElement("tr")
                ele.innerHTML = `<td>${building}</td>
                  <td class="delete-icon-large hint-toggle float_left"></td>`
                ele.addEventListener("click", () => {
                  this.removeBuilding(ele)
                })
                document.getElementById("autoBuilderTable").appendChild(ele)
              }
            }
            /**
             * Appends buildings to a table
             * @param {DOM element} parent The element (table) where the buildings should be appended to.
             */
            display(parent) {
              this.buildingQueue.forEach((building) => {
                let ele = document.createElement("tr")
                ele.innerHTML = `<td>${building}</td>
                  <td class="delete-icon-large hint-toggle float_left"></td>`
                ele.addEventListener("click", () => {
                  this.removeBuilding(ele)
                })
                parent.appendChild(ele)
              })
            }
            removeBuilding(ele) {
              this.buildingQueue.splice(ele.rowIndex - 3, 1)
              ele.remove()
              localStorage.buildingObject = JSON.stringify(buildingObject)
            }
          }

          init()

          function init() {
            const putEleBefore = document.getElementById("content_value")
            let newDiv = document.createElement("div")
            const selectBuildingHtml =
              '<td><select id="selectBuildingHtml"> ' +
              '<option value="main">Headquarters</option> ' +
              '<option value="barracks">Barracks</option> ' +
              '<option value="stable">Stable</option> ' +
              '<option value="garage">Workshop</option> ' +
              '<option value="watchtower">Watchtower</option> ' +
              '<option value="smith">Smithy</option> ' +
              '<option value="market">Market</option> ' +
              '<option value="wood">Timber Camp</option> ' +
              '<option value="stone">Clay Pit</option> ' +
              '<option value="iron">Iron Mine</option> ' +
              '<option value="farm">Farm</option> ' +
              '<option value="storage">Warehouse</option> ' +
              '<option value="hide">Hiding Place</option> ' +
              '<option value="wall">Wall</option> ' +
              "</select></td>"
            let newTable = `<table id="autoBuilderTable">
                  <tr>
                  <td><button id="startBuildingScript" class="btn">Start</button></td>
                  </tr>
                  <tr>
                  <td>Queue length:</td>
                  <td><input id='queueLengthInput' style='width:30px'></td>
                  <td><button id='queueLengthBtn' class='btn'>OK</button></td>
                  <td><span id='queueText'></span></td>
                  </tr>
                  <tr>
                  <td>Building</td>
                  ${selectBuildingHtml}
                  <td><button id='addBuilding' class='btn'>Add</button></td>
                  </tr>
                  </table>`

            newDiv.innerHTML = newTable
            putEleBefore.parentElement.parentElement.insertBefore(
              newDiv,
              putEleBefore.parentElement
            )

            selection = document.getElementById("selectBuildingHtml")
            let premiumBQueueLength = game_data.features.Premium.active ? 5 : 2

            // Checks if localStorage exists
            if (localStorage.buildingObject) {
              // Checks if village exists in localStorage
              if (
                JSON.parse(localStorage.buildingObject)[game_data.village.id]
              ) {
                let newBqueue = JSON.parse(localStorage.buildingObject)[
                  game_data.village.id
                ]
                buildingObject = new BQueue(
                  newBqueue.buildingQueue,
                  newBqueue.buildingQueueLength
                ) // Save stored BQueue in new BQueue
                document.getElementById("queueLengthInput").value =
                  buildingObject.buildingQueueLength
                // Add each building in the BQueue to the actual queue
                buildingObject.buildingQueue.forEach((b) => {
                  addBuilding(b)
                })
              }
              // Else create empty village and add into localStorage
              else {
                buildingObject = new BQueue([], premiumBQueueLength)
                document.getElementById("queueLengthInput").value =
                  premiumBQueueLength
                let setLocalStorage = JSON.parse(localStorage.buildingObject)
                setLocalStorage[game_data.village.id] = buildingObject
                localStorage.buildingObject = JSON.stringify(setLocalStorage)
              }
            }
            // Else create new object
            else {
              buildingObject = new BQueue([], premiumBQueueLength)
              let newLocalStorage = { [game_data.village.id]: buildingObject }
              localStorage.buildingObject = JSON.stringify(newLocalStorage)
            }

            eventListeners()

            if (localStorage.scriptStatus) {
              scriptStatus = JSON.parse(localStorage.scriptStatus)
              if (scriptStatus) {
                document.getElementById("startBuildingScript").innerText =
                  "Stop"
                startScript()
              }
            }
          }

          function startScript() {
            let currentBuildLength = 0
            if (document.getElementById("buildqueue")) {
              currentBuildLength =
                document.getElementById("buildqueue").rows.length - 2
            }
            setInterval(function () {
              let btn = document.querySelector(".btn-instant-free")
              if (btn && btn.style.display != "none") {
                btn.click()
              }
              if (buildingObject.buildingQueue.length !== 0) {
                let building = buildingObject.buildingQueue[0]
                let wood = parseInt(document.getElementById("wood").textContent)
                let stone = parseInt(
                  document.getElementById("stone").textContent
                )
                let iron = parseInt(document.getElementById("iron").textContent)
                let woodCost = 9999999
                let stoneCost = 9999999
                let ironCost = 9999999

                try {
                  woodCost = parseInt(
                    document
                      .querySelector(
                        "#main_buildrow_" + building + " > .cost_wood"
                      )
                      .getAttribute("data-cost")
                  )
                  stoneCost = parseInt(
                    document
                      .querySelector(
                        "#main_buildrow_" + building + " > .cost_stone"
                      )
                      .getAttribute("data-cost")
                  )
                  ironCost = parseInt(
                    document
                      .querySelector(
                        "#main_buildrow_" + building + " > .cost_iron"
                      )
                      .getAttribute("data-cost")
                  )
                } catch (e) {
                  console.log("Error getting building cost")
                }

                if (document.getElementById("buildqueue")) {
                  currentBuildLength =
                    document.getElementById("buildqueue").rows.length - 2
                }
                if (
                  currentBuildLength < buildingObject.buildingQueueLength &&
                  !isBuilding &&
                  scriptStatus &&
                  wood >= woodCost &&
                  stone >= stoneCost &&
                  iron >= ironCost
                ) {
                  isBuilding = true
                  console.log("Sending build order for " + building)
                  setTimeout(function () {
                    buildBuilding(building)
                  }, Math.floor(Math.random() * 500 + 1000))
                }
              }
            }, 1000)
          }

          function addBuilding(building) {
            let ele = document.createElement("tr")
            ele.innerHTML = `<td>${building}</td>
                  <td class="delete-icon-large hint-toggle float_left" style="cursor:pointer"></td>`
            ele.childNodes[2].addEventListener("click", function () {
              removeBuilding(ele)
            })
            document.getElementById("autoBuilderTable").appendChild(ele)
          }

          /**
           * Removes the row of the building that should be removed. -3 because there are three other rows in the table
           * @param {DOM} ele table row of building queue to be removed
           */
          function removeBuilding(ele) {
            buildingObject.buildingQueue.splice(ele.rowIndex - 3, 1)
            let setLocalStorage = JSON.parse(localStorage.buildingObject)
            setLocalStorage[game_data.village.id] = buildingObject
            localStorage.buildingObject = JSON.stringify(setLocalStorage)
            ele.remove()
          }

          function buildBuilding(building) {
            let data = {
              id: building,
              force: 1,
              destroy: 0,
              source: game_data.village.id,
              h: game_data.csrf,
            }
            let url =
              "/game.php?village=" +
              game_data.village.id +
              "&screen=main&ajaxaction=upgrade_building&type=main&"
            $.ajax({
              url: url,
              type: "post",
              data: data,
              headers: {
                Accept: "application/json, text/javascript, /; q=0.01",
                "TribalWars-Ajax": 1,
              },
            })
              .done(function (r) {
                let response = JSON.parse(r)
                if (response.error) {
                  UI.ErrorMessage(response.error[0])
                  console.error(response.error[0])
                } else if (response.response.success) {
                  UI.SuccessMessage(response.response.success)
                  console.log(response.response.success)
                  // TODO: might cause issues because of async
                  buildingObject.buildingQueue.splice(0, 1)
                  let setLocalStorage = JSON.parse(localStorage.buildingObject)
                  setLocalStorage[game_data.village.id] = buildingObject
                  localStorage.buildingObject = JSON.stringify(setLocalStorage)
                  document.querySelector("#autoBuilderTable > tr").remove()
                  setTimeout(() => {
                    window.location.reload()
                  }, Math.floor(Math.random() * 50 + 500))
                }
              })
              .fail(function () {
                UI.ErrorMessage(
                  "Something bad happened. Please contact FunnyPocketBook#9373"
                )
                console.log(
                  "Something bad happened. Please contact FunnyPocketBook#9373"
                )
              })
              .always(function () {
                isBuilding = false
              })
          }

          function eventListeners() {
            // #region Query
            // Enter triggers OK for "Queue length"
            document
              .getElementById("queueLengthInput")
              .addEventListener(
                "keydown",
                clickOnKeyPress.bind(this, 13, "#queueLengthBtn")
              )

            // Saves query length
            document
              .getElementById("queueLengthBtn")
              .addEventListener("click", function () {
                let qLength = parseInt(
                  document.getElementById("queueLengthInput").value
                )
                if (Number.isNaN(qLength)) {
                  qLength = 2
                }
                if (!game_data.features.Premium.active && qLength > 2) {
                  buildingObject.buildingQueueLength = 2
                } else {
                  buildingObject.buildingQueueLength = qLength
                }
                let setLocalStorage = JSON.parse(localStorage.buildingObject)
                setLocalStorage[game_data.village.id] = buildingObject
                localStorage.buildingObject = JSON.stringify(setLocalStorage)
                if (!game_data.features.Premium.active && qLength > 2) {
                  document.getElementById("queueText").innerHTML =
                    " Premium account not active, queue length set to 2."
                } else if (parseInt(buildingObject.buildingQueueLength) > 5) {
                  document.getElementById("queueText").innerHTML =
                    " Queue length set to " +
                    buildingObject.buildingQueueLength +
                    ". There will be additional costs for more than 5 constructions in the queue"
                } else {
                  document.getElementById("queueText").innerHTML =
                    " Queue length set to " + buildingObject.buildingQueueLength
                }
                document.getElementById("queueLengthInput").value =
                  buildingObject.buildingQueueLength
              })
            // #endregion Query

            // #region Building
            document
              .getElementById("addBuilding")
              .addEventListener("click", function () {
                let b = selection.options[selection.selectedIndex].value
                buildingObject.buildingQueue.push(
                  selection.options[selection.selectedIndex].value
                )
                let setLocalStorage = JSON.parse(localStorage.buildingObject)
                setLocalStorage[game_data.village.id] = buildingObject
                localStorage.buildingObject = JSON.stringify(setLocalStorage)
                addBuilding(b)
              })
            document
              .getElementById("startBuildingScript")
              .addEventListener("click", function () {
                if (
                  document.getElementById("startBuildingScript").innerText ===
                  "Start"
                ) {
                  document.getElementById("startBuildingScript").innerText =
                    "Stop"
                  scriptStatus = true
                  localStorage.scriptStatus = JSON.stringify(scriptStatus)
                  startScript()
                } else {
                  document.getElementById("startBuildingScript").innerText =
                    "Start"
                  scriptStatus = false
                  localStorage.scriptStatus = JSON.stringify(scriptStatus)
                }
              })
            // #endregion Building
          }

          /**
           * Triggers a click on a keypress
           * @param {int} key key that has been pressed
           * @param {string} selector CSS selector of the element that is to be triggered
           */
          function clickOnKeyPress(key, selector) {
            "use strict"
            if (event.defaultPrevented) {
              return // Should do nothing if the default action has been cancelled
            }
            let handled = false
            if (event.key === key) {
              document.querySelector(selector).click()
              handled = true
            } else if (event.keyIdentifier === key) {
              document.querySelector(selector).click()
              handled = true
            } else if (event.keyCode === key) {
              document.querySelector(selector).click()
              handled = true
            }
            if (handled) {
              event.preventDefault()
            }
          }
        }
      }
      if (uparAutomatico) {
        if (upadorClassico) {
          if (true) {
            //*************************** CONFIGURAÇÃO ***************************//
            // Escolha Tempo de espera mínimo e máximo entre ações (em milissegundos)
            const Min_Tempo_Espera = 800000
            const Max_Tempo_Espera = 900000

            // Etapa_1: Upar O bot automaticamente em Série Edificios
            const Etapa = "Etapa_1"

            // Escolha se você deseja que o bot enfileire os edifícios na ordem definida (= true) ou
            // assim que um prédio estiver disponível para a fila de construção (= false)
            const Construção_Edificios_Ordem = true

            //*************************** /CONFIGURAÇÃO ***************************//

            // Constantes (NÃO DEVE SER ALTERADAS)
            const Visualização_Geral = "OVERVIEW_VIEW"
            const Edificio_Principal = "HEADQUARTERS_VIEW"

            ;(function () {
              "use strict"

              console.log("-- Script do Tribal Wars ativado --")

              if (Etapa == "Etapa_1") {
                executarEtapa1()
              }
            })()

            // Etapa 1: Construção
            function executarEtapa1() {
              let Evoluir_vilas = getEvoluir_vilas()
              console.log(Evoluir_vilas)
              if (Evoluir_vilas == Edificio_Principal) {
                setInterval(function () {
                  // construir qualquer edificio custeável, se possível
                  Proxima_Construção()
                }, 1000)
              } else if (Evoluir_vilas == Visualização_Geral) {
                // Visualização Geral PG
                document
                  .getElementById("l_main")
                  .children[0].children[0].click()
              }
            }

            let delay = Math.floor(
              Math.random() * (Max_Tempo_Espera - Max_Tempo_Espera) +
                Min_Tempo_Espera
            )

            // Ação do processo
            let Evoluir_vilas = getEvoluir_vilas()
            console.log(Evoluir_vilas)
            setTimeout(function () {
              if (Evoluir_vilas == Edificio_Principal) {
                // construir qualquer edificio custeável, se possível
                Proxima_Construção()
              } else if (Evoluir_vilas == Visualização_Geral) {
                // Visualização Geral Pag
                document
                  .getElementById("l_main")
                  .children[0].children[0].click()
              }
            }, delay)

            function getEvoluir_vilas() {
              let currentUrl = window.location.href
              if (currentUrl.endsWith("Visualização Geral")) {
                return Visualização_Geral
              } else if (currentUrl.endsWith("main")) {
                return Edificio_Principal
              }
            }

            function Proxima_Construção() {
              let Construção_proximo_edificio = getConstrução_proximo_edificio()
              if (Construção_proximo_edificio !== undefined) {
                Construção_proximo_edificio.click()
                console.log("Clicked on " + Construção_proximo_edificio)
              }
            }

            function getConstrução_proximo_edificio() {
              let Clicar_Upar_Edificos =
                document.getElementsByClassName("btn btn-build")
              let Construção_Edifcios_Serie = getConstrução_Edifcios_Serie()
              let instituir
              while (
                instituir === undefined &&
                Construção_Edifcios_Serie.length > 0
              ) {
                var proximo = Construção_Edifcios_Serie.shift()
                if (Clicar_Upar_Edificos.hasOwnProperty(proximo)) {
                  let próximo_edifício = document.getElementById(proximo)
                  var Visivel =
                    próximo_edifício.offsetWidth > 0 ||
                    próximo_edifício.offsetHeight > 0
                  if (Visivel) {
                    instituir = próximo_edifício
                  }
                  if (Construção_Edificios_Ordem) {
                    break
                  }
                }
              }
              return instituir
            }

            function getConstrução_Edifcios_Serie() {
              var Sequência_Construção = []

              // Ordem de Construção Atualizada

              Sequência_Construção.push("main_buildlink_main_1") // Edifício principal +1 (Nível 1) 510 pontos
              Sequência_Construção.push("main_buildlink_wood_1") // Bosque +1 (Nível 1) 2040 pontos
              Sequência_Construção.push("main_buildlink_stone_1") // Poço de argila +1 (Nível 1) 3046 pontos
              Sequência_Construção.push("main_buildlink_iron_1") // Mina de ferro +1 (Nível 1) 4052 pontos
              Sequência_Construção.push("main_buildlink_wood_2") // Bosque +1 (Nível 2) 4153 pontos
              Sequência_Construção.push("main_buildlink_stone_2") // Poço de argila +1 (Nível 2) 4254 pontos
              Sequência_Construção.push("main_buildlink_farm_1") // Fazenda +1 (Nível 1) 4259 pontos
              Sequência_Construção.push("main_buildlink_storage_1") // Armazém +1 (Nível 1) 4265 pontos
              Sequência_Construção.push("main_buildlink_farm_2") // Fazenda +1 (Nível 2) 4266 pontos
              Sequência_Construção.push("main_buildlink_storage_2") // Armazém +1 (Nível 2) 4267 pontos
              Sequência_Construção.push("main_buildlink_wood_3") // Bosque +1 (Nível 3) 4369 pontos
              Sequência_Construção.push("main_buildlink_stone_3") // Poço de argila +1 (Nível 3) 4571 pontos
              Sequência_Construção.push("main_buildlink_iron_2") // Mina de ferro +1 (Nível 2) 4772 pontos
              Sequência_Construção.push("main_buildlink_main_2") // Edifício principal +1 (Nível 2) 4874 pontos
              Sequência_Construção.push("main_buildlink_main_3") // Edifício principal +1 (Nível 3) 4976 pontos
              Sequência_Construção.push("main_buildlink_barracks_1") // Quartel +1 (Nível 1) 5692 pontos
              Sequência_Construção.push("main_buildlink_market_1") // Mercado +1 (Nível 1) 76102 pontos
              Sequência_Construção.push("main_buildlink_barracks_2") // Quartel +1 (Nível 2) 77105 pontos
              Sequência_Construção.push("main_buildlink_barracks_3") // Quartel +1 (Nível 3) 79109 pontos
              Sequência_Construção.push("main_buildlink_statue_1") // Estátua +1 (Nível 1) 1534 pontos
              Sequência_Construção.push("main_buildlink_iron_3") // Mina de ferro +1 (Nível 3) 81111 pontos
              Sequência_Construção.push("main_buildlink_wood_4") // Bosque +1 (Nível 4) 82112 pontos
              Sequência_Construção.push("main_buildlink_stone_4") // Poço de argila +1 (Nível 4) 84113 pontos
              Sequência_Construção.push("main_buildlink_wall_1") // Muralha +1 (Nível 1) 89121 pontos
              Sequência_Construção.push("main_buildlink_wall_2") // Muralha +1 (Nível 2) 90123 pontos
              Sequência_Construção.push("main_buildlink_storage_3") // Armazém +1 (Nível 3) 90125 pontos
              Sequência_Construção.push("main_buildlink_storage_4") // Armazém +1 (Nível 4) 90126 pontos
              Sequência_Construção.push("main_buildlink_wood_5") // Bosque +1 (Nível 5) 91128 pontos
              Sequência_Construção.push("main_buildlink_stone_5") // Poço de argila +1 (Nível 5) 93130 pontos
              Sequência_Construção.push("main_buildlink_market_2") // Mercado +1 (Nível 2) 96132 pontos
              Sequência_Construção.push("main_buildlink_wood_6") // Bosque +1 (Nível 6) 97135 pontos
              Sequência_Construção.push("main_buildlink_stone_6") // Poço de argila +1 (Nível 6) 99138 pontos
              Sequência_Construção.push("main_buildlink_wood_7") // Bosque +1 (Nível 7) 101141 pontos
              Sequência_Construção.push("main_buildlink_stone_7") // Poço de argila +1 (Nível 7) 104144 pontos
              Sequência_Construção.push("main_buildlink_iron_4") // Mina de ferro +1 (Nível 4) 106145 pontos
              Sequência_Construção.push("main_buildlink_iron_5") // Mina de ferro +1 (Nível 5) 109147 pontos
              Sequência_Construção.push("main_buildlink_iron_6") // Mina de ferro +1 (Nível 6) 112150 pontos
              Sequência_Construção.push("main_buildlink_wood_8") // Bosque +1 (Nível 8) 114153 pontos
              Sequência_Construção.push("main_buildlink_stone_8") // Poço de argila +1 (Nível 8) 117156 pontos
              Sequência_Construção.push("main_buildlink_iron_7") // Mina de ferro +1 (Nível 7) 121159 pontos
              Sequência_Construção.push("main_buildlink_wood_9") // Bosque +1 (Nível 9) 123164 pontos
              Sequência_Construção.push("main_buildlink_stone_9") // Poço de argila +1 (Nível 9) 127169 pontos
              Sequência_Construção.push("main_buildlink_wood_10") // Bosque +1 (Nível 10) 129174 pontos
              Sequência_Construção.push("main_buildlink_stone_10") // Poço de argila +1 (Nível 10) 133179 pontos
              Sequência_Construção.push("main_buildlink_main_4") // Edifício principal +1 (Nível 4) 134182 pontos
              Sequência_Construção.push("main_buildlink_main_5") // Edifício principal +1 (Nível 5) 135186 pontos
              Sequência_Construção.push("main_buildlink_smith_1") // Ferreiro +1 (Nível 1) 155205 pontos
              Sequência_Construção.push("main_buildlink_storage_5") // Armazém +1 (Nível 5) 155207 pontos
              Sequência_Construção.push("main_buildlink_storage_6") // Armazém +1 (Nível 6) 155210 pontos
              Sequência_Construção.push("main_buildlink_wood_11") // Bosque +1 (Nível 11) 158216 pontos
              Sequência_Construção.push("main_buildlink_stone_11") // Poço de argila +1 (Nível 11) 162222 pontos
              Sequência_Construção.push("main_buildlink_iron_8") // Mina de ferro +1 (Nível 8) 166225 pontos
              Sequência_Construção.push("main_buildlink_storage_7") // Armazém +1 (Nível 7) 166228 pontos
              Sequência_Construção.push("main_buildlink_farm_3") // Fazenda +1 (Nível 3) 166229 pontos
              Sequência_Construção.push("main_buildlink_stone_12") // Poço de argila +1 (Nível 12) 174245 pontos
              Sequência_Construção.push("main_buildlink_wood_12") // Bosque +1 (Nível 12) 169237 pontos
              Sequência_Construção.push("main_buildlink_iron_9") // Mina de ferro +1 (Nível 9) 179250 pontos
              Sequência_Construção.push("main_buildlink_iron_10") // Mina de ferro +1 (Nível 10) 195274 pontos
              Sequência_Construção.push("main_buildlink_storage_8") // Armazém +1 (Nível 8) 179253 pontos
              Sequência_Construção.push("main_buildlink_wood_13") // Bosque +1 (Nível 13) 183261 pontos
              Sequência_Construção.push("main_buildlink_stone_13") // Poço de argila +1 (Nível 13) 189269 pontos
              Sequência_Construção.push("main_buildlink_stone_14") // Poço de argila +1 (Nível 14) 207301 pontos
              Sequência_Construção.push("main_buildlink_storage_9") // Armazém +1 (Nível 9) 195279 pontos
              Sequência_Construção.push("main_buildlink_wood_14") // Bosque +1 (Nível 14) 200290 pontos
              Sequência_Construção.push("main_buildlink_storage_10") // Armazém +1 (Nível 10) 214312 pontos
              Sequência_Construção.push("main_buildlink_barracks_4") // Quartel +1 (Nível 4) 227334 pontos
              Sequência_Construção.push("main_buildlink_barracks_5") // Quartel +1 (Nível 5) 229339 pontos
              Sequência_Construção.push("main_buildlink_farm_4") // Fazenda +1 (Nível 4) 229341 pontos
              Sequência_Construção.push("main_buildlink_farm_5") // Fazenda +1 (Nível 5) 229342 pontos
              Sequência_Construção.push("main_buildlink_wall_3") // Muralha +1 (Nível 3) 230344 pontos
              Sequência_Construção.push("main_buildlink_wall_4") // Muralha +1 (Nível 4) 231346 pontos
              Sequência_Construção.push("main_buildlink_wall_5") // Muralha +1 (Nível 5) 232349 pontos
              Sequência_Construção.push("main_buildlink_market_3") // Mercado +1 (Nível 3) 274390 pontos
              Sequência_Construção.push("main_buildlink_farm_6") // Fazenda +1 (Nível 6) 293443 pontos
              Sequência_Construção.push("main_buildlink_wood_15") // Bosque +1 (Nível 15) 298456 pontos
              Sequência_Construção.push("main_buildlink_iron_11") // Mina de ferro +1 (Nível 11) 214307 pontos
              Sequência_Construção.push("main_buildlink_iron_12") // Mina de ferro +1 (Nível 12) 222320 pontos
              Sequência_Construção.push("main_buildlink_iron_13") // Mina de ferro +1 (Nível 13) 242357 pontos
              Sequência_Construção.push("main_buildlink_iron_14") // Mina de ferro +1 (Nível 14) 253368 pontos
              Sequência_Construção.push("main_buildlink_main_6") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_7") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_8") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_9") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_10") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_11") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_12") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_stone_15") // Poço de argila +1 (Nível 15) 306469 pontos
              Sequência_Construção.push("main_buildlink_market_4") // Mercado +1 (Nível 4) 314482 pontos
              Sequência_Construção.push("main_buildlink_market_5") // Mercado +1 (Nível 5) 319486 pontos
              Sequência_Construção.push("main_buildlink_wood_16") // Bosque +1 (Nível 16) 324501 pontos
              Sequência_Construção.push("main_buildlink_stone_16") // Poço de argila +1 (Nível 16) 332516 pontos
              Sequência_Construção.push("main_buildlink_storage_11") // Armazém +1 (Nível 11) 332522 pontos
              Sequência_Construção.push("main_buildlink_storage_12") // Armazém +1 (Nível 12) 336542 pontos
              Sequência_Construção.push("main_buildlink_wood_17") // Bosque +1 (Nível 17) 343561 pontos
              Sequência_Construção.push("main_buildlink_stone_17") // Poço de argila +1 (Nível 17) 353580 pontos
              Sequência_Construção.push("main_buildlink_iron_15") // Mina de ferro +1 (Nível 15) 366593 pontos
              Sequência_Construção.push("main_buildlink_wood_18") // Bosque +1 (Nível 18) 374615 pontos
              Sequência_Construção.push("main_buildlink_stone_18") // Poço de argila +1 (Nível 18) 386637 pontos
              Sequência_Construção.push("main_buildlink_iron_16") // Mina de ferro +1 (Nível 16) 401652 pontos
              Sequência_Construção.push("main_buildlink_wood_19") // Bosque +1 (Nível 19) 410679 pontos
              Sequência_Construção.push("main_buildlink_stone_19") // Poço de argila +1 (Nível 19) 423706 pontos
              Sequência_Construção.push("main_buildlink_iron_17") // Mina de ferro +1 (Nível 17) 441725 pontos
              Sequência_Construção.push("main_buildlink_wood_20") // Bosque +1 (Nível 20) 451757 pontos
              Sequência_Construção.push("main_buildlink_stone_20") // Poço de argila +1 (Nível 20) 466789 pontos
              Sequência_Construção.push("main_buildlink_storage_13") // Armazém +1 (Nível 13) 466797 pontos
              Sequência_Construção.push("main_buildlink_storage_14") // Armazém +1 (Nível 14) 466808 pontos
              Sequência_Construção.push("main_buildlink_storage_15") // Armazém +1 (Nível 15) 466821 pontos
              Sequência_Construção.push("main_buildlink_main_13") // Edifício principal +1 (Nível 13) 471836 pontos
              Sequência_Construção.push("main_buildlink_main_14") // Edifício principal +1 (Nível 14) 476854 pontos
              Sequência_Construção.push("main_buildlink_main_15") // Edifício principal +1 (Nível 15) 483875 pontos
              Sequência_Construção.push("main_buildlink_wood_21") // Bosque +1 (Nível 21) 495913 pontos
              Sequência_Construção.push("main_buildlink_stone_21") // Poço de argila +1 (Nível 21) 511951 pontos
              Sequência_Construção.push("main_buildlink_iron_18") // Mina de ferro +1 (Nível 18) 532973 pontos
              Sequência_Construção.push("main_buildlink_farm_7") // Fazenda +1 (Nível 7) 532976 pontos
              Sequência_Construção.push("main_buildlink_wood_22") // Bosque +1 (Nível 22) 5461022 pontos
              Sequência_Construção.push("main_buildlink_stone_22") // Poço de argila +1 (Nível 22) 5661068 pontos
              Sequência_Construção.push("main_buildlink_iron_19") // Mina de ferro +1 (Nível 19) 5911095 pontos
              Sequência_Construção.push("main_buildlink_farm_8") // Fazenda +1 (Nível 8) 5911098 pontos
              Sequência_Construção.push("main_buildlink_wood_23") // Bosque +1 (Nível 23) 6071153 pontos
              Sequência_Construção.push("main_buildlink_stone_23") // Poço de argila +1 (Nível 23) 6291208 pontos
              Sequência_Construção.push("main_buildlink_iron_20") // Mina de ferro +1 (Nível 20) 6571240 pontos
              Sequência_Construção.push("main_buildlink_storage_16") // Armazém +1 (Nível 16) 6571255 pontos
              Sequência_Construção.push("main_buildlink_main_16") // Edifício principal +1 (Nível 16) 6651281 pontos
              Sequência_Construção.push("main_buildlink_main_17") // Edifício principal +1 (Nível 17) 6741312 pontos
              Sequência_Construção.push("main_buildlink_storage_17") // Armazém +1 (Nível 17) 6741331 pontos
              Sequência_Construção.push("main_buildlink_main_18") // Edifício principal +1 (Nível 18) 6841368 pontos
              Sequência_Construção.push("main_buildlink_storage_18") // Armazém +1 (Nível 18) 6841390 pontos
              Sequência_Construção.push("main_buildlink_main_19") // Edifício principal +1 (Nível 19) 6961434 pontos
              Sequência_Construção.push("main_buildlink_farm_9") // Fazenda +1 (Nível 9) 6961437 pontos
              Sequência_Construção.push("main_buildlink_storage_19") // Armazém +1 (Nível 19) 6961464 pontos
              Sequência_Construção.push("main_buildlink_main_20") // Edifício principal +1 (Nível 20) 7111517 pontos
              Sequência_Construção.push("main_buildlink_farm_10") // Fazenda +1 (Nível 10) 7111522 pontos
              Sequência_Construção.push("main_buildlink_storage_20") // Armazém +1 (Nível 20) 7111554 pontos

              return Sequência_Construção
            }
          }
        } else {
          if (sequenciaMulti) {
            //*************************** CONFIGURAÇÃO ***************************//
            // Escolha Tempo de espera mínimo e máximo entre ações (em milissegundos)
            const Min_Tempo_Espera = 800000
            const Max_Tempo_Espera = 900000

            // Etapa_1: Upar O bot automaticamente em Série Edificios
            const Etapa = "Etapa_1"

            // Escolha se você deseja que o bot enfileire os edifícios na ordem definida (= true) ou
            // assim que um prédio estiver disponível para a fila de construção (= false)
            const Construção_Edificios_Ordem = true

            //*************************** /CONFIGURAÇÃO ***************************//

            // Constantes (NÃO DEVE SER ALTERADAS)
            const Visualização_Geral = "OVERVIEW_VIEW"
            const Edificio_Principal = "HEADQUARTERS_VIEW"

            ;(function () {
              "use strict"

              console.log("-- Script do Tribal Wars ativado --")

              if (Etapa == "Etapa_1") {
                executarEtapa1()
              }
            })()

            // Etapa 1: Construção
            function executarEtapa1() {
              let Evoluir_vilas = getEvoluir_vilas()
              console.log(Evoluir_vilas)
              if (Evoluir_vilas == Edificio_Principal) {
                setInterval(function () {
                  // construir qualquer edificio custeável, se possível
                  Proxima_Construção()
                }, 1000)
              } else if (Evoluir_vilas == Visualização_Geral) {
                // Visualização Geral PG
                document
                  .getElementById("l_main")
                  .children[0].children[0].click()
              }
            }

            let delay = Math.floor(
              Math.random() * (Max_Tempo_Espera - Max_Tempo_Espera) +
                Min_Tempo_Espera
            )

            // Ação do processo
            let Evoluir_vilas = getEvoluir_vilas()
            console.log(Evoluir_vilas)
            setTimeout(function () {
              if (Evoluir_vilas == Edificio_Principal) {
                // construir qualquer edificio custeável, se possível
                Proxima_Construção()
              } else if (Evoluir_vilas == Visualização_Geral) {
                // Visualização Geral Pag
                document
                  .getElementById("l_main")
                  .children[0].children[0].click()
              }
            }, delay)

            function getEvoluir_vilas() {
              let currentUrl = window.location.href
              if (currentUrl.endsWith("Visualização Geral")) {
                return Visualização_Geral
              } else if (currentUrl.endsWith("main")) {
                return Edificio_Principal
              }
            }

            function Proxima_Construção() {
              let Construção_proximo_edificio = getConstrução_proximo_edificio()
              if (Construção_proximo_edificio !== undefined) {
                Construção_proximo_edificio.click()
                console.log("Clicked on " + Construção_proximo_edificio)
              }
            }

            function getConstrução_proximo_edificio() {
              let Clicar_Upar_Edificos =
                document.getElementsByClassName("btn btn-build")
              let Construção_Edifcios_Serie = getConstrução_Edifcios_Serie()
              let instituir
              while (
                instituir === undefined &&
                Construção_Edifcios_Serie.length > 0
              ) {
                var proximo = Construção_Edifcios_Serie.shift()
                if (Clicar_Upar_Edificos.hasOwnProperty(proximo)) {
                  let próximo_edifício = document.getElementById(proximo)
                  var Visivel =
                    próximo_edifício.offsetWidth > 0 ||
                    próximo_edifício.offsetHeight > 0
                  if (Visivel) {
                    instituir = próximo_edifício
                  }
                  if (Construção_Edificios_Ordem) {
                    break
                  }
                }
              }
              return instituir
            }

            function getConstrução_Edifcios_Serie() {
              var Sequência_Construção = []

              // Ordem de Construção Atualizada

              Sequência_Construção.push("main_buildlink_main_1") // Edifício principal +1 (Nível 1) 510 pontos
              Sequência_Construção.push("main_buildlink_statue_1") // Estátua +1 (Nível 1) 1534 pontos
              Sequência_Construção.push("main_buildlink_wood_1") // Bosque +1 (Nível 1) 2040 pontos
              Sequência_Construção.push("main_buildlink_stone_1") // Poço de argila +1 (Nível 1) 3046 pontos
              Sequência_Construção.push("main_buildlink_iron_1") // Mina de ferro +1 (Nível 1) 4052 pontos
              Sequência_Construção.push("main_buildlink_wood_2") // Bosque +1 (Nível 2) 4153 pontos
              Sequência_Construção.push("main_buildlink_stone_2") // Poço de argila +1 (Nível 2) 4254 pontos
              Sequência_Construção.push("main_buildlink_farm_1") // Fazenda +1 (Nível 1) 4259 pontos
              Sequência_Construção.push("main_buildlink_storage_1") // Armazém +1 (Nível 1) 4265 pontos
              Sequência_Construção.push("main_buildlink_farm_2") // Fazenda +1 (Nível 2) 4266 pontos
              Sequência_Construção.push("main_buildlink_storage_2") // Armazém +1 (Nível 2) 4267 pontos
              Sequência_Construção.push("main_buildlink_wood_3") // Bosque +1 (Nível 3) 4369 pontos
              Sequência_Construção.push("main_buildlink_stone_3") // Poço de argila +1 (Nível 3) 4571 pontos
              Sequência_Construção.push("main_buildlink_iron_2") // Mina de ferro +1 (Nível 2) 4772 pontos
              Sequência_Construção.push("main_buildlink_main_2") // Edifício principal +1 (Nível 2) 4874 pontos
              Sequência_Construção.push("main_buildlink_main_3") // Edifício principal +1 (Nível 3) 4976 pontos
              Sequência_Construção.push("main_buildlink_barracks_1") // Quartel +1 (Nível 1) 5692 pontos
              Sequência_Construção.push("main_buildlink_market_1") // Mercado +1 (Nível 1) 76102 pontos
              Sequência_Construção.push("main_buildlink_barracks_2") // Quartel +1 (Nível 2) 77105 pontos
              Sequência_Construção.push("main_buildlink_barracks_3") // Quartel +1 (Nível 3) 79109 pontos
              Sequência_Construção.push("main_buildlink_iron_3") // Mina de ferro +1 (Nível 3) 81111 pontos
              Sequência_Construção.push("main_buildlink_wood_4") // Bosque +1 (Nível 4) 82112 pontos
              Sequência_Construção.push("main_buildlink_stone_4") // Poço de argila +1 (Nível 4) 84113 pontos
              Sequência_Construção.push("main_buildlink_wall_1") // Muralha +1 (Nível 1) 89121 pontos
              Sequência_Construção.push("main_buildlink_wall_2") // Muralha +1 (Nível 2) 90123 pontos
              Sequência_Construção.push("main_buildlink_storage_3") // Armazém +1 (Nível 3) 90125 pontos
              Sequência_Construção.push("main_buildlink_storage_4") // Armazém +1 (Nível 4) 90126 pontos
              Sequência_Construção.push("main_buildlink_wood_5") // Bosque +1 (Nível 5) 91128 pontos
              Sequência_Construção.push("main_buildlink_stone_5") // Poço de argila +1 (Nível 5) 93130 pontos
              Sequência_Construção.push("main_buildlink_market_2") // Mercado +1 (Nível 2) 96132 pontos
              Sequência_Construção.push("main_buildlink_wood_6") // Bosque +1 (Nível 6) 97135 pontos
              Sequência_Construção.push("main_buildlink_stone_6") // Poço de argila +1 (Nível 6) 99138 pontos
              Sequência_Construção.push("main_buildlink_wood_7") // Bosque +1 (Nível 7) 101141 pontos
              Sequência_Construção.push("main_buildlink_stone_7") // Poço de argila +1 (Nível 7) 104144 pontos
              Sequência_Construção.push("main_buildlink_iron_4") // Mina de ferro +1 (Nível 4) 106145 pontos
              Sequência_Construção.push("main_buildlink_iron_5") // Mina de ferro +1 (Nível 5) 109147 pontos
              Sequência_Construção.push("main_buildlink_iron_6") // Mina de ferro +1 (Nível 6) 112150 pontos
              Sequência_Construção.push("main_buildlink_wood_8") // Bosque +1 (Nível 8) 114153 pontos
              Sequência_Construção.push("main_buildlink_stone_8") // Poço de argila +1 (Nível 8) 117156 pontos
              Sequência_Construção.push("main_buildlink_iron_7") // Mina de ferro +1 (Nível 7) 121159 pontos
              Sequência_Construção.push("main_buildlink_wood_9") // Bosque +1 (Nível 9) 123164 pontos
              Sequência_Construção.push("main_buildlink_stone_9") // Poço de argila +1 (Nível 9) 127169 pontos
              Sequência_Construção.push("main_buildlink_wood_10") // Bosque +1 (Nível 10) 129174 pontos
              Sequência_Construção.push("main_buildlink_stone_10") // Poço de argila +1 (Nível 10) 133179 pontos
              Sequência_Construção.push("main_buildlink_main_4") // Edifício principal +1 (Nível 4) 134182 pontos
              Sequência_Construção.push("main_buildlink_main_5") // Edifício principal +1 (Nível 5) 135186 pontos
              Sequência_Construção.push("main_buildlink_smith_1") // Ferreiro +1 (Nível 1) 155205 pontos
              Sequência_Construção.push("main_buildlink_storage_5") // Armazém +1 (Nível 5) 155207 pontos
              Sequência_Construção.push("main_buildlink_storage_6") // Armazém +1 (Nível 6) 155210 pontos
              Sequência_Construção.push("main_buildlink_wood_11") // Bosque +1 (Nível 11) 158216 pontos
              Sequência_Construção.push("main_buildlink_stone_11") // Poço de argila +1 (Nível 11) 162222 pontos

              Sequência_Construção.push("main_buildlink_iron_8") // Mina de ferro +1 (Nível 8) 166225 pontos
              Sequência_Construção.push("main_buildlink_storage_7") // Armazém +1 (Nível 7) 166228 pontos
              Sequência_Construção.push("main_buildlink_farm_3") // Fazenda +1 (Nível 3) 166229 pontos
              Sequência_Construção.push("main_buildlink_wood_12") // Bosque +1 (Nível 12) 169237 pontos
              Sequência_Construção.push("main_buildlink_stone_12") // Poço de argila +1 (Nível 12) 174245 pontos

              Sequência_Construção.push("main_buildlink_storage_8") // Armazém +1 (Nível 8) 179253 pontos
              Sequência_Construção.push("main_buildlink_wood_13") // Bosque +1 (Nível 13) 183261 pontos
              Sequência_Construção.push("main_buildlink_stone_13") // Poço de argila +1 (Nível 13) 189269 pontos

              Sequência_Construção.push("main_buildlink_storage_9") // Armazém +1 (Nível 9) 195279 pontos
              Sequência_Construção.push("main_buildlink_wood_14") // Bosque +1 (Nível 14) 200290 pontos
              Sequência_Construção.push("main_buildlink_stone_14") // Poço de argila +1 (Nível 14) 207301 pontos

              Sequência_Construção.push("main_buildlink_storage_10") // Armazém +1 (Nível 10) 214312 pontos
              Sequência_Construção.push("main_buildlink_barracks_4") // Quartel +1 (Nível 4) 227334 pontos
              Sequência_Construção.push("main_buildlink_barracks_5") // Quartel +1 (Nível 5) 229339 pontos
              Sequência_Construção.push("main_buildlink_farm_4") // Fazenda +1 (Nível 4) 229341 pontos
              Sequência_Construção.push("main_buildlink_farm_5") // Fazenda +1 (Nível 5) 229342 pontos
              Sequência_Construção.push("main_buildlink_wall_3") // Muralha +1 (Nível 3) 230344 pontos
              Sequência_Construção.push("main_buildlink_wall_4") // Muralha +1 (Nível 4) 231346 pontos
              Sequência_Construção.push("main_buildlink_wall_5") // Muralha +1 (Nível 5) 232349 pontos
              Sequência_Construção.push("main_buildlink_market_3") // Mercado +1 (Nível 3) 274390 pontos
              Sequência_Construção.push("main_buildlink_farm_6") // Fazenda +1 (Nível 6) 293443 pontos
              Sequência_Construção.push("main_buildlink_wood_15") // Bosque +1 (Nível 15) 298456 pontos
              Sequência_Construção.push("main_buildlink_iron_9") // Mina de ferro +1 (Nível 9) 179250 pontos
              Sequência_Construção.push("main_buildlink_iron_10") // Mina de ferro +1 (Nível 10) 195274 pontos
              Sequência_Construção.push("main_buildlink_iron_11") // Mina de ferro +1 (Nível 11) 214307 pontos
              Sequência_Construção.push("main_buildlink_iron_12") // Mina de ferro +1 (Nível 12) 222320 pontos
              Sequência_Construção.push("main_buildlink_iron_13") // Mina de ferro +1 (Nível 13) 242357 pontos
              Sequência_Construção.push("main_buildlink_iron_14") // Mina de ferro +1 (Nível 14) 253368 pontos
              Sequência_Construção.push("main_buildlink_main_6") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_7") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_8") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_9") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_10") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_11") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_main_12") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_stone_15") // Poço de argila +1 (Nível 15) 306469 pontos
              Sequência_Construção.push("main_buildlink_market_4") // Mercado +1 (Nível 4) 314482 pontos
              Sequência_Construção.push("main_buildlink_market_5") // Mercado +1 (Nível 5) 319486 pontos
              Sequência_Construção.push("main_buildlink_wood_16") // Bosque +1 (Nível 16) 324501 pontos
              Sequência_Construção.push("main_buildlink_stone_16") // Poço de argila +1 (Nível 16) 332516 pontos
              Sequência_Construção.push("main_buildlink_storage_11") // Armazém +1 (Nível 11) 332522 pontos
              Sequência_Construção.push("main_buildlink_storage_12") // Armazém +1 (Nível 12) 336542 pontos
              Sequência_Construção.push("main_buildlink_wood_17") // Bosque +1 (Nível 17) 343561 pontos
              Sequência_Construção.push("main_buildlink_stone_17") // Poço de argila +1 (Nível 17) 353580 pontos
              Sequência_Construção.push("main_buildlink_iron_15") // Mina de ferro +1 (Nível 15) 366593 pontos
              Sequência_Construção.push("main_buildlink_wood_18") // Bosque +1 (Nível 18) 374615 pontos
              Sequência_Construção.push("main_buildlink_stone_18") // Poço de argila +1 (Nível 18) 386637 pontos
              Sequência_Construção.push("main_buildlink_iron_16") // Mina de ferro +1 (Nível 16) 401652 pontos
              Sequência_Construção.push("main_buildlink_wood_19") // Bosque +1 (Nível 19) 410679 pontos
              Sequência_Construção.push("main_buildlink_stone_19") // Poço de argila +1 (Nível 19) 423706 pontos
              Sequência_Construção.push("main_buildlink_iron_17") // Mina de ferro +1 (Nível 17) 441725 pontos
              Sequência_Construção.push("main_buildlink_wood_20") // Bosque +1 (Nível 20) 451757 pontos
              Sequência_Construção.push("main_buildlink_stone_20") // Poço de argila +1 (Nível 20) 466789 pontos
              Sequência_Construção.push("main_buildlink_storage_13") // Armazém +1 (Nível 13) 466797 pontos
              Sequência_Construção.push("main_buildlink_storage_14") // Armazém +1 (Nível 14) 466808 pontos
              Sequência_Construção.push("main_buildlink_storage_15") // Armazém +1 (Nível 15) 466821 pontos
              Sequência_Construção.push("main_buildlink_main_13") // Edifício principal +1 (Nível 13) 471836 pontos
              Sequência_Construção.push("main_buildlink_main_14") // Edifício principal +1 (Nível 14) 476854 pontos
              Sequência_Construção.push("main_buildlink_main_15") // Edifício principal +1 (Nível 15) 483875 pontos
              Sequência_Construção.push("main_buildlink_wood_21") // Bosque +1 (Nível 21) 495913 pontos
              Sequência_Construção.push("main_buildlink_stone_21") // Poço de argila +1 (Nível 21) 511951 pontos
              Sequência_Construção.push("main_buildlink_iron_18") // Mina de ferro +1 (Nível 18) 532973 pontos
              Sequência_Construção.push("main_buildlink_farm_7") // Fazenda +1 (Nível 7) 532976 pontos
              Sequência_Construção.push("main_buildlink_wood_22") // Bosque +1 (Nível 22) 5461022 pontos
              Sequência_Construção.push("main_buildlink_stone_22") // Poço de argila +1 (Nível 22) 5661068 pontos
              Sequência_Construção.push("main_buildlink_iron_19") // Mina de ferro +1 (Nível 19) 5911095 pontos
              Sequência_Construção.push("main_buildlink_farm_8") // Fazenda +1 (Nível 8) 5911098 pontos
              Sequência_Construção.push("main_buildlink_wood_23") // Bosque +1 (Nível 23) 6071153 pontos
              Sequência_Construção.push("main_buildlink_stone_23") // Poço de argila +1 (Nível 23) 6291208 pontos
              Sequência_Construção.push("main_buildlink_iron_20") // Mina de ferro +1 (Nível 20) 6571240 pontos
              Sequência_Construção.push("main_buildlink_storage_16") // Armazém +1 (Nível 16) 6571255 pontos
              Sequência_Construção.push("main_buildlink_main_16") // Edifício principal +1 (Nível 16) 6651281 pontos
              Sequência_Construção.push("main_buildlink_main_17") // Edifício principal +1 (Nível 17) 6741312 pontos
              Sequência_Construção.push("main_buildlink_storage_17") // Armazém +1 (Nível 17) 6741331 pontos
              Sequência_Construção.push("main_buildlink_main_18") // Edifício principal +1 (Nível 18) 6841368 pontos
              Sequência_Construção.push("main_buildlink_storage_18") // Armazém +1 (Nível 18) 6841390 pontos
              Sequência_Construção.push("main_buildlink_main_19") // Edifício principal +1 (Nível 19) 6961434 pontos
              Sequência_Construção.push("main_buildlink_farm_9") // Fazenda +1 (Nível 9) 6961437 pontos
              Sequência_Construção.push("main_buildlink_storage_19") // Armazém +1 (Nível 19) 6961464 pontos
              Sequência_Construção.push("main_buildlink_main_20") // Edifício principal +1 (Nível 20) 7111517 pontos
              Sequência_Construção.push("main_buildlink_farm_10") // Fazenda +1 (Nível 10) 7111522 pontos
              Sequência_Construção.push("main_buildlink_storage_20") // Armazém +1 (Nível 20) 7111554 pontos

              return Sequência_Construção
            }
          } else {
            //*************************** CONFIGURAÇÃO ***************************//
            // Escolha Tempo de espera mínimo e máximo entre ações (em milissegundos)
            const Min_Tempo_Espera = 800000
            const Max_Tempo_Espera = 900000

            // Etapa_1: Upar O bot automaticamente em Série Edificios
            const Etapa = "Etapa_1"

            // Escolha se você deseja que o bot enfileire os edifícios na ordem definida (= true) ou
            // assim que um prédio estiver disponível para a fila de construção (= false)
            const Construção_Edificios_Ordem = true

            //*************************** /CONFIGURAÇÃO ***************************//

            // Constantes (NÃO DEVE SER ALTERADAS)
            const Visualização_Geral = "OVERVIEW_VIEW"
            const Edificio_Principal = "HEADQUARTERS_VIEW"

            ;(function () {
              "use strict"

              console.log("-- Script do Tribal Wars ativado --")

              if (Etapa == "Etapa_1") {
                executarEtapa1()
              }
            })()

            // Etapa 1: Construção
            function executarEtapa1() {
              let Evoluir_vilas = getEvoluir_vilas()
              console.log(Evoluir_vilas)
              if (Evoluir_vilas == Edificio_Principal) {
                setInterval(function () {
                  // construir qualquer edificio custeável, se possível
                  Proxima_Construção()
                }, 1000)
              } else if (Evoluir_vilas == Visualização_Geral) {
                // Visualização Geral PG
                document
                  .getElementById("l_main")
                  .children[0].children[0].click()
              }
            }

            let delay = Math.floor(
              Math.random() * (Max_Tempo_Espera - Max_Tempo_Espera) +
                Min_Tempo_Espera
            )

            // Ação do processo
            let Evoluir_vilas = getEvoluir_vilas()
            console.log(Evoluir_vilas)
            setTimeout(function () {
              if (Evoluir_vilas == Edificio_Principal) {
                // construir qualquer edificio custeável, se possível
                Proxima_Construção()
              } else if (Evoluir_vilas == Visualização_Geral) {
                // Visualização Geral Pag
                document
                  .getElementById("l_main")
                  .children[0].children[0].click()
              }
            }, delay)

            function getEvoluir_vilas() {
              let currentUrl = window.location.href
              if (currentUrl.endsWith("Visualização Geral")) {
                return Visualização_Geral
              } else if (currentUrl.endsWith("main")) {
                return Edificio_Principal
              }
            }

            function Proxima_Construção() {
              let Construção_proximo_edificio = getConstrução_proximo_edificio()
              if (Construção_proximo_edificio !== undefined) {
                Construção_proximo_edificio.click()
                console.log("Clicked on " + Construção_proximo_edificio)
              }
            }

            function getConstrução_proximo_edificio() {
              let Clicar_Upar_Edificos =
                document.getElementsByClassName("btn btn-build")
              let Construção_Edifcios_Serie = getConstrução_Edifcios_Serie()
              let instituir
              while (
                instituir === undefined &&
                Construção_Edifcios_Serie.length > 0
              ) {
                var proximo = Construção_Edifcios_Serie.shift()
                if (Clicar_Upar_Edificos.hasOwnProperty(proximo)) {
                  let próximo_edifício = document.getElementById(proximo)
                  var Visivel =
                    próximo_edifício.offsetWidth > 0 ||
                    próximo_edifício.offsetHeight > 0
                  if (Visivel) {
                    instituir = próximo_edifício
                  }
                  if (Construção_Edificios_Ordem) {
                    break
                  }
                }
              }
              return instituir
            }

            function getConstrução_Edifcios_Serie() {
              var Sequência_Construção = []

              // Ordem de Construção Atualizada

              Sequência_Construção.push("main_buildlink_main_1") // Edifício principal +1 (Nível 1) 510 pontos
              Sequência_Construção.push("main_buildlink_statue_1") // Estátua +1 (Nível 1) 1534 pontos
              Sequência_Construção.push("main_buildlink_wood_1") // Bosque +1 (Nível 1) 2040 pontos
              Sequência_Construção.push("main_buildlink_stone_1") // Poço de argila +1 (Nível 1) 3046 pontos
              Sequência_Construção.push("main_buildlink_iron_1") // Mina de ferro +1 (Nível 1) 4052 pontos
              Sequência_Construção.push("main_buildlink_wood_2") // Bosque +1 (Nível 2) 4153 pontos
              Sequência_Construção.push("main_buildlink_stone_2") // Poço de argila +1 (Nível 2) 4254 pontos
              Sequência_Construção.push("main_buildlink_farm_1") // Fazenda +1 (Nível 1) 4259 pontos
              Sequência_Construção.push("main_buildlink_storage_1") // Armazém +1 (Nível 1) 4265 pontos
              Sequência_Construção.push("main_buildlink_farm_2") // Fazenda +1 (Nível 2) 4266 pontos
              Sequência_Construção.push("main_buildlink_storage_2") // Armazém +1 (Nível 2) 4267 pontos
              Sequência_Construção.push("main_buildlink_wood_3") // Bosque +1 (Nível 3) 4369 pontos
              Sequência_Construção.push("main_buildlink_stone_3") // Poço de argila +1 (Nível 3) 4571 pontos
              Sequência_Construção.push("main_buildlink_iron_2") // Mina de ferro +1 (Nível 2) 4772 pontos
              Sequência_Construção.push("main_buildlink_main_2") // Edifício principal +1 (Nível 2) 4874 pontos
              Sequência_Construção.push("main_buildlink_main_3") // Edifício principal +1 (Nível 3) 4976 pontos
              Sequência_Construção.push("main_buildlink_barracks_1") // Quartel +1 (Nível 1) 5692 pontos
              Sequência_Construção.push("main_buildlink_market_1") // Mercado +1 (Nível 1) 76102 pontos
              Sequência_Construção.push("main_buildlink_barracks_2") // Quartel +1 (Nível 2) 77105 pontos
              Sequência_Construção.push("main_buildlink_barracks_3") // Quartel +1 (Nível 3) 79109 pontos
              Sequência_Construção.push("main_buildlink_iron_3") // Mina de ferro +1 (Nível 3) 81111 pontos
              Sequência_Construção.push("main_buildlink_wood_4") // Bosque +1 (Nível 4) 82112 pontos
              Sequência_Construção.push("main_buildlink_stone_4") // Poço de argila +1 (Nível 4) 84113 pontos
              Sequência_Construção.push("main_buildlink_wall_1") // Muralha +1 (Nível 1) 89121 pontos
              Sequência_Construção.push("main_buildlink_wall_2") // Muralha +1 (Nível 2) 90123 pontos
              Sequência_Construção.push("main_buildlink_storage_3") // Armazém +1 (Nível 3) 90125 pontos
              Sequência_Construção.push("main_buildlink_storage_4") // Armazém +1 (Nível 4) 90126 pontos
              Sequência_Construção.push("main_buildlink_wood_5") // Bosque +1 (Nível 5) 91128 pontos
              Sequência_Construção.push("main_buildlink_stone_5") // Poço de argila +1 (Nível 5) 93130 pontos
              Sequência_Construção.push("main_buildlink_market_2") // Mercado +1 (Nível 2) 96132 pontos
              Sequência_Construção.push("main_buildlink_wood_6") // Bosque +1 (Nível 6) 97135 pontos
              Sequência_Construção.push("main_buildlink_stone_6") // Poço de argila +1 (Nível 6) 99138 pontos
              Sequência_Construção.push("main_buildlink_wood_7") // Bosque +1 (Nível 7) 101141 pontos
              Sequência_Construção.push("main_buildlink_stone_7") // Poço de argila +1 (Nível 7) 104144 pontos
              Sequência_Construção.push("main_buildlink_iron_4") // Mina de ferro +1 (Nível 4) 106145 pontos
              Sequência_Construção.push("main_buildlink_iron_5") // Mina de ferro +1 (Nível 5) 109147 pontos
              Sequência_Construção.push("main_buildlink_iron_6") // Mina de ferro +1 (Nível 6) 112150 pontos
              Sequência_Construção.push("main_buildlink_wood_8") // Bosque +1 (Nível 8) 114153 pontos
              Sequência_Construção.push("main_buildlink_stone_8") // Poço de argila +1 (Nível 8) 117156 pontos
              Sequência_Construção.push("main_buildlink_iron_7") // Mina de ferro +1 (Nível 7) 121159 pontos
              Sequência_Construção.push("main_buildlink_wood_9") // Bosque +1 (Nível 9) 123164 pontos
              Sequência_Construção.push("main_buildlink_stone_9") // Poço de argila +1 (Nível 9) 127169 pontos
              Sequência_Construção.push("main_buildlink_wood_10") // Bosque +1 (Nível 10) 129174 pontos
              Sequência_Construção.push("main_buildlink_stone_10") // Poço de argila +1 (Nível 10) 133179 pontos
              Sequência_Construção.push("main_buildlink_main_4") // Edifício principal +1 (Nível 4) 134182 pontos
              Sequência_Construção.push("main_buildlink_main_5") // Edifício principal +1 (Nível 5) 135186 pontos
              Sequência_Construção.push("main_buildlink_smith_1") // Ferreiro +1 (Nível 1) 155205 pontos
              Sequência_Construção.push("main_buildlink_storage_5") // Armazém +1 (Nível 5) 155207 pontos
              Sequência_Construção.push("main_buildlink_storage_6") // Armazém +1 (Nível 6) 155210 pontos
              Sequência_Construção.push("main_buildlink_wood_11") // Bosque +1 (Nível 11) 158216 pontos
              Sequência_Construção.push("main_buildlink_iron_8") // Mina de ferro +1 (Nível 8) 166225 pontos
              Sequência_Construção.push("main_buildlink_storage_7") // Armazém +1 (Nível 7) 166228 pontos
              Sequência_Construção.push("main_buildlink_farm_3") // Fazenda +1 (Nível 3) 166229 pontos
              Sequência_Construção.push("main_buildlink_wood_12") // Bosque +1 (Nível 12) 169237 pontos
              Sequência_Construção.push("main_buildlink_storage_8") // Armazém +1 (Nível 8) 179253 pontos
              Sequência_Construção.push("main_buildlink_wood_13") // Bosque +1 (Nível 13) 183261 pontos
              Sequência_Construção.push("main_buildlink_storage_9") // Armazém +1 (Nível 9) 195279 pontos
              Sequência_Construção.push("main_buildlink_wood_14") // Bosque +1 (Nível 14) 200290 pontos
              Sequência_Construção.push("main_buildlink_storage_10") // Armazém +1 (Nível 10) 214312 pontos
              Sequência_Construção.push("main_buildlink_main_6") // Edifício principal +1 (Nível 6) 224324 pontos
              Sequência_Construção.push("main_buildlink_main_7") // Edifício principal +1 (Nível 7) 226329 pontos
              Sequência_Construção.push("main_buildlink_barracks_4") // Quartel +1 (Nível 4) 227334 pontos
              Sequência_Construção.push("main_buildlink_barracks_5") // Quartel +1 (Nível 5) 229339 pontos
              Sequência_Construção.push("main_buildlink_farm_4") // Fazenda +1 (Nível 4) 229341 pontos
              Sequência_Construção.push("main_buildlink_farm_5") // Fazenda +1 (Nível 5) 229342 pontos
              Sequência_Construção.push("main_buildlink_wall_3") // Muralha +1 (Nível 3) 230344 pontos
              Sequência_Construção.push("main_buildlink_wall_4") // Muralha +1 (Nível 4) 231346 pontos
              Sequência_Construção.push("main_buildlink_wall_5") // Muralha +1 (Nível 5) 232349 pontos
              Sequência_Construção.push("main_buildlink_smith_2") // Ferreiro +1 (Nível 2) 256372 pontos
              Sequência_Construção.push("main_buildlink_smith_3") // Ferreiro +1 (Nível 3) 260376 pontos
              Sequência_Construção.push("main_buildlink_smith_4") // Ferreiro +1 (Nível 4) 265382 pontos
              Sequência_Construção.push("main_buildlink_smith_5") // Ferreiro +1 (Nível 5) 270388 pontos
              Sequência_Construção.push("main_buildlink_market_3") // Mercado +1 (Nível 3) 274390 pontos
              Sequência_Construção.push("main_buildlink_main_8") // Edifício principal +1 (Nível 8) 276396 pontos
              Sequência_Construção.push("main_buildlink_main_9") // Edifício principal +1 (Nível 9) 279403 pontos
              Sequência_Construção.push("main_buildlink_main_10") // Edifício principal +1 (Nível 10) 282412 pontos
              Sequência_Construção.push("main_buildlink_stable_1") // Estábulo +1 (Nível 1) 290432 pontos
              Sequência_Construção.push("main_buildlink_stable_2") // Estábulo +1 (Nível 2) 291436 pontos
              Sequência_Construção.push("main_buildlink_stable_3") // Estábulo +1 (Nível 3) 293441 pontos
              Sequência_Construção.push("main_buildlink_farm_6") // Fazenda +1 (Nível 6) 293443 pontos
              Sequência_Construção.push("main_buildlink_wood_15") // Bosque +1 (Nível 15) 298456 pontos
              Sequência_Construção.push("main_buildlink_stone_11") // Poço de argila +1 (Nível 11) 162222 pontos
              Sequência_Construção.push("main_buildlink_stone_12") // Poço de argila +1 (Nível 12) 174245 pontos
              Sequência_Construção.push("main_buildlink_stone_13") // Poço de argila +1 (Nível 13) 189269 pontos
              Sequência_Construção.push("main_buildlink_stone_14") // Poço de argila +1 (Nível 14) 207301 pontos
              Sequência_Construção.push("main_buildlink_iron_9") // Mina de ferro +1 (Nível 9) 179250 pontos
              Sequência_Construção.push("main_buildlink_iron_10") // Mina de ferro +1 (Nível 10) 195274 pontos
              Sequência_Construção.push("main_buildlink_iron_11") // Mina de ferro +1 (Nível 11) 214307 pontos
              Sequência_Construção.push("main_buildlink_iron_12") // Mina de ferro +1 (Nível 12) 222320 pontos
              Sequência_Construção.push("main_buildlink_iron_13") // Mina de ferro +1 (Nível 13) 242357 pontos
              Sequência_Construção.push("main_buildlink_iron_14") // Mina de ferro +1 (Nível 14) 253368 pontos

              Sequência_Construção.push("main_buildlink_stone_15") // Poço de argila +1 (Nível 15) 306469 pontos
              Sequência_Construção.push("main_buildlink_main_11") // Edifício principal +1 (Nível 11) 309479 pontos
              Sequência_Construção.push("main_buildlink_market_4") // Mercado +1 (Nível 4) 314482 pontos
              Sequência_Construção.push("main_buildlink_market_5") // Mercado +1 (Nível 5) 319486 pontos
              Sequência_Construção.push("main_buildlink_wood_16") // Bosque +1 (Nível 16) 324501 pontos
              Sequência_Construção.push("main_buildlink_stone_16") // Poço de argila +1 (Nível 16) 332516 pontos
              Sequência_Construção.push("main_buildlink_storage_11") // Armazém +1 (Nível 11) 332522 pontos
              Sequência_Construção.push("main_buildlink_main_12") // Edifício principal +1 (Nível 12) 336534 pontos
              Sequência_Construção.push("main_buildlink_storage_12") // Armazém +1 (Nível 12) 336542 pontos
              Sequência_Construção.push("main_buildlink_wood_17") // Bosque +1 (Nível 17) 343561 pontos
              Sequência_Construção.push("main_buildlink_stone_17") // Poço de argila +1 (Nível 17) 353580 pontos
              Sequência_Construção.push("main_buildlink_iron_15") // Mina de ferro +1 (Nível 15) 366593 pontos
              Sequência_Construção.push("main_buildlink_wood_18") // Bosque +1 (Nível 18) 374615 pontos
              Sequência_Construção.push("main_buildlink_stone_18") // Poço de argila +1 (Nível 18) 386637 pontos
              Sequência_Construção.push("main_buildlink_iron_16") // Mina de ferro +1 (Nível 16) 401652 pontos
              Sequência_Construção.push("main_buildlink_wood_19") // Bosque +1 (Nível 19) 410679 pontos
              Sequência_Construção.push("main_buildlink_stone_19") // Poço de argila +1 (Nível 19) 423706 pontos
              Sequência_Construção.push("main_buildlink_iron_17") // Mina de ferro +1 (Nível 17) 441725 pontos
              Sequência_Construção.push("main_buildlink_wood_20") // Bosque +1 (Nível 20) 451757 pontos
              Sequência_Construção.push("main_buildlink_stone_20") // Poço de argila +1 (Nível 20) 466789 pontos
              Sequência_Construção.push("main_buildlink_storage_13") // Armazém +1 (Nível 13) 466797 pontos
              Sequência_Construção.push("main_buildlink_storage_14") // Armazém +1 (Nível 14) 466808 pontos
              Sequência_Construção.push("main_buildlink_storage_15") // Armazém +1 (Nível 15) 466821 pontos
              Sequência_Construção.push("main_buildlink_main_13") // Edifício principal +1 (Nível 13) 471836 pontos
              Sequência_Construção.push("main_buildlink_main_14") // Edifício principal +1 (Nível 14) 476854 pontos
              Sequência_Construção.push("main_buildlink_main_15") // Edifício principal +1 (Nível 15) 483875 pontos
              Sequência_Construção.push("main_buildlink_wood_21") // Bosque +1 (Nível 21) 495913 pontos
              Sequência_Construção.push("main_buildlink_stone_21") // Poço de argila +1 (Nível 21) 511951 pontos
              Sequência_Construção.push("main_buildlink_iron_18") // Mina de ferro +1 (Nível 18) 532973 pontos
              Sequência_Construção.push("main_buildlink_farm_7") // Fazenda +1 (Nível 7) 532976 pontos
              Sequência_Construção.push("main_buildlink_wood_22") // Bosque +1 (Nível 22) 5461022 pontos
              Sequência_Construção.push("main_buildlink_stone_22") // Poço de argila +1 (Nível 22) 5661068 pontos
              Sequência_Construção.push("main_buildlink_iron_19") // Mina de ferro +1 (Nível 19) 5911095 pontos
              Sequência_Construção.push("main_buildlink_farm_8") // Fazenda +1 (Nível 8) 5911098 pontos
              Sequência_Construção.push("main_buildlink_wood_23") // Bosque +1 (Nível 23) 6071153 pontos
              Sequência_Construção.push("main_buildlink_stone_23") // Poço de argila +1 (Nível 23) 6291208 pontos
              Sequência_Construção.push("main_buildlink_iron_20") // Mina de ferro +1 (Nível 20) 6571240 pontos
              Sequência_Construção.push("main_buildlink_storage_16") // Armazém +1 (Nível 16) 6571255 pontos
              Sequência_Construção.push("main_buildlink_main_16") // Edifício principal +1 (Nível 16) 6651281 pontos
              Sequência_Construção.push("main_buildlink_main_17") // Edifício principal +1 (Nível 17) 6741312 pontos
              Sequência_Construção.push("main_buildlink_storage_17") // Armazém +1 (Nível 17) 6741331 pontos
              Sequência_Construção.push("main_buildlink_main_18") // Edifício principal +1 (Nível 18) 6841368 pontos
              Sequência_Construção.push("main_buildlink_storage_18") // Armazém +1 (Nível 18) 6841390 pontos
              Sequência_Construção.push("main_buildlink_main_19") // Edifício principal +1 (Nível 19) 6961434 pontos
              Sequência_Construção.push("main_buildlink_farm_9") // Fazenda +1 (Nível 9) 6961437 pontos
              Sequência_Construção.push("main_buildlink_storage_19") // Armazém +1 (Nível 19) 6961464 pontos
              Sequência_Construção.push("main_buildlink_main_20") // Edifício principal +1 (Nível 20) 7111517 pontos
              Sequência_Construção.push("main_buildlink_farm_10") // Fazenda +1 (Nível 10) 7111522 pontos
              Sequência_Construção.push("main_buildlink_storage_20") // Armazém +1 (Nível 20) 7111554 pontos
              Sequência_Construção.push("main_buildlink_barracks_6") // Quartel +1 (Nível 6) 7131561 pontos
              Sequência_Construção.push("main_buildlink_barracks_7") // Quartel +1 (Nível 7) 7161569 pontos
              Sequência_Construção.push("main_buildlink_barracks_8") // Quartel +1 (Nível 8) 7191578 pontos
              Sequência_Construção.push("main_buildlink_barracks_9") // Quartel +1 (Nível 9) 7231590 pontos
              Sequência_Construção.push("main_buildlink_barracks_10") // Quartel +1 (Nível 10) 7271604 pontos
              Sequência_Construção.push("main_buildlink_stable_4") // Estábulo +1 (Nível 4) 7291610 pontos
              Sequência_Construção.push("main_buildlink_stable_5") // Estábulo +1 (Nível 5) 7311616 pontos
              Sequência_Construção.push("main_buildlink_stable_6") // Estábulo +1 (Nível 6) 7341625 pontos
              Sequência_Construção.push("main_buildlink_stable_7") // Estábulo +1 (Nível 7) 7371635 pontos
              Sequência_Construção.push("main_buildlink_stable_8") // Estábulo +1 (Nível 8) 7401647 pontos
              Sequência_Construção.push("main_buildlink_stable_9") // Estábulo +1 (Nível 9) 7441661 pontos
              Sequência_Construção.push("main_buildlink_stable_10") // Estábulo +1 (Nível 10) 7491678 pontos
              Sequência_Construção.push("main_buildlink_smith_6") // Ferreiro +1 (Nível 6) 7561686 pontos
              Sequência_Construção.push("main_buildlink_smith_7") // Ferreiro +1 (Nível 7) 7631696 pontos
              Sequência_Construção.push("main_buildlink_smith_8") // Ferreiro +1 (Nível 8) 7721707 pontos
              Sequência_Construção.push("main_buildlink_smith_9") // Ferreiro +1 (Nível 9) 7821721 pontos
              Sequência_Construção.push("main_buildlink_smith_10") // Ferreiro +1 (Nível 10) 7941737 pontos
              Sequência_Construção.push("main_buildlink_market_6") // Mercado +1 (Nível 6) 8011741 pontos
              Sequência_Construção.push("main_buildlink_market_7") // Mercado +1 (Nível 7) 8081746 pontos
              Sequência_Construção.push("main_buildlink_market_8") // Mercado +1 (Nível 8) 8171752 pontos
              Sequência_Construção.push("main_buildlink_market_9") // Mercado +1 (Nível 9) 8271759 pontos
              Sequência_Construção.push("main_buildlink_market_10") // Mercado +1 (Nível 10) 8391768 pontos

              Sequência_Construção.push("main_buildlink_wood_24") // Bosque +1 (Nível 24) 9362049 pontos
              Sequência_Construção.push("main_buildlink_stone_24") // Poço de argila +1 (Nível 24) 9612115 pontos
              Sequência_Construção.push("main_buildlink_iron_21") // Mina de ferro +1 (Nível 21) 9952153 pontos
              Sequência_Construção.push("main_buildlink_storage_21") // Armazém +1 (Nível 21) 9952191 pontos

              Sequência_Construção.push("main_buildlink_wood_25") // Bosque +1 (Nível 25) 10672380 pontos
              Sequência_Construção.push("main_buildlink_stone_25") // Poço de argila +1 (Nível 25) 10952460 pontos
              Sequência_Construção.push("main_buildlink_iron_22") // Mina de ferro +1 (Nível 22) 11342506 pontos

              Sequência_Construção.push("main_buildlink_storage_22") // Armazém +1 (Nível 22) 11342557 pontos

              Sequência_Construção.push("main_buildlink_wood_26") // Bosque +1 (Nível 26) 12212783 pontos
              Sequência_Construção.push("main_buildlink_stone_26") // Poço de argila +1 (Nível 26) 12542878 pontos
              Sequência_Construção.push("main_buildlink_iron_23") // Mina de ferro +1 (Nível 23) 13002933 pontos
              Sequência_Construção.push("main_buildlink_farm_12") // Fazenda +1 (Nível 12) 13002939 pontos
              Sequência_Construção.push("main_buildlink_storage_23") // Armazém +1 (Nível 23) 13002994 pontos

              Sequência_Construção.push("main_buildlink_wood_27") // Bosque +1 (Nível 27) 13993268 pontos
              Sequência_Construção.push("main_buildlink_stone_27") // Poço de argila +1 (Nível 27) 14363383 pontos
              Sequência_Construção.push("main_buildlink_iron_24") // Mina de ferro +1 (Nível 24) 14903449 pontos
              Sequência_Construção.push("main_buildlink_farm_13") // Fazenda +1 (Nível 13) 14903457 pontos
              Sequência_Construção.push("main_buildlink_storage_24") // Armazém +1 (Nível 24) 14903523 pontos

              Sequência_Construção.push("main_buildlink_wood_28") // Bosque +1 (Nível 28) 16053850 pontos
              Sequência_Construção.push("main_buildlink_stone_28") // Poço de argila +1 (Nível 28) 16473987 pontos
              Sequência_Construção.push("main_buildlink_iron_25") // Mina de ferro +1 (Nível 25) 17104067 pontos
              Sequência_Construção.push("main_buildlink_farm_14") // Fazenda +1 (Nível 14) 17104075 pontos
              Sequência_Construção.push("main_buildlink_storage_25") // Armazém +1 (Nível 25) 17104155 pontos

              Sequência_Construção.push("main_buildlink_wood_29") // Bosque +1 (Nível 29) 18464548 pontos
              Sequência_Construção.push("main_buildlink_stone_29") // Poço de argila +1 (Nível 29) 18944713 pontos
              Sequência_Construção.push("main_buildlink_storage_26") // Armazém +1 (Nível 26) 18944808 pontos
              Sequência_Construção.push("main_buildlink_barracks_22") // Quartel +1 (Nível 22) 19214931 pontos
              Sequência_Construção.push("main_buildlink_stable_17") // Estábulo +1 (Nível 17) 19364993 pontos
              Sequência_Construção.push("main_buildlink_market_17") // Mercado +1 (Nível 17) 19725024 pontos
              Sequência_Construção.push("main_buildlink_wood_30") // Bosque +1 (Nível 30) 20155222 pontos
              Sequência_Construção.push("main_buildlink_stone_30") // Poço de argila +1 (Nível 30) 20705420 pontos
              Sequência_Construção.push("main_buildlink_iron_26") // Mina de ferro +1 (Nível 26) 21445515 pontos
              Sequência_Construção.push("main_buildlink_farm_15") // Fazenda +1 (Nível 15) 21445526 pontos
              Sequência_Construção.push("main_buildlink_storage_27") // Armazém +1 (Nível 27) 21445641 pontos
              Sequência_Construção.push("main_buildlink_barracks_23") // Quartel +1 (Nível 23) 21765788 pontos
              Sequência_Construção.push("main_buildlink_stable_18") // Estábulo +1 (Nível 18) 21925862 pontos
              Sequência_Construção.push("main_buildlink_smith_17") // Ferreiro +1 (Nível 17) 22285920 pontos
              Sequência_Construção.push("main_buildlink_market_18") // Mercado +1 (Nível 18) 22705957 pontos
              Sequência_Construção.push("main_buildlink_iron_27") // Mina de ferro +1 (Nível 27) 23566072 pontos
              Sequência_Construção.push("main_buildlink_farm_16") // Fazenda +1 (Nível 16) 23566085 pontos
              Sequência_Construção.push("main_buildlink_storage_28") // Armazém +1 (Nível 28) 23566222 pontos
              Sequência_Construção.push("main_buildlink_barracks_24") // Quartel +1 (Nível 24) 23946399 pontos
              Sequência_Construção.push("main_buildlink_stable_19") // Estábulo +1 (Nível 19) 24146487 pontos
              Sequência_Construção.push("main_buildlink_smith_18") // Ferreiro +1 (Nível 18) 24566558 pontos
              Sequência_Construção.push("main_buildlink_smith_19") // Ferreiro +1 (Nível 19) 25056642 pontos
              Sequência_Construção.push("main_buildlink_market_19") // Mercado +1 (Nível 19) 25546686 pontos
              Sequência_Construção.push("main_buildlink_iron_28") // Mina de ferro +1 (Nível 28) 26546823 pontos
              Sequência_Construção.push("main_buildlink_farm_17") // Fazenda +1 (Nível 17) 26546838 pontos
              Sequência_Construção.push("main_buildlink_storage_29") // Armazém +1 (Nível 29) 26547003 pontos
              Sequência_Construção.push("main_buildlink_barracks_25") // Quartel +1 (Nível 25) 26987215 pontos
              Sequência_Construção.push("main_buildlink_stable_20") // Estábulo +1 (Nível 20) 27217322 pontos
              Sequência_Construção.push("main_buildlink_smith_20") // Ferreiro +1 (Nível 20) 27787423 pontos
              Sequência_Construção.push("main_buildlink_iron_29") // Mina de ferro +1 (Nível 29) 28967588 pontos
              Sequência_Construção.push("main_buildlink_farm_18") // Fazenda +1 (Nível 18) 28967607 pontos
              Sequência_Construção.push("main_buildlink_storage_30") // Armazém +1 (Nível 30) 28967805 pontos
              Sequência_Construção.push("main_buildlink_iron_30") // Mina de ferro +1 (Nível 30) 30348003 pontos
              Sequência_Construção.push("main_buildlink_market_20") // Mercado +1 (Nível 20) 30918056 pontos
              Sequência_Construção.push("main_buildlink_farm_19") // Fazenda +1 (Nível 19) 30918078 pontos
              Sequência_Construção.push("main_buildlink_farm_20") // Fazenda +1 (Nível 20) 30918105 pontos
              Sequência_Construção.push("main_buildlink_farm_21") // Fazenda +1 (Nível 21) 30918137 pontos
              Sequência_Construção.push("main_buildlink_farm_22") // Fazenda +1 (Nível 22) 30918175 pontos
              Sequência_Construção.push("main_buildlink_farm_23") // Fazenda +1 (Nível 23) 30918221 pontos
              Sequência_Construção.push("main_buildlink_farm_24") // Fazenda +1 (Nível 24) 30918276 pontos
              Sequência_Construção.push("main_buildlink_farm_25") // Fazenda +1 (Nível 25) 30918342 pontos
              Sequência_Construção.push("main_buildlink_farm_26") // Fazenda +1 (Nível 26) 30918422 pontos
              Sequência_Construção.push("main_buildlink_farm_27") // Fazenda +1 (Nível 27) 30918517 pontos
              Sequência_Construção.push("main_buildlink_farm_28") // Fazenda +1 (Nível 28) 30918632 pontos
              Sequência_Construção.push("main_buildlink_farm_29") // Fazenda +1 (Nível 29) 30918769 pontos
              Sequência_Construção.push("main_buildlink_farm_30") // Fazenda +1 (Nível 30) 30918934 pontos
              Sequência_Construção.push("main_buildlink_academy_1") // Academia +1 (Nível 1) 31719446 pontos

              return Sequência_Construção
            }
          }
        }
      }
    }
  }
}
if (autorecruit) {
  if (
    window.location.href.includes("screen=train") ||
    window.location.href.includes("screen=stable") ||
    window.location.href.includes("screen=barracks")
  ) {
    console.log("toaqui")
    var objetoTropas = []
    var altAldTempo = aleatorio(10000, 100000)

    var quantidadeRecrutar = 1

    var classEnum = Object.freeze({
      lanca: ".unit_sprite_smaller.spear",
      espada: ".unit_sprite_smaller.sword",
      barbaro: ".unit_sprite_smaller.axe",
      explorador: ".unit_sprite_smaller.spy",
      cavalariaLeve: ".unit_sprite_smaller.light",
      cavalariaPesada: ".unit_sprite_smaller.heavy",
      ariete: ".unit_sprite_smaller.ram",
      catapulta: ".unit_sprite_smaller.catapult",
    })

    function GerarObjeto() {
      objetoTropas = [
        {
          nomeUnidade: "spear",
          recrutar: lanca,
          cssClassSelector: classEnum.lanca,
          quantidade: quantidadeRecrutar,
        },
        {
          nomeUnidade: "sword",
          recrutar: espada,
          cssClassSelector: classEnum.espada,
          quantidade: quantidadeRecrutar,
        },
        {
          nomeUnidade: "axe",
          recrutar: barbaro,
          cssClassSelector: classEnum.barbaro,
          quantidade: quantidadeRecrutar,
        },
        {
          nomeUnidade: "spy",
          recrutar: explorador,
          cssClassSelector: classEnum.explorador,
          quantidade: quantidadeRecrutar,
        },
        {
          nomeUnidade: "light",
          recrutar: cavalariaLeve,
          cssClassSelector: classEnum.cavalariaLeve,
          quantidade: quantidadeRecrutar,
        },
        {
          nomeUnidade: "heavy",
          recrutar: cavalariaPesada,
          cssClassSelector: classEnum.cavalariaPesada,
          quantidade: quantidadeRecrutar,
        },
        {
          nomeUnidade: "ram",
          recrutar: ariete,
          cssClassSelector: classEnum.ariete,
          quantidade: quantidadeRecrutar,
        },
        {
          nomeUnidade: "catapult",
          recrutar: catapulta,
          cssClassSelector: classEnum.catapulta,
          quantidade: quantidadeRecrutar,
        },
      ]
    }

    $(document).ready(function () {
      GerarObjeto()

      var retorno = false
      objetoTropas.forEach((element) => {
        var response = validarPreencher(element)
        //se o retorno não tiver sido verdadeiro nos loops anteriores, seta com o valor da resposta atual
        //caso ja tenha sido, manter o valor como verdadeiro
        if (!retorno) {
          retorno = response
        }
      })

      if (retorno) {
        $(".btn-recruit").click()
      }

      console.log(altAldTempo)
      setInterval(function () {
        console.log("recarrega")
        location.reload(true)
      }, altAldTempo)
    })

    function validarPreencher(singleObject) {
      if (singleObject.recrutar) {
        if (
          $(singleObject.cssClassSelector).length <= 1 &&
          $("input[name=" + singleObject.nomeUnidade + "]").length > 0
        ) {
          $("input[name=" + singleObject.nomeUnidade + "]")
            .focus()
            .val(singleObject.quantidade)
            .blur()
          if (
            parseInt(
              $("input[name=" + singleObject.nomeUnidade + "]")
                .parents("tr")
                .find("#" + singleObject.nomeUnidade + "_0_cost_wood")
                .text()
            ) *
              singleObject.quantidade >
            parseInt($("#wood").text())
          )
            return false
          if (
            parseInt(
              $("input[name=" + singleObject.nomeUnidade + "]")
                .parents("tr")
                .find("#" + singleObject.nomeUnidade + "_0_cost_stone")
                .text()
            ) *
              singleObject.quantidade >
            parseInt($("#stone").text())
          )
            return false
          if (
            parseInt(
              $("input[name=" + singleObject.nomeUnidade + "]")
                .parents("tr")
                .find("#" + singleObject.nomeUnidade + "_0_cost_iron")
                .text()
            ) *
              singleObject.quantidade >
            parseInt($("#iron").text())
          )
            return false
          return true
        }
      }
      return false
    }

    function aleatorio(superior, inferior) {
      numPosibilidades = superior - inferior
      aleat = Math.random() * numPosibilidades
      return Math.round(parseInt(inferior) + aleat)
    }
  }
  // Definir uma variável para armazenar o tempo de espera para atualizar a página (em milissegundos)
  const TEMPO_ESPERA = 5000 // 5 segundos

  // Definir uma função para verificar a conexão com a Internet e, em seguida, atualizar a página
  function verificarConexao() {
    if (window.navigator.onLine === false) {
      console.log("Conexão com a Internet perdida. Tentando reconectar...")
      setTimeout(verificarConexao, TEMPO_ESPERA)
    } else {
      console.log(
        "Conexão com a Internet restabelecida. Atualizando a página..."
      )
      setTimeout(function () {
        window.location.reload()
      }, TEMPO_ESPERA)
    }
  }

  // Adicionar um listener para verificar a conexão com a Internet
  window.addEventListener("offline", verificarConexao)

  // Função para atualizar a página a cada 5 a 10 minutos
  function atualizarPagina() {
    var tempoAtualizacao = Math.random() * (10 - 5) + 5 // Tempo aleatório entre 5 e 10 minutos
    tempoAtualizacao = tempoAtualizacao * 60 * 1000 // Convertendo para milissegundos
    setTimeout(function () {
      location.reload() // Recarregar a página
    }, tempoAtualizacao)
  }

  // Iniciar a função de atualização da página
  atualizarPagina()

  setInterval(() => {
    function reproduzirAudio() {
      var audio = new Audio(
        "https://audiocdn.epidemicsound.com/lqmp3/01HXV7AWFC07E6J1QZ2D00GDS8.mp3" // Novo áudio
      )
      audio.volume = 0.05 // Defina o valor do volume entre 0 e 1
      audio.play()
    }
    reproduzirAudio()
  }, 3000)
}

if (autoColeta) {
  if (window.location.href.includes("scavenge")) {
    if (desbloquearColeta) {
      ;(function () {
        "use strict"

        // Função para verificar a existência de um botão antes de tentar interagir com ele
        function clickUnlockButton(optionId) {
          let unlockButton = document.querySelector(
            `#${optionId} a.btn.btn-default`
          )
          if (unlockButton) {
            // Verifica se o botão está desabilitado
            if (unlockButton.classList.contains("btn-disabled")) {
              console.log(
                `Botão 'Desbloquear' desabilitado em ${optionId}, clicando para fechar...`
              )
              let closeButton = document.querySelector(
                `#${optionId} a.popup_box_close`
              )
              if (closeButton) {
                closeButton.click() // Clica no botão de fechar
              }
            } else {
              console.log(
                `Botão 'Desbloquear' encontrado em ${optionId}, clicando...`
              )
              unlockButton.click() // Clica no botão 'Desbloquear'
            }
          }
        }

        // Função principal para processar as opções de saque
        function processOptions() {
          let textWood = document.getElementById("wood").innerText
          let textStone = document.getElementById("stone").innerText
          let textIron = document.getElementById("iron").innerText

          let numberWood = parseInt(textWood, 10)
          let numberStone = parseInt(textStone, 10)
          let numberIron = parseInt(textIron, 10)

          let container = document.querySelector(".options-container")
          if (!container) {
            console.log("Container não encontrado.")
            return
          }

          let scavengeOptions = container.querySelectorAll(".scavenge-option")
          if (scavengeOptions.length === 0) {
            console.log("Nenhuma opção de saque encontrada.")
            return
          }

          let canClick = true

          scavengeOptions.forEach((option, index) => {
            if (!canClick) return

            let button = option.querySelector(".btn.btn-default.unlock-button")
            if (button) {
              switch (index + 1) {
                case 1:
                  if (
                    numberWood >= 25 &&
                    numberStone >= 30 &&
                    numberIron >= 25
                  ) {
                    console.log("Botão encontrado na opção 1, clicando...")
                    button.click() // Clica no botão da opção 1
                    canClick = false

                    setTimeout(
                      () => clickUnlockButton("popup_box_unlock-option-1"),
                      1000
                    )
                  }
                  break
                case 2:
                  if (
                    numberWood >= 250 &&
                    numberStone >= 300 &&
                    numberIron >= 250
                  ) {
                    console.log("Botão encontrado na opção 2, clicando...")
                    button.click() // Clica no botão da opção 2
                    canClick = false

                    setTimeout(
                      () => clickUnlockButton("popup_box_unlock-option-2"),
                      1000
                    )
                  }
                  break
                case 3:
                  if (
                    numberWood >= 1000 &&
                    numberStone >= 1200 &&
                    numberIron >= 1000
                  ) {
                    console.log("Botão encontrado na opção 3, clicando...")
                    button.click() // Clica no botão da opção 3
                    canClick = false

                    setTimeout(
                      () => clickUnlockButton("popup_box_unlock-option-3"),
                      1000
                    )
                  }
                  break
                case 4:
                  if (
                    numberWood >= 10000 &&
                    numberStone >= 12000 &&
                    numberIron >= 10000
                  ) {
                    console.log("Botão encontrado na opção 4, clicando...")
                    button.click() // Clica no botão da opção 4
                    canClick = false

                    setTimeout(
                      () => clickUnlockButton("popup_box_unlock-option-4"),
                      1000
                    )
                  }
                  break
                default:
                  break
              }
            }
          })
        }

        // Chama a função principal quando a página terminar de carregar
        window.addEventListener("load", processOptions)
      })()
    }

    ;(function () {
      "use strict"

      var minAtualizar = 5 // coloque o tempo em minutos para atualizar aqui. vou testar 30 s.
      var tempoDeAtt = minAtualizar * 1000 * 60

      setTimeout(function () {
        window.location.reload()
      }, tempoDeAtt)
      function randonTime(superior, inferior) {
        const numPosibilidades = superior - inferior
        const aleat = Math.random() * numPosibilidades
        return Math.round(parseInt(inferior) + aleat)
      }

      const Scavange = new (function () {
        const scavangesWeight = [15, 6, 3, 2]

        const getBlockedScavanges = () => {
          const unlockButtonCount =
            document.getElementsByClassName("unlock-button").length
          const unlockCountdownCount =
            document.getElementsByClassName("unlock-countdown").length
          return unlockButtonCount + unlockCountdownCount
        }

        const getAvailableScavanges = () => {
          return document.getElementsByClassName("free_send_button")
        }

        const getScavangeWeight = () => {
          const blockedScavanges = getBlockedScavanges()

          let weightArray = scavangesWeight
          if (blockedScavanges > 0) {
            weightArray = weightArray.slice(0, blockedScavanges * -1)
          }

          return weightArray.reduce((item1, item2) => {
            return item1 + item2
          })
        }

        const getAvailableTroops = () => {
          // we want to avoid sendint the paladin in scavange
          // we wanto to avoid sending CL in scavange
          const unitsToAvoid = ["knight", "light", "axe"]

          let responseTroops = []
          const troops = document.getElementsByClassName("units-entry-all")

          for (const troop of troops) {
            var unitType = troop.getAttribute("data-unit")

            if (!unitsToAvoid.includes(unitType)) {
              responseTroops.push({
                unit: troop.getAttribute("data-unit"),
                quantity: parseInt(
                  troop.innerHTML.replace("(", "").replace(")", "")
                ),
              })
            }
          }

          return responseTroops
        }

        const calculateScavangeTroops = (scavangeWeight, troops) => {
          const totalWeight = getScavangeWeight()

          const result = []
          for (const troop of troops) {
            const troopsToSend = Math.floor(
              (troop.quantity * scavangeWeight) / totalWeight
            )

            result.push({
              unit: troop.unit,
              quantityToSend: troopsToSend,
            })
          }

          return result
        }

        const sendScavange = (weight, troops, element) => {
          const troopsToSend = calculateScavangeTroops(weight, troops)
          for (const troopToSend of troopsToSend) {
            if (troopToSend.quantityToSend) {
              var inputs = $(`[name=${troopToSend.unit}]`)
              inputs.val(troopToSend.quantityToSend.toString()).change()
            }
          }

          element.click()
        }

        this.init = () => {
          const troops = getAvailableTroops()
          const availableScavanges = getAvailableScavanges()

          const scavangesUnlocked =
            scavangesWeight.length - getBlockedScavanges()
          console.log(availableScavanges.length)
          console.log(scavangesUnlocked)
          // only run scavange if all unlocked are available
          // to prevent from sending wrong number of troops

          setInterval(() => {
            if (availableScavanges.length >= scavangesUnlocked) {
              location.reload(true)
            }
          }, 10000)

          if (availableScavanges.length >= scavangesUnlocked) {
            for (let index = 0; index < availableScavanges.length; index++) {
              const weight = scavangesWeight[index]
              const element = availableScavanges[index]

              const delayTime = 3000 + 3000 * index
              setTimeout(() => sendScavange(weight, troops, element), delayTime)
            }
          }
        }
      })()

      $(document).ready(() => {
        // wait 1 sec after page load to start script
        setTimeout(() => {
          Scavange.init()
        }, 1000)
      })

      // reload between 5 and 10 minutes
      const reloadTime = randonTime(300000, 600000)
      console.log(`will reload in ${reloadTime / 1000} seconds`)
      setInterval(function () {
        console.log("reloading...")
        location.reload(true)
      }, reloadTime)
    })()
  }
}

setInterval(() => {
  function reproduzirAudio() {
    var audio = new Audio(
      "https://audiocdn.epidemicsound.com/lqmp3/01HXV7AWFC07E6J1QZ2D00GDS8.mp3" // Novo áudio
    )
    audio.volume = 0.05 // Defina o valor do volume entre 0 e 1
    audio.play()
  }
  reproduzirAudio()
}, 3000)
