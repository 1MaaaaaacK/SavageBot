module.exports = {
    name: 'convidar',
    description: 'Convidar alguém para uma sala',
    usage: '@ do player',
    cooldown: 0,
    permissions: false,
    args: 1,
    async execute(client, message, args) {
        let LogChannel = client.channels.cache.get('840936627839828068');

        await LogChannel.messages.fetch().then((m) => {
            let ChannelFind = m.find((c) => c.content.includes(message.author.id));
            if (ChannelFind == undefined) {
                return message.channel
                    .send('Você não possui um canal!\nEscreve !sala para criar um!!')
                    .then((a) => a.delete({ timeout: 10000 }));
            }
            try {
                message.guild.channels.cache
                    .get(ChannelFind.content.slice(-19, -1))
                    .updateOverwrite(message.mentions.users.first(), {
                        VIEW_CHANNEL: true,
                    });
            } catch (error) {
                message.channel
                    .send(
                        'Não consegui convidar esse usuário.\nVeja se você possui uma sala ou se você marcou o usuário de forma errada!!'
                    )
                    .then((a) => a.delete({ timeout: 10000 }));
            }
        });
    },
};
