//DOM Elements
const $messageForm = document.getElementById('message-form')
const $messageFormInput = document.querySelector('input')
const $messages = document.getElementById('messages')
const $sidebar = document.getElementById('sidebar')
const $chatMessages = document.querySelector('.chat__messages')

//Templates
const messageTemplate = document.getElementById('message-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

//access the username and room via the users input
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const socket = io()

//setup event listener from the server
socket.on('message', message => {
    console.log(message)
    html = Mustache.render(messageTemplate, {
        message: message.text,
        username: message.username,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    $chatMessages.scrollTop = $chatMessages.scrollHeight
})



//connect the frontend so the user can type and send messages to each other
$messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
    $messageFormInput.value = ''
    $messageFormInput.focus()

})

//Join the chat
socket.emit('join', { username, room }, error => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

//get info of a room to display
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
})
