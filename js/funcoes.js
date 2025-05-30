// =============================
// Função: converteTempoParaSegundos
// Converte tempos como "1:23.45" ou "80.12" para segundos (número)
// =============================
function converteTempoParaSegundos(tempo) {
  if (!tempo || tempo.trim() === "") return Infinity;
  const partes = tempo.split(":");
  if (partes.length === 2) {
    return parseFloat(partes[0]) * 60 + parseFloat(partes[1]);
  }
  return parseFloat(tempo);
}

// =============================
// Função: carregarPilotosNaTabela
// Carrega os pilotos numa tabela HTML com base no localStorage
// =============================
function carregarPilotosNaTabela(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  if (!tabela) return;

  const dados = JSON.parse(localStorage.getItem("pilotos") || "[]");

  tabela.innerHTML = "";

  dados.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.carro}</td>
      <td>${p.cronometro}</td>
      <td>${p.potencia}</td>
      <td>${p.categoria}</td>
      <td>Geral</td>
      <td>${p.tempo || "-"}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarPiloto(${i})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deletarPiloto(${i})">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

// =============================
// Função: deletarPiloto
// Remove um piloto da lista pelo índice
// =============================
function deletarPiloto(index) {
  let dados = JSON.parse(localStorage.getItem("pilotos") || "[]");
  dados.splice(index, 1);
  localStorage.setItem("pilotos", JSON.stringify(dados));
  carregarPilotosNaTabela("tabela"); // Atualiza a tabela
}

// =============================
// Função: salvarPiloto
// Salva o piloto no localStorage a partir de um formulário
// =============================
function salvarPiloto(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.onsubmit = function (e) {
    e.preventDefault();

    const piloto = {
      nome: form.nome.value.trim(),
      carro: form.carro.value.trim(),
      cronometro: form.cronometro.value.trim(),
      potencia: form.potencia.value.trim(),
      categoria: form.categoria.value.trim(),
      tempo: form.tempo.value.trim()
    };

    const dados = JSON.parse(localStorage.getItem("pilotos") || "[]");

    const index = form.getAttribute("data-edit-index");

    // Verifica se já existe outro piloto com o mesmo número de cronômetro
    const existe = dados.some((p, i) =>
      p.cronometro === piloto.cronometro && (index === null || i !== parseInt(index))
    );

    if (existe) {
      alert("⚠️ Já existe um piloto com esse número de cronômetro.");
      return;
    }

    if (index !== null) {
      // Atualiza piloto existente
      dados[index] = piloto;
      form.removeAttribute("data-edit-index");
      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.textContent = "Cadastrar piloto";
    } else {
      // Adiciona novo piloto
      dados.push(piloto);
    }

    localStorage.setItem("pilotos", JSON.stringify(dados));
    form.reset();
    carregarPilotosNaTabela("tabela");
    mostrarMensagem(); // Mostra mensagem de sucesso
  };
}

// =============================
// Função: editarPiloto
// Preenche o formulário com os dados do piloto para edição
// =============================
function editarPiloto(index) {
  const dados = JSON.parse(localStorage.getItem("pilotos") || "[]");
  const piloto = dados[index];

  // Preenche os campos do formulário
  document.getElementById("nome").value = piloto.nome;
  document.getElementById("carro").value = piloto.carro;
  document.getElementById("cronometro").value = piloto.cronometro;
  document.getElementById("potencia").value = piloto.potencia;
  document.getElementById("categoria").value = piloto.categoria;
  document.getElementById("tempo").value = piloto.tempo || "";

  // Define o modo de edição
  const form = document.getElementById("form");
  form.setAttribute("data-edit-index", index);

  // Muda texto do botão (opcional)
  const submitBtn = form.querySelector("button[type='submit']");
  if (submitBtn) submitBtn.textContent = "Atualizar Piloto";
}

// =============================
// Função: carregarRankingGeral
// Gera uma tabela com ranking geral por melhor tempo
// =============================
function carregarRankingGeral() {
  const dados = JSON.parse(localStorage.getItem("pilotos") || "[]");
  const filtrados = dados.filter(p => p.tempo && p.tempo.trim() !== "");

  filtrados.sort((a, b) => converteTempoParaSegundos(a.tempo) - converteTempoParaSegundos(b.tempo));

  const container = document.getElementById("ranking");
  if (!container) return;

  const table = document.createElement("table");
  table.className = "table table-striped table-hover table-bordered";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr class="table-dark text-center">
      <th>Posição</th>
      <th>Piloto</th>
      <th>Carro</th>
      <th>Potência</th>
      <th>Categoria</th>
      <th>Tempo</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");

  filtrados.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center">${i + 1}</td>
      <td>${p.nome}</td>
      <td>${p.carro}</td>
      <td class="text-center">${p.potencia} cv</td>
      <td class="text-center">${p.categoria}</td>
      <td class="text-center">${p.tempo}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  container.innerHTML = "";
  container.appendChild(table);
}

// =============================
// Função: carregarCategoriasCheckboxes
// Cria checkboxes das categorias cadastradas
// =============================
function carregarCategoriasCheckboxes(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const dados = JSON.parse(localStorage.getItem("pilotos") || "[]");
  const categorias = [...new Set(dados.map(p => p.categoria))];

  container.innerHTML = "";

  categorias.forEach(cat => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = cat;
    checkbox.id = `cat-${cat}`;
    checkbox.onchange = () => mostrarRankingsPorCategoria("rankings");

    const label = document.createElement("label");
    label.htmlFor = `cat-${cat}`;
    label.textContent = cat;

    container.appendChild(checkbox);
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });
}

// =============================
// Função: mostrarRankingsPorCategoria
// Mostra os melhores tempos agrupados por categoria selecionada
// =============================
function mostrarRankingsPorCategoria(containerId) {
  const selecionadas = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map(cb => cb.value);
  const dados = JSON.parse(localStorage.getItem("pilotos") || "[]");
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  selecionadas.forEach(cat => {
    const pilotos = dados.filter(p => p.categoria === cat && p.tempo && p.tempo.trim() !== "");

    pilotos.sort((a, b) => converteTempoParaSegundos(a.tempo) - converteTempoParaSegundos(b.tempo));

    const topPilotos = pilotos.slice(0, 5);

    const table = document.createElement("table");
    table.className = "table table-bordered table-striped";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr><th colspan="5">Categoria: ${cat}</th></tr>
      <tr>
        <th>Posição</th>
        <th>Piloto</th>
        <th>Carro</th>
        <th>Potência</th>
        <th>Tempo</th>
      </tr>
    `;

    const tbody = document.createElement("tbody");

    topPilotos.forEach((p, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.nome}</td>
        <td>${p.carro}</td>
        <td>${p.potencia} cv</td>
        <td>${p.tempo}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
  });
}

// =============================
// Função: mostrarMensagem
// Mostra mensagem de sucesso ao cadastrar/editar Piloto
// =============================
function mostrarMensagem() {
  const msg = document.getElementById("msg-sucesso");
  if (!msg) {
    console.error("Elemento #msg-sucesso não encontrado!");
    return;
  }

  msg.classList.remove("d-none", "fade");
  msg.classList.add("show");
  setTimeout(() => {
    msg.classList.remove("show");
    setTimeout(() => msg.classList.add("d-none"), 300);
  }, 2000);
}