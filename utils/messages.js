const moment = require('moment');
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment(new Date().getTime()).format('h:mm a')
    }
}

module.exports = {
    formatMessage
}