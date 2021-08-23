const {checkChannels} = require('../handle/checks/checkChannels')
module.exports = {
    name: 'messageCreate',
    once: 'on',
    async execute(message, client) {
        checkChannels(message, client)
        
    },
} 
 