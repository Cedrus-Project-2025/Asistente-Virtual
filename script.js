// Seleccionar elementos del DOM
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

const userData = {
    message: null
};

// api setup
const API_KEY = "AIzaSyCOTlzz1vt4yrV4B1QnaqldmPmq5LD8SoI"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Crear un mensaje dinámico con clases y devolverlo
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Generar respuesta del bot (función a desarrollar)
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");


    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [{
                parts: [{text: userData.message}]
            }]
        })
    }

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message)

        const apiResponseText = data.candidates[0].content.parts[0].text.trim();
        messageElement.innerText = apiResponseText;

        console.log(data);
    }   catch (error) {
        console.log(error);
    }
};

// Manejar mensajes salientes del usuario
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();

    if (!userData.message) return; // Evitar mensajes vacíos

    // Limpiar el input después de enviar
    messageInput.value = "";

    // Crear y mostrar el mensaje del usuario
    const messageContent = `<div class="message-text">${userData.message}</div>`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    chatBody.appendChild(outgoingMessageDiv);

    // Simular respuesta del bot con un indicador de "pensando..."
    setTimeout(() => {
        const botMessageContent = `
            <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 512 512">
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
        chatBody.appendChild(incomingMessageDiv);
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

// Capturar el evento "Enter" en el input para enviar mensajes
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && messageInput.value.trim()) {
        handleOutgoingMessage(e);
    }
});

// Manejar el botón de enviar mensaje
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));

