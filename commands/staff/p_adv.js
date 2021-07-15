const { LogAdv, AvdSuccess } = require('./embed');

module.exports = {
    name: 'adv',
    description: 'Aplicar advertência em um staff',
    usage: '@ do Player - motivo',
    cooldown: 0,
    permissions: ['711022747081506826', '831219575588388915'], // Gerente
    args: 2,
    async execute(client, message, args) {
        let discord = args[0],
            reason = args[1];

        const usuarioId = discord.slice(0, -1).substring(3),
            userCatch = client.guilds.cache.get('343532544559546368').members.cache.get(usuarioId);
        let adv;

        if (
            !userCatch._roles.find((roles) => roles == '607704706088828955') &&
            !userCatch._roles.find((roles) => roles == '607704708051894272')
        ) {
            userCatch.roles.add('607704706088828955');
            adv = '1';
        } else if (
            userCatch._roles.find((roles) => roles == '607704706088828955') &&
            userCatch._roles.find((roles) => roles == '607704708051894272')
        ) {
            return client.channels.cache
                .get('751428595536363610')
                .send(message.channel.send(ADVaviso(message, usuarioId)));
        } else {
            userCatch.roles.add('607704708051894272');
            adv = '2';
        }

        message.channel.send(AvdSuccess(message)).then((m) => m.delete({ timeout: 5000 }));

        client.channels.cache.get('779013964138414090').send(LogAdv(discord, adv, reason, message));
    },
};
