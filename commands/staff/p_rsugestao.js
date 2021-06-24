const Discord = require('discord.js');
const { WrongUsageOfCommand, newEmbed, UserSendEmbed } = require('./embed');
module.exports = {
    name: 'rsugestao',
    description: 'Responder as Sugestões',
    usage: 'ID da mensagem - aprovado ou reprovado - motivo(resposta)',
    cooldown: 0,
    permissions: ['832268791459086376'], //gerente
    args: 1,
    async execute(client, message, args) {
        let messageid = args[0],
            valido = String(args[1]).toLowerCase(),
            resposta = args[2];

        if (valido != 'aprovado' && valido != 'reprovado') {
            return message.channel
                .send(WrongUsageOfCommand(message))
                .then((m) => m.delete({ timeout: 10000 }).catch(() => {}));
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
                m.edit(newEmbed(valido, m, resposta, message));

                try {
                    let fetchUser = await client.users.fetch(m.embeds[0].title.substr(-22, 18));

                    fetchUser.send(UserSendEmbed(valido, messageid));
                } catch (err) {}
            });
        } catch (error) {
            console.log(error);
            client.channels.cache
                .get('770401787537522738')
                .send('<@323281577956081665> | **Houve um erro ao editar a msg!**');
        } finally {
        }
    },
};
