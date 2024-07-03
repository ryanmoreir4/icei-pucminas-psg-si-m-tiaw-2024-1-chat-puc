let conversationsList = [];

document.getElementById("btn-logo").addEventListener("click", function () {
  window.location.href = "TelaPrincipal.html";
});

document
  .getElementById("submitButton")
  .addEventListener("click", async function () {
    const userQuestion = document.getElementById("userInput").value;
    const chatBody = document.getElementById("chat-body");

    if (userQuestion === "") {
      alert("Por favor, digite uma dúvida antes de enviar.");
      return;
    }

    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.innerHTML = `<p>${userQuestion}</p>`;
    const userMessageId = `message-${Date.now()}`;
    userMessage.id = userMessageId;
    chatBody.appendChild(userMessage);

    const response = await fetch("http://localhost:3000/respostas");
    const data = await response.json();

    let botResponse = `<p>Desculpe, não entendi sua mensagem. Tente novamente.</p>`;
    let responseId = null;
    for (let item of data) {
      for (let keyword of item.palavras_chave) {
        if (userQuestion.toLowerCase().includes(keyword.toLowerCase())) {
          botResponse = `<p>${item.texto}</p>`;
          responseId = item.id;
          break;
        }
      }
    }

    const botMessage = document.createElement("div");
    botMessage.className = "message response";
    botMessage.innerHTML = botResponse;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "message-actions";

    const copyButton = document.createElement("button");
    copyButton.className = "copy-btn";
    copyButton.innerText = "Copiar";
    copyButton.addEventListener("click", function () {
      navigator.clipboard.writeText(botResponse.replace(/<\/?[^>]+(>|$)/g, ""));
      alert("Resposta copiada!");
    });

    const usefulButton = document.createElement("button");
    usefulButton.className = "emoji-btn";
    const usefulIcon = document.createElement("img");
    usefulIcon.src = "../assets/icones/icon.svg";
    usefulButton.appendChild(usefulIcon);
    usefulButton.addEventListener("click", function (event) {
      event.preventDefault();
      updateEvaluation(responseId, true, usefulButton, notUsefulButton);
      usefulButton.style.backgroundColor = "#4CAF50";
      notUsefulButton.style.backgroundColor = "";
    });

    const notUsefulButton = document.createElement("button");
    notUsefulButton.className = "emoji-btn";
    const notUsefulIcon = document.createElement("img");
    notUsefulIcon.src = "../assets/icones/icon2.svg";
    notUsefulButton.appendChild(notUsefulIcon);
    notUsefulButton.addEventListener("click", function (event) {
      event.preventDefault();
      updateEvaluation(responseId, false, usefulButton, notUsefulButton);
      notUsefulButton.style.backgroundColor = "#f44336";
      usefulButton.style.backgroundColor = "";
    });

    actionsDiv.appendChild(copyButton);
    actionsDiv.appendChild(usefulButton);
    actionsDiv.appendChild(notUsefulButton);
    botMessage.appendChild(actionsDiv);

    chatBody.appendChild(botMessage);

    document.getElementById("userInput").value = "";

    chatBody.scrollTop = chatBody.scrollHeight;

    addQuestionToHistory(userQuestion, chatBody.innerHTML);
  });

document
  .getElementById("btn-novaConversa")
  .addEventListener("click", function () {
    const chatBody = document.getElementById("chat-body");
    const userQuestion = document.getElementById("userInput").value;

    if (userQuestion.trim() !== "") {
      addQuestionToHistory(userQuestion, chatBody.innerHTML);
    }

    chatBody.innerHTML = "";
    document.getElementById("userInput").value = "";
  });

document.getElementById("btn-menu").addEventListener("click", function () {
  const menuModal = document.getElementById("menuModal");
  const container = document.querySelector(".container");
  const btnMenu = document.getElementById("btn-menu");

  if (menuModal.style.display === "none" || !menuModal.style.display) {
    const rect = btnMenu.getBoundingClientRect();
    menuModal.style.top = `${rect.bottom + window.scrollY}px`;
    menuModal.style.left = `${rect.left + window.scrollX}px`;
    menuModal.style.display = "block";
    container.classList.add("blur");
  } else {
    menuModal.style.display = "none";
    container.classList.remove("blur");
  }
});

document.getElementById("img-clear").addEventListener("click", function () {
  const conversations = document.getElementById("conversations");
  conversations.innerHTML = "";
  conversationsList = [];

  const menuModal = document.getElementById("menuModal");
  const container = document.querySelector(".container");
  menuModal.style.display = "none";
  container.classList.remove("blur");
});

function addQuestionToHistory(question, chatContent) {
  const conversationEntry = document.createElement("div");
  conversationEntry.className = "conversation";
  conversationEntry.innerHTML = `<p>${question}</p>`;
  conversationEntry.addEventListener("click", function () {
    document.getElementById("chat-body").innerHTML = chatContent;
  });

  conversationsList.push({ question, chatContent });

  document.getElementById("conversations").appendChild(conversationEntry);
}

async function updateEvaluation(
  responseId,
  isUseful,
  usefulButton,
  notUsefulButton
) {
  if (!responseId) return;

  const response = await fetch("http://localhost:3000/respostas");
  const data = await response.json();

  const item = data.find((item) => item.id === responseId);
  if (item) {
    if (isUseful) {
      item.avaliacoes.util += 1;
    } else {
      item.avaliacoes.nao_util += 1;
    }

    await fetch(`http://localhost:3000/respostas/${responseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avaliacoes: item.avaliacoes,
      }),
    });

    usefulButton.disabled = true;
    notUsefulButton.disabled = true;
  }
}

document.getElementById('btn-feedback').addEventListener('click', function() {
  window.location.href = '../Pages/Feedback.html'; 
});

// Fechar o modal ao clicar fora dele
window.addEventListener("click", function (event) {
  const menuModal = document.getElementById("menuModal");
  if (
    event.target !== document.getElementById("btn-menu") &&
    !menuModal.contains(event.target)
  ) {
    menuModal.style.display = "none";
    document.querySelector(".container").classList.remove("blur");
  }
});
