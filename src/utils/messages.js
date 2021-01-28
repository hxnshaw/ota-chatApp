const generateMessages = (username, text) => {
    return {
        text,
        username,
        createdAt: new Date().getTime()
    }
}

module.exports = generateMessages