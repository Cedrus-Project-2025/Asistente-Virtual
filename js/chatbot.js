document.getElementById('send-btn').addEventListener('click',sendMessage);
document.getElementById('user-input').addEventListener('keypress',function(e){
    if(e.key=='Enter'){
        sendMessage();
    }
});
function sendMessage(){
    const inputField = document.getElementById('user-input')
    const userInput = inputField.value;
    if(userInput.trim() !== ''){
        displayMessage(userInput,'user');
        inputField.value = '';
        getBotResponse(userInput);
    }
}
function displayMessage(message,sender){
    const chatbox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message',sender);
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}
