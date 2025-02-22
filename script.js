// Select the chat body where messages are displayed.
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-button");

const API_URL = {
    
}

const userData = {
    message: null
};

// Create a message element with dynamic classes and return it.
const createMessageElement = (content, classes) => {
    const div = document.createElement("div");
    div.classList.add("message", classes);
    div.innerHTML = content;
    return div;
};

const generateBotResponse = () => {

}

// Handle outgoing user messages.
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();

    // Clear the input after sending.
    messageInput.value = "";

    // Create and display the user message.
    const messageContent = `<div class="message-text">${userData.message}</div>`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    chatBody.appendChild(outgoingMessageDiv);

    // Simulate bot response with a thinking indicator after a delay.
    setTimeout(() => {
        const botMessageContent = `
            <svg class="bot-avatar" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="35" height="35"
                viewBox="0 0 512 512" xml:space="preserve">
               <g>
                   <circle style="fill:#55C1B4;" cx="256" cy="100.174" r="22.261"/>
                   <rect x="456.348" y="233.739" style="fill:#55C1B4;" width="44.522" height="133.565"/>
                   <rect x="11.13" y="233.739" style="fill:#55C1B4;" width="44.522" height="133.565"/>
               </g>
               <polygon style="fill:#C8EBE3;" points="167.699,166.957 100.174,166.957 55.652,166.957 55.652,434.087 456.348,434.087 456.348,166.957 "/>
               <g>
                   <circle style="fill:#55C1B4;" cx="166.957" cy="278.261" r="22.261"/>
                   <circle style="fill:#55C1B4;" cx="345.043" cy="278.261" r="22.261"/>
               </g>
               <path style="fill:#3B629D;" d="M256,378.435c30.736,0,55.652-24.917,55.652-55.652H200.348C200.348,353.518,225.264,378.435,256,378.435z"/>
            </svg>
            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
        const incomingMessageDiv = createMessageElement(botMessageContent, "bot-message");
        // Append the bot's message (incomingMessageDiv) rather than the user message again.
        chatBody.appendChild(incomingMessageDiv);
        generateBotResponse();
    }, 600);
};

// Listen for keydown events on the input field.
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage) {
        handleOutgoingMessage(e);
    }
});

// Listen for click events on the send message button.
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
