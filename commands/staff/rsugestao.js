const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('832268791459086376')) return;
    await message.delete({ timeout: 1000 });

    let splitarg = args.join(' ').split(' - ');

    let messageid = splitarg[0],
        valido = String(splitarg[1]).toLowerCase(),
        resposta = splitarg[2];

    if (!messageid || !resposta || !valido)
        return message.channel
            .send('Forma de Usar: ***!rsugestao IdDaMsg - aprovado ou reprovado - resposta***')
            .then((m) => m.delete({ timeout: 10000 }));

    if (valido != 'aprovado' && valido != 'reprovado') {
        return message.channel
            .send('Forma de Usar: ***!rsugestao IdDaMsg - aprovado ou reprovado - resposta***')
            .then((m) => m.delete({ timeout: 10000 }));
    }

    if (valido == 'aprovado') {
        valido = {
            color: '0CD531',
            title: 'Aprovado',
        };
    } else if (valido == 'reprovado') {
        valido = { color: 'CF1616', title: 'Reprovado' };
    }

    try {
        const canal = client.guilds.cache
            .get('343532544559546368')
            .channels.cache.find((channel) => channel.id === '778411417291980830');
        canal.messages.fetch(messageid).then(async (m) => {
            const newEmbed = new Discord.MessageEmbed()
                .setColor(valido.color)
                .setTitle(`***${valido.title}***`)
                .addFields(
                    { name: '\u200B', value: '**Sugerido Por**', inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: `\u200B`, value: m.embeds[0].title, inline: true },
                    { name: '\u200B', value: `**Sugestão**`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: `\u200B`, value: m.embeds[0].description, inline: true },
                    { name: '\u200B', value: '**Resposta**', inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: `\u200B`, value: resposta, inline: true },
                    { name: '\u200B', value: '\u200B', inline: false }
                )
                .setFooter(`Respondido pelo ${message.author.username}`)
                .setTimestamp();

            m.edit(newEmbed);

            try {
                let fetchUser = await client.users.fetch(m.embeds[0].title.substr(-22, 18));

                const UserSendEmbed = new Discord.MessageEmbed()
                    .setColor(valido.color)
                    .setTitle(`Sua sugestão foi ${valido.title.substring(0, valido.title.length - 1) + 'a'}!`)
                    .setDescription(`> Link da sua sugestão: 
                > https://discord.com/channels/343532544559546368/778411417291980830/${messageid}`);
                fetchUser.send(UserSendEmbed);
            } catch (err) {}
        });
    } catch (error) {
        console.log(error);
        client.channels.cache
            .get('770401787537522738')
            .send('<@323281577956081665> | **Houve um erro ao editar a msg!**');
    } finally {
    }
};
exports.help = {
    name: 'rsugestao',
};
