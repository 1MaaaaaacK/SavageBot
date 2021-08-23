
module.exports = {
    name: 'ready',
    once: 'once',
    async execute(client) {
        console.log('Conectado como ' + client.user.tag);
        client.user.setActivity('Savage Servidores');
    },
};
