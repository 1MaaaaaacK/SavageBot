const { WrongChannel, SugestaoLog } = require('./embed');
module.exports = {
    name: 'sugestao',
    description: 'Fazer sugestão',
    usage: '',
    cooldown: 30,
    permissions: false,
    args: 1,
    async execute(client, message, args) {
        if (message.channel.id !== '778411417291980830')
            return (
                message.channel.send(WrongChannel(message)).then((m) => {
                    m.delete({ timeout: 5000 });
                }),
                client.channels.cache
                    .get('770401787537522738')
                    .send(`<@${message.author.id}> usou o comando !sugestao fora do chat sugestao!!`)
            );

        let sugestao = args[0];

        client.channels.cache
            .get('778411417291980830')
            .send(SugestaoLog(message, sugestao))
            .then((message) => message.react('778432828148023297').then(() => message.react('778432818862227526')));

        client.channels.cache.get('770401787537522738').send(`<@${message.author.id}> enviou uma sugestão!`);
    },
};
