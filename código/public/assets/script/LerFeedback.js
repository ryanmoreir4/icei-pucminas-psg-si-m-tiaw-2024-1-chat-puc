document.addEventListener("DOMContentLoaded", function () {
    // Função para buscar feedbacks do arquivo db.json
    async function fetchFeedbacks() {
        try {
            const response = await fetch("http://localhost:3000/feedbacks");
            const data = await response.json();
            const feedbacks = data;

            const tableBody = document.querySelector('#feedback-table tbody');
            tableBody.innerHTML = '';  

            feedbacks.forEach(feedback => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${feedback.id}</td>
                    <td>${feedback.text}</td>
                    <td><button class="delete-button" data-id="${feedback.id}">Deletar</button></td>
                `;
                tableBody.appendChild(row);
            });

            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', deleteFeedback);
            });
        } catch (error) {
            console.error('Erro ao buscar feedbacks:', error);
        }
    }

    // Função para deletar um feedback
    async function deleteFeedback(event) {
        const feedbackId = event.target.getAttribute('data-id');
        
        try {
            await fetch(`http://localhost:3000/feedbacks/${feedbackId}`, {
                method: 'DELETE',
            });
            alert('Feedback deletado com sucesso!');
            fetchFeedbacks(); 
        } catch (error) {
            console.error('Erro ao deletar feedback:', error);
            alert('Ocorreu um erro ao deletar o feedback. Por favor, tente novamente.');
        }
    }

    fetchFeedbacks();
});
