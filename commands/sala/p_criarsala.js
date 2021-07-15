module.exports = {
    name: 'criarsala',
    description: 'Criar uma sala privada',
    usage: 'nomeDaSala',
    cooldown: 0,
    permissions: false,
    args: 1,
    async execute(client, message, args) {
        let nome = args[0];
        let LogChannel = client.channels.cache.get('840936627839828068');

        await LogChannel.messages.fetch().then((m) => {
            let ChannelFind = m.find((c) => c.content.includes(message.author.id));
            if (ChannelFind != undefined) {
                return message.channel.send('Você já possui um canal!').then((a) => a.delete({ timeout: 5000 }));
            }

            message.guild.channels
                .create(nome, {
                    type: 'voice',
                    permissionOverwrites: [
                        {
                            id: message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: message.author.id,
                            allow: ['VIEW_CHANNEL', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS'],
                        },
                    ],
                    parent: '840826127999565894',
                })
                .then(async (channel) => {
                    let msgLog = await LogChannel.send(`${message.author} criou o canal ${channel}`);
                    message.channel
                        .send(
                            `Canal ${channel} criado com sucesso\n**Obs: Você tem 30 segundos para entrar no canal, caso contrário ele será excluído!!**`
                        )
                        .then((a) => a.delete({ timeout: 10000 }));

                    setTimeout(() => {
                        if (message.guild.members.cache.get(message.author.id).voice.channel != channel) {
                            channel.delete();
                            msgLog.delete();
                        }
                    }, 30000);
                });
        });
    },
};
