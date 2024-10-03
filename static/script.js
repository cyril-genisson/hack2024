const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('send-button');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    displayMessage(message, 'user-message');
    userInput.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        displayMessage(data.response, 'ai-message');
    } catch (error) {
        console.error('Error:', error);
        displayMessage('Sorry, an error occurred. Please try again.', 'ai-message error');
    }
}

function displayMessage(content, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});