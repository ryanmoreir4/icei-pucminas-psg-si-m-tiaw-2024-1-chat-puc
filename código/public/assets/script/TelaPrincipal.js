document.getElementById('btn-logo').addEventListener('click', function() {
  window.location.href = 'TelaPrincipal.html';
});

document.getElementById('submitButton').addEventListener('click', async function() {
  // Obtém a pergunta do usuário
  const userQuestion = document.getElementById('userInput').value;
  const chatBody = document.getElementById('chat-body');

  if (userQuestion === '') {
    alert('Por favor, digite uma dúvida antes de enviar.');
    return; 
  }

  // Cria a mensagem do usuário
  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.innerHTML = `<p>${userQuestion}</p>`;
  chatBody.appendChild(userMessage);

  const response = await fetch('http://localhost:3000/respostas');
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

  // Cria a mensagem de resposta
  const botMessage = document.createElement('div');
  botMessage.className = 'message response';
  botMessage.innerHTML = botResponse;

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'message-actions';

  const copyButton = document.createElement('button');
  copyButton.className = 'copy-btn';
  copyButton.innerText = 'Copiar';
  copyButton.addEventListener('click', function() {
    navigator.clipboard.writeText(botResponse.replace(/<\/?[^>]+(>|$)/g, ""));
    alert('Resposta copiada!');
  });

  // Botão de útil
  const usefulButton = document.createElement('button');
  usefulButton.className = 'emoji-btn';
  const usefulIcon = document.createElement('img');
  usefulIcon.src = '../assets/icones/icon.svg';
  usefulButton.appendChild(usefulIcon);
  usefulButton.addEventListener('click', function() {
    updateEvaluation(responseId, true, usefulButton, notUsefulButton);
  });

  // Botão de não útil
  const notUsefulButton = document.createElement('button');
  notUsefulButton.className = 'emoji-btn';
  const notUsefulIcon = document.createElement('img');
  notUsefulIcon.src = '../assets/icones/icon2.svg'; 
  notUsefulButton.appendChild(notUsefulIcon);
  notUsefulButton.addEventListener('click', function() {
    updateEvaluation(responseId, false, usefulButton, notUsefulButton);
  });


  actionsDiv.appendChild(copyButton);
  actionsDiv.appendChild(usefulButton);
  actionsDiv.appendChild(notUsefulButton);
  botMessage.appendChild(actionsDiv);

  chatBody.appendChild(botMessage);

  usefulButton.addEventListener('click', function() {
    updateEvaluation(responseId, true, usefulButton, notUsefulButton);
    usefulButton.style.backgroundColor = '#4CAF50'; 
    notUsefulButton.style.backgroundColor = ''; 
  });

  notUsefulButton.addEventListener('click', function() {
    updateEvaluation(responseId, false, usefulButton, notUsefulButton);
    notUsefulButton.style.backgroundColor = '#f44336';
    usefulButton.style.backgroundColor = ''; 
  });

  document.getElementById('userInput').value = '';

  chatBody.scrollTop = chatBody.scrollHeight;
});

async function updateEvaluation(responseId, isUseful, usefulButton, notUsefulButton) {
  if (!responseId) return;

  const response = await fetch('http://localhost:3000/respostas');
  const data = await response.json();

  const item = data.find(item => item.id === responseId);
  if (item) {
    if (isUseful) {
      item.avaliacoes.util += 1;
    } else {
      item.avaliacoes.nao_util += 1;
    }

    await fetch(`http://localhost:3000/respostas/${responseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avaliacoes: item.avaliacoes
      })
    });

    usefulButton.disabled = true;
    notUsefulButton.disabled = true;
  }
}
