//Keep track of the users and their rooms

const users = []

//Add new user
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: "Username and Room are required!"
        }
    }

    const existingUser = users.find(user => {
        return user.username === username && user.room === room
    })

    if (existingUser) {
        return {
            error: "Username in use already!"
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

//User leaves chat
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//Get current user
const getUser = (id) => {
    return users.find(user => user.id === id)
}

//Get users in a room
const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}

