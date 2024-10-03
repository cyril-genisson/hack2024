document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');

    // Add event listener for Enter key
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            sendMessage(); // Call the sendMessage function
        }
    });
});

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const messageText = userInput.value.trim();
    if (!messageText) return; // Don't send if the input is empty

    // Append user's message to chat
    const messagesDiv = document.getElementById('messages');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerText = messageText;
    messagesDiv.appendChild(userMessage);

    // Scroll to the bottom of the messages
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Clear input field
    userInput.value = '';

    try {
        // Send message to the backend
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText })
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        // Append AI's response to chat
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai-message';
        aiMessage.innerText = result.response || `Error: ${result.error}`;
        messagesDiv.appendChild(aiMessage);

        // Scroll to the bottom of the messages
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
        console.error('Error fetching the response:', error);
    }
}