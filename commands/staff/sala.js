module.exports.run = async (client, message, args) => {
    if (
        !message.member.roles.cache.find(
            (m) =>
                m.name.includes('Comprado') ||
                m.id == '753728995849142364' ||
                m.id == '711022747081506826' ||
                m.id == '649398805040594946'
        )
    )
        return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let name = splitarg[0];

    if (!name)
        return message.channel
            .send(`${message.author} **| Você errou o comando, a forma certa de usar é: !sala nomeDaSala**`)
            .then((m) => m.delete({ timeout: 10000 }));

    let guild = client.guilds.cache.get('343532544559546368');

    const canal = guild.channels.cache.find(
        (channel) =>
            channel.type == 'voice' &&
            channel.parentID == '840826127999565894' &&
            channel.name.includes(message.author.id)
    );

    client.channels.cache
        .get('840936627839828068')
        .messages.fetch()
        .then((m) => {
            const findChannel = m.find((a) => a.content.includes(message.author.id));
            if (findChannel == undefined) {
                return CriarSala();
            }
            let guild = client.guilds.cache.get('343532544559546368');

            const canal = guild.channels.cache.find(
                (channel) =>
                    channel.type == 'voice' &&
                    channel.parentID == '840826127999565894' &&
                    channel.id == findChannel.content.substr(-18, 20)
            );
            if (canal !== undefined) {
                return message.channel
                    .send(`${message.author} **| Você já possui um canal, <#${canal.id}>**`)
                    .then((m) => m.delete({ timeout: 10000 }));
            } else {
                CriarSala();
            }
        });

    /* if (canal !== undefined) {
        return message.channel
            .send(`${message.author} **| Você já possui um canal, <#${canal.id}>**`)
            .then((m) => m.delete({ timeout: 10000 }));
    }  */
    async function CriarSala() {
        await message.guild.channels
            .create(`${name}`, {
                type: 'voice',
                parent: '840826127999565894',
                topic: 'teste',
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.author,
                        allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_ROLES'],
                    },
                ],
            })
            .then((m) => {
                message.channel
                    .send(`${message.author} **| Sala <#${m.id}> criada com sucesso!!**`)
                    .then((m) => m.delete({ timeout: 10000 }));
                let canal = client.channels.cache.get('840936627839828068');
                canal.send(`${message.author} criou a sala ${name} cujo id é ${m.id}`);
            });
    }
};

exports.help = {
    name: 'sala',
};
