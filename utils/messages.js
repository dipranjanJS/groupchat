function formatMessage(username, text) {
    let time = new Date().getTime()
    return {
        username,
        text,
        time: time
    }
}

module.exports = {
    formatMessage
}