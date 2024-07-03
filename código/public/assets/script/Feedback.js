document.addEventListener("DOMContentLoaded", function () {
    const feedbackForm = document.getElementById("feedback-form");
  
    feedbackForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const feedbackText = feedbackForm.querySelector("textarea[name='opinion']").value;
  
      fetch("http://localhost:3000/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: feedbackText
        })
      })
      .then(response => response.json())
      .then(data => {
        alert("Feedback enviado com sucesso!");
        feedbackForm.reset();
      })
      .catch(error => {
        console.error("Erro ao enviar feedback:", error);
        alert("Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.");
      });
    });
  
    const cancelButton = feedbackForm.querySelector(".btn.cancel");
    cancelButton.addEventListener("click", function () {
      feedbackForm.reset();
    });
  });