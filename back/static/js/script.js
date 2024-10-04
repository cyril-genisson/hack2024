const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatBody = document.getElementById('chat-body');

// fonction qui affiche le contenu de data dans la bulle
function insertData(data, typingIndicator) {
        // Supprimer la bulle "En train d'écrire..."
        chatBody.removeChild(typingIndicator);

        // Afficher un message de confirmation
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'message received';
        confirmationDiv.innerHTML = '<div class="bubble">'+data.response+'</div>';
        chatBody.appendChild(confirmationDiv);

        // Faire défiler vers le bas pour voir le nouveau message
        chatBody.scrollTop = chatBody.scrollHeight;
}

async function loadFileContent() {
    let fileContent = '';

    try {
        const response = await fetch('/static/donnees.txt'); // Attendre la réponse
        fileContent = await response.text(); // Attendre que le texte soit extrait
        console.log(fileContent); // Afficher le contenu une fois récupéré
    } catch (error) {
        console.error('Erreur lors du chargement du fichier:', error);
    }

    return fileContent; // Retourner le contenu si nécessaire
}


// fonction qui affiche le contenu de data dans la bulle
function insertData(data, typingIndicator) {
        // Supprimer la bulle "En train d'écrire..."
        chatBody.removeChild(typingIndicator);

        // Afficher un message de confirmation
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'message received';
        confirmationDiv.innerHTML = '<div class="bubble">'+data.response+'</div>';
        chatBody.appendChild(confirmationDiv);

        // Faire défiler vers le bas pour voir le nouveau message
        chatBody.scrollTop = chatBody.scrollHeight;
}

async function loadFileContent() {
    let fileContent = '';

    try {
        const response = await fetch('/static/donnees.txt'); // Attendre la réponse
        fileContent = await response.text(); // Attendre que le texte soit extrait
        console.log(fileContent); // Afficher le contenu une fois récupéré
    } catch (error) {
        console.error('Erreur lors du chargement du fichier:', error);
    }

    return fileContent; // Retourner le contenu si nécessaire
}


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
        typingIndicator.innerHTML = '<div class="bubble">En train de répondre...</div>';
        chatBody.appendChild(typingIndicator);

        // Affichage de la méthode "curl" mais version javascript
        // const fileContent = loadFileContent();

       
        // Affichage de la méthode "curl" mais version javascript
        // const fileContent = loadFileContent();

        const url = '/chat';
        const data = {
          model: 'jpacifico/Chocolatine-3B-Instruct-DPO-Revised-Q4_K_M-GGUF',
          messages: [
            {
              role: 'user',
              content: messageText
            }
          ],
          stream: false
        };
        
        fetch(url, {
          method: 'POST', // Méthode HTTP POST
          headers: {
            'Content-Type': 'application/json', // Type de contenu JSON
          },
          body: JSON.stringify({"message": messageText}) // Conversion de l'objet en chaîne JSON
        })
        .then(response => response.json()) // Conversion de la réponse en JSON
        .then(data => insertData(data, typingIndicator)) // Affichage des données dans la console
        .catch(error => console.error('Erreur:', error)); // Gestion des erreurs


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