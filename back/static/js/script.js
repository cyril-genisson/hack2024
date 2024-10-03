const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatBody = document.getElementById('chat-body');

// Fonction qui envoie le message
function sendMessage() {
    const messageText = messageInput.value;

    if (messageText) {
        // Créer une nouvelle bulle de message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `<div class="bubble">${messageText}</div>`;
        chatBody.appendChild(messageDiv);

        // Afficher la bulle "En train d'écrire..."
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message received';
        typingIndicator.style.color = 'blue';
        typingIndicator.innerHTML = '<div class="bubble">En train de répondre...</div>';
        chatBody.appendChild(typingIndicator);

        // Afficher le message de confirmation après un délai
        setTimeout(() => {
            // Supprimer la bulle "En train d'écrire..."
            chatBody.removeChild(typingIndicator);

            // Afficher un message de confirmation
            const confirmationDiv = document.createElement('div');
            confirmationDiv.className = 'message received';
            confirmationDiv.innerHTML = '<div class="bubble">Bien reçu !</div>';
            chatBody.appendChild(confirmationDiv);

            // Faire défiler vers le bas pour voir le nouveau message
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000); // Délai de 1 seconde

        // Effacer l'input
        messageInput.value = '';
    }
}

// Écouteur d'événement pour le clic sur le bouton d'envoi
sendButton.addEventListener('click', sendMessage);

// Écouteur d'événement pour l'appui sur la touche "Entrée"
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});