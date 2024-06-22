document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); 

    const feedbackForm = document.getElementById('feedback-form');
    const ratingValue = document.querySelector('input[name="rating"]');

    if (!feedbackForm || !ratingValue) {
        console.error('Form or rating input not found');
        return;
    }

    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('Form submitted');

        const opinions = [
            { "opinion": "Há algumas informações desatualizadas sobre os cursos oferecidos na unidade São Gabriel da PUC." },
            { "opinion": "As informações fornecidas são precisas e atualizadas." },
            { "opinion": "Além da unidade São Gabriel, as unidades Coração Eucarístico, Barreiro, Betim, Contagem, Poços de Caldas, Praça da Liberdade e Serro também oferecem o curso de Direito." },
            { "opinion": "Sou uma pessoa interessada em ingressar na PUC. Entrei no Chat PUC e consegui tirar todas as minhas dúvidas." },
            { "opinion": "Sou intercambista e me interessei bastante em ingressar na unidade São Gabriel da PUC para fazer o curso de Jogos Digitais." },
            { "opinion": "Gostei bastante das informações oferecidas sobre a PUC Coração Eucarístico. Acho que vou estudar lá!" },
            { "opinion": "Pesquisei no Chat PUC sobre a unidade São Gabriel e, por ser perto da minha casa e oferecer o curso de Sistemas de Informação, acho que vou estudar lá!" }
        ];

        const sendFeedback = (feedbackData) => {
            return fetch('/submit-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            }).then(response => {
                console.log('Fetch response status:', response.status);
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            });
        };

        Promise.all(opinions.map(opinion => {
            const feedbackData = {
                rating: parseInt(ratingValue.value, 10),
                opinion: opinion.opinion
            };

            console.log('Feedback data:', JSON.stringify(feedbackData));
            return sendFeedback(feedbackData).catch(error => {
                console.error('Erro ao enviar feedback:', error);
            });
        }))
        .then(responses => {
            console.log('All feedback responses:', responses);
            alert('Obrigado(a) pelo seu feedback!');
        });
    });
});