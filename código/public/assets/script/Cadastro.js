$(document).ready(function () {
  // Função para ler dados dos usuários
  function lerUsuarios() {
    let usuarios = [];
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/usuarios",
      dataType: "json",
      async: false,
      success: function (data) {
        usuarios = data;
      },
      error: function (xhr, status, error) {
        console.error("Erro ao ler usuários:", error);
      },
    });
    return usuarios;
  }

  $("#excluir-usuario-btn").click(function () {
    const idUsuario = 0; // Substitua pelo ID do usuário que deseja excluir
    excluirUsuario(idUsuario);
  });

  // Função para adicionar um novo usuário
  function adicionarUsuario(novoUsuario) {
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/usuarios",
      data: JSON.stringify(novoUsuario),
      contentType: "application/json",
      success: function (response) {
        console.log("Usuário adicionado:", response);
        alert("Formulário enviado e processado com sucesso!");
        console.log("Redirecionando para a página de login...");
        window.location.href = "index.html";
      },
      error: function (xhr, status, error) {
        console.error("Erro ao adicionar usuário:", error);
        alert("Ocorreu um erro ao enviar o formulário: " + error);
      },
    });
  }

  function excluirUsuario(idUsuario) {
    $.ajax({
      type: "DELETE",
      url: `http://localhost:3000/usuarios/${idUsuario}`,
      success: function (response) {
        console.log("Usuário excluído com sucesso");
        // Aqui você pode adicionar lógica adicional após a exclusão, se necessário
      },
      error: function (xhr, status, error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Ocorreu um erro ao excluir o usuário: " + error);
      },
    });
  }

  // Função para verificar se o usuário já existe
  function usuarioExiste(email) {
    const usuarios = lerUsuarios();
    return usuarios.some((usuario) => usuario.email === email);
  }

  // Verificar se pelo menos uma checkbox está marcada
  function verificarCheckboxes() {
    return $('input[name="role"]:checked').length > 0;
  }

  // Obter os papéis selecionados
  function obterRoles() {
    let roles = [];
    $('input[name="role"]:checked').each(function () {
      roles.push($(this).val());
    });
    return roles;
  }

  $("#registration-form").submit(function (event) {
    event.preventDefault();

    // Validação dos campos
    let isValid = true;
    let fullName = $("#full-name").val();
    let age = $("#age").val();
    let contactNumber = $("#contact-number").val();
    let city = $("#city").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let confirmPassword = $("#confirm-password").val();
    let roles = obterRoles();

    // Limpa mensagens de erro anteriores
    $(".error").remove();

    if (!verificarCheckboxes()) {
      $(".header").after(
        '<span class="error">Por favor, selecione pelo menos um papel.</span>'
      );
      isValid = false;
    }

    if (password !== confirmPassword) {
      $("#confirm-password").after(
        '<span class="error">As senhas não coincidem.</span>'
      );
      isValid = false;
    }

    if (usuarioExiste(email)) {
      $("#email").after('<span class="error">Email já está em uso.</span>');
      isValid = false;
    }

    if (isValid) {
      // Adiciona o novo usuário
      const novoUsuario = {
        fullName,
        age,
        contactNumber,
        city,
        email,
        password,
        roles,
      };
      adicionarUsuario(novoUsuario);
      window.location.href = "TelaPrincipal.html"; // Caminho relativo para a página principal
    }
  });
});
