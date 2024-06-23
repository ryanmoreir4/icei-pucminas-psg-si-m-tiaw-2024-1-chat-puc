document.addEventListener('DOMContentLoaded', function() {
    const questionsList = document.getElementById('questions-list');
    const addQuestionButton = document.getElementById('add-question');
    const newQuestionInput = document.getElementById('new-question');

    let savedQuestions = [
        "Quais cursos são ofertados na PUC Minas São Gabriel?",
            "Quantos períodos Sistemas de Informação tem?",
            "A PUC Minas oferece bolsas de estudos?",
            "Qual professor leciona TIAW no primeiro semestre?",
    ];

    function displaySavedQuestions() {
        questionsList.innerHTML = ''; 
        savedQuestions.forEach(function(question, index) {
            const li = document.createElement('li');
            li.textContent = question;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar';
            deleteButton.classList.add('btn-delete');
            deleteButton.addEventListener('click', function() {
                deleteQuestion(index);
            });

            li.appendChild(deleteButton);
            questionsList.appendChild(li);
        });
    }

    function addQuestion() {
        const newQuestion = newQuestionInput.value.trim();
        if (newQuestion) {
            savedQuestions.push(newQuestion);
            newQuestionInput.value = ''; 
            displaySavedQuestions();
        }
    }

    function deleteQuestion(index) {
        savedQuestions.splice(index, 1);
        displaySavedQuestions();
    }

    addQuestionButton.addEventListener('click', addQuestion);

    displaySavedQuestions();
});