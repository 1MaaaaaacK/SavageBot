module.exports = {
    name: 'ready',
    once: 'once',
    execute(client) {
        console.log('Conectado como ' + client.user.tag);
        client.user.setActivity('Savage Servidores');
        //client.channels.cache.get('717331699125714986').send('Reloading Infos <a:savage_loading:837104765338910730>');
    },
};
