module.exports = {
    name: 'ready',
    once: 'once',
    execute(client) {
        console.log('Conectado como ' + client.user.tag);
        client.user.setActivity('Savage Servidores');
        //client.channels.cache.get('808452907245895722').messages.fetch('808486818331885638');
    },
};
