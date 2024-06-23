document.addEventListener('DOMContentLoaded', function() {
    const questionsList = document.getElementById('questions-list');

    // Exemplo de perguntas salvas (simulação de dados)
    const savedQuestions = [
        "Quais cursos são ofertados na PUC Minas São Gabriel?",
            "Quantos períodos Sistemas de Informação tem?",
            "A PUC Minas oferece bolsas de estudos?",
            "Qual professor leciona TIAW no primeiro semestre?",
    ];

    // Função para exibir as perguntas salvas na lista
    function displaySavedQuestions() {
        savedQuestions.forEach(function(question) {
            const li = document.createElement('li');
            li.textContent = question;
            questionsList.appendChild(li);
        });
    }

    // Chamada inicial para exibir as perguntas
    displaySavedQuestions();
});
