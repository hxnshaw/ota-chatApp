const path = require('path')
const http = require('http')
const express = require('express')
const app = express()

const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3333

const generateMessage = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const publicDirectorypath = path.join(__dirname, '../public')
app.use(express.static(publicDirectorypath))


const bot = "OtaBot"
io.on('connection', (socket) => {
    //When a user joins the chat
    socket.on('join', ({ username, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage(bot, 'Hey there!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(bot, `${user.username} has joined the chat`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

    })


    //users send messages
    socket.on('sendMessage', message => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, message))
    })

    //When a user disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(bot, `${user.username} has left the chat`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })

        }
    })
})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})



