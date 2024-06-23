document.addEventListener("DOMContentLoaded", () => {
  const inserirBtn = document.querySelector(".btn-inserir");
  const alterarBtn = document.querySelector(".btn-alterar");
  const limparBtn = document.querySelector(".btn-limpar");
  const deletarBtn = document.querySelector(".btn-deletar");
  const inputKeywords = document.querySelector(".input-keywords");
  const inputResponse = document.querySelector(".input-response");
  const tableBody = document.querySelector("#table-body");
  const selectAllCheckbox = document.querySelector("#select-all");

  let selectedRow = null;

  // Função para ler os dados de Respostas do JSON Server
  async function leRespostas() {
    const response = await fetch("http://localhost:3000/respostas");
    const data = await response.json();
    return data;
  }

  // Função para imprimir as respostas na tela
  async function imprimeRespostas() {
    let respostas = await leRespostas();
    tableBody.innerHTML = "";
    respostas.forEach((resposta) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="row-checkbox" data-id="${
          resposta.id
        }" /></td>
        <td>${resposta.palavras_chave.join(", ")}</td>
        <td>${resposta.texto}</td>
        <td>${new Date(resposta.data_criacao).toLocaleString("pt-BR")}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Função para adicionar uma nova resposta
  async function adicionaResposta() {
    const keywords = inputKeywords.value.trim();
    const response = inputResponse.value.trim();

    if (keywords && response) {
      const palavrasChave = keywords.split(",").map((p) => p.trim());
      const novaResposta = {
        texto: response,
        palavras_chave: palavrasChave,
        avaliacoes: {
          util: 0,
          nao_util: 0,
        },
        data_criacao: new Date().toISOString(),
      };

      const result = await fetch("http://localhost:3000/respostas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaResposta),
      });

      if (result.ok) {
        alert("Resposta adicionada com sucesso!");
        clearForm();
        imprimeRespostas();
      } else {
        alert("Erro ao adicionar resposta.");
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  }

  inserirBtn.addEventListener("click", adicionaResposta);

  // Função para alterar uma resposta
  async function alterarResposta() {
    const checkboxes = document.querySelectorAll(".row-checkbox:checked");
    if (checkboxes.length !== 1) {
      alert("Por favor, selecione exatamente uma resposta para alterar.");
      return;
    }

    const id = checkboxes[0].getAttribute("data-id");
    const keywords = inputKeywords.value.trim();
    const response = inputResponse.value.trim();

    if (keywords && response) {
      const palavrasChave = keywords.split(",").map((p) => p.trim());
      const dadosAtualizados = {
        texto: response,
        palavras_chave: palavrasChave,
        data_criacao: new Date().toISOString(),
      };

      const result = await fetch(`http://localhost:3000/respostas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosAtualizados),
      });

      if (result.ok) {
        alert("Resposta atualizada com sucesso!");
        clearForm();
        imprimeRespostas();
      } else {
        alert("Erro ao atualizar resposta.");
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  }

  alterarBtn.addEventListener("click", alterarResposta);

  // Função para remover respostas selecionadas
  async function removeRespostasSelecionadas() {
    const checkboxes = document.querySelectorAll(".row-checkbox:checked");
    if (checkboxes.length === 0) {
      alert("Por favor, selecione pelo menos uma resposta para deletar.");
      return;
    }

    if (
      confirm(
        "Tem certeza que deseja remover essas respostas? Esta ação não poderá ser desfeita."
      )
    ) {
      for (const checkbox of checkboxes) {
        const id = checkbox.getAttribute("data-id");
        await fetch(`http://localhost:3000/respostas/${id}`, {
          method: "DELETE",
        });
      }
      imprimeRespostas();
    }
  }

  deletarBtn.addEventListener("click", removeRespostasSelecionadas);

  // Limpar formulário
  function clearForm() {
    inputKeywords.value = "";
    inputResponse.value = "";
    selectedRow = null;
  }

  limparBtn.addEventListener("click", clearForm);

  // Seleção de todas as checkboxes
  selectAllCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  });

  // Inicializar a tabela com dados do JSON Server
  imprimeRespostas();
});
