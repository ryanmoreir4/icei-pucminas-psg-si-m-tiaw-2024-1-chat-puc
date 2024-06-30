$(document).ready(function() {
    $('#registration-form').submit(function(event) {
      event.preventDefault();
  
      const email = $('#email').val();
      const password = $('#password').val();
  
      console.log('Tentando login com email:', email, 'e senha:', password);
  
      // Fazendo uma requisição GET ao JSON Server para verificar o usuário
      fetch(`http://localhost:3000/usuarios?email=${email}&password=${password}`)
        .then(response => {
          console.log('Resposta do servidor:', response);
          if (!response.ok) {
            throw new Error('Erro na requisição ao servidor');
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados recebidos do servidor:', data);
          if (data.length > 0) {
            const user = data[0]; // Obter o primeiro usuário que corresponde à consulta
            console.log('Usuário encontrado:', user);
            if (user.email === 'admin@abc.com') {
              // Usuário é o administrador, redirecionar para a página de administração
              alert('Login de administrador realizado com sucesso!');
              window.location.href = 'TelaAdmin.html'; // Caminho relativo para a página de administração
            } else {  
              // Usuário não é o administrador, redirecionar para a página principal
              alert('Login realizado com sucesso!');
              window.location.href = 'TelaPrincipal.html'; // Caminho relativo para a página principal
            }
          } else {
            // Usuário não encontrado ou senha incorreta
            alert('Email ou senha incorretos. Tente novamente.');
          }
        })
        .catch(error => {
          console.error('Erro:', error);
          alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
        });
    });
  });
  