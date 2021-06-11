const socket = io('http://localhost:6000')
const messageContainer = document.getElementById('message-container')
const messageContainer2 = document.getElementById('message-container div')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const name = prompt(' choisir un username svp')
appendMessage('Vous etes en ligne')
socket.emit('new-user', name)
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})
socket.on('user-connected', name => {
    appendMessage(`${name} est connecté`)
})
socket.on('user-disconnected', name => {
    appendMessage(`${name} est deconnecté`)
})
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`Vous: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''

})
function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)

}


