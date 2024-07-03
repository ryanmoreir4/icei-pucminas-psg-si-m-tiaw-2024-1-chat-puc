// Função para ler os dados de Respostas do JSON Server
async function leRespostas() {
  const response = await fetch('http://localhost:3000/respostas');
  const data = await response.json();
  return { Respostas: data };
}

// Função para adicionar uma nova resposta
async function adicionaResposta() {
  let strResposta = document.getElementById('campo-Resposta').value.trim();
  let strPalavrasChave = document.getElementById('campo-PalavrasChave').value.trim();

  if (strResposta === '' || strPalavrasChave === '') {
      alert('Por favor, preencha todos os campos.');
      return;
  }

  if (await verificaRespostaDuplicada(strResposta)) {
      alert('Esta resposta já está cadastrada.');
      return;
  }

  let palavrasChave = strPalavrasChave.split(',').map(p => p.trim());

  if (palavrasChave.length === 1) {
      alert('Por favor, separe as palavras-chave por vírgulas.');
      return;
  }

  if (await verificaPalavrasChaveDuplicadas(palavrasChave)) {
      alert('Algumas palavras-chave já estão cadastradas.');
      return;
  }

  let novaResposta = {
      texto: strResposta,
      palavras_chave: palavrasChave,
      avaliacoes: {
          util: 0,
          nao_util: 0
      }
  };
// teste
  const response = await fetch('http://localhost:3000/respostas', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(novaResposta)
  });

  if (response.ok) {
      document.getElementById('campo-Resposta').value = '';
      document.getElementById('campo-PalavrasChave').value = '';
      alert('Resposta adicionada com sucesso!');
      imprimeRespostas();
  } else {
      alert('Erro ao adicionar resposta.');
  }
}

document.getElementById('btn-inserir').addEventListener('click', adicionaResposta);

// Função para verificar resposta duplicada
async function verificaRespostaDuplicada(resposta) {
  let objDados = await leRespostas();
  return objDados.Respostas.some(item => item.texto === resposta);
}

// Função para verificar palavras-chave duplicadas
async function verificaPalavrasChaveDuplicadas(palavrasChave) {
  let objDados = await leRespostas();
  return palavrasChave.some(palavra => objDados.Respostas.some(item => item.palavras_chave.includes(palavra)));
}

// Função para remover respostas selecionadas
async function removeRespostasSelecionadas() {
  let checkboxes = document.querySelectorAll('#select-resposta:checked');
  if (checkboxes.length === 0) {
      alert('Por favor, selecione pelo menos uma resposta para deletar.');
      return;
  }

  if (confirm('Tem certeza que deseja remover essas respostas? Esta ação não poderá ser desfeita.')) {
      for (let checkbox of checkboxes) {
          const id = checkbox.getAttribute('data-id');
          await fetch(`http://localhost:3000/respostas/${id}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
      }
      imprimeRespostas();
  }
}

document.getElementById('btn-deletar').addEventListener('click', removeRespostasSelecionadas);

// Função para imprimir as respostas na tela
async function imprimeRespostas() {
  let respostasSalvas = document.getElementById('table-body');
  let strHtml = '';
  let objDados = await leRespostas();

  objDados.Respostas.forEach((resposta, i) => {
      strHtml += `<tr>
          <td>${resposta.palavras_chave.join(', ')}</td>
          <td>${resposta.texto}</td>
          <td>${resposta.avaliacoes.util}</td>
          <td>${resposta.avaliacoes.nao_util}</td>
          <td>${new Date().toLocaleString()}</td>
          <td><input type="checkbox" id="select-resposta" data-id="${resposta.id}"></td>
      </tr>`;
  });

  respostasSalvas.innerHTML = strHtml;
}

document.addEventListener('DOMContentLoaded', function() {
  imprimeRespostas();
});

// Limpar formulário
const btnCancelar = document.getElementById('btn-limpar');

btnCancelar.addEventListener('click', function() {
  document.getElementById('campo-Resposta').value = '';
  document.getElementById('campo-PalavrasChave').value = '';
});

// Função para alterar uma resposta
document.getElementById('btn-alterar').addEventListener('click', async () => {
  const novaResposta = document.getElementById('campo-Resposta').value.trim();
  const novasPalavrasChave = document.getElementById('campo-PalavrasChave').value.trim().split(',').map(p => p.trim());

  const checkboxes = document.querySelectorAll('#select-resposta:checked');
  const respostaId = checkboxes[0].getAttribute('data-id');

  const dadosAtualizados = {
      texto: novaResposta,
      palavras_chave: novasPalavrasChave
  };

  const response = await fetch(`http://localhost:3000/respostas/${respostaId}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizados)
  });

  if (response.ok) {
      alert('Resposta atualizada com sucesso!');
      limparFormulario();
      imprimeRespostas();
  } else {
      alert('Erro ao atualizar resposta.');
  }
});

// Função para limpar os campos do formulário
function limparFormulario() {
  document.getElementById('campo-Resposta').value = '';
  document.getElementById('campo-PalavrasChave').value = '';
};