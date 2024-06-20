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

  inserirBtn.addEventListener("click", () => {
    const keywords = inputKeywords.value;
    const response = inputResponse.value;
    const date = new Date().toLocaleDateString("pt-BR");

    if (keywords && response) {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
          <td><input type="checkbox" class="row-checkbox" /></td>
          <td>${keywords}</td>
          <td>${response}</td>
          <td>${date}</td>
        `;
      tableBody.appendChild(newRow);
      clearForm();
    }
  });

  alterarBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const row = checkbox.parentElement.parentElement;
        row.cells[1].textContent = inputKeywords.value;
        row.cells[2].textContent = inputResponse.value;
        row.cells[3].textContent = new Date().toLocaleDateString("pt-BR");
        checkbox.checked = false; // desmarca a checkbox após a alteração
      }
    });
    clearForm(); // Limpa o formulário após a alteração
  });

  limparBtn.addEventListener("click", clearForm);

  deletarBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".row-checkbox:checked");
    checkboxes.forEach((checkbox) => {
      const row = checkbox.closest("tr");
      tableBody.removeChild(row);
    });
    clearForm();
  });

  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName === "TD") {
      selectedRow = target.parentElement;
      inputKeywords.value = selectedRow.cells[0].textContent;
      inputResponse.value = selectedRow.cells[1].textContent;
    }
  });

  selectAllCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  });

  function clearForm() {
    inputKeywords.value = "";
    inputResponse.value = "";
    selectedRow = null;
  }
});
