const Discord = require('discord.js');
const { connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const { WrongServer, GerenteError, PlayerDiscordNotFound } = require('../../embed/geral');
const {
    FormAlreadyOpened,
    FormCompleted,
    FormCreated,
    LogReprovado,
    LogAprovado,
    LogAprovadoChannel,
    logInfos,
} = require('./embed');

module.exports = {
    name: 'verform',
    description: 'Ver os formulários',
    usage: 'servidor',
    cooldown: 15,
    permissions: ['711022747081506826'], //Perm ban
    args: 1,
    async execute(client, message, args) {
        let servidor = String(args[0]).toLowerCase();

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (serversInfosFound == undefined)
            return message.channel
                .send(WrongServer(message, serversInfos))
                .then((m) => m.delete({ timeout: 10000 }).catch(() => {}));

        if (!message.member.roles.cache.has(serversInfosFound.gerenteRole))
            return message.channel.send(GerenteError(message)).then((m) => m.delete({ timeout: 7000 }));

        const con = connection.promise();

        let canalCheck = client.channels.cache.find((m) => m.name === `verform${servidor}→${message.author.id}`);

        if (canalCheck === undefined) {
            await message.guild.channels.create(`verform${servidor}→${message.author.id}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
                parent: '818261624317149235',
            });
            canalCheck = client.channels.cache.find((m) => m.name === `verform${servidor}→${message.author.id}`);
        } else {
            return message.channel.send(FormAlreadyOpened(message)).then((m) => m.delete({ timeout: 10000 }));
        }

        let guild = client.guilds.cache.get('792575394271592458');

        let canal = guild.channels.cache.find(
            (channel) => channel.name == servidor && channel.parentID == '839343718016614411'
        );
        canal = await canal.messages.fetch();

        canal = await canal.map((m) => m);
        if (canal == undefined) {
            return message.channel
                .send(FormCompleted(message))
                .then((m) => m.delete({ timeout: 7000 }).catch(() => {}));
        }
        message.channel.send(FormCreated(message, canalCheck)).then((m) => m.delete({ timeout: 5000 }).catch(() => {}));

        for (let x in canal) {
            let canalAwait = canalCheck;
            await canalAwait.bulkDelete(100).catch(() => {});

            let discord_id = canal[x].embeds[0].description.match(/\d+/)[0];

            let [result] = await con.query(
                `select form_messages_2Etapa.message_id, message_question, servidor, discord_id, awnser from form_messages_2Etapa
                inner join form_respostas_2Etapa
                on form_messages_2Etapa.message_id = form_respostas_2Etapa.message_id
                where form_respostas_2Etapa.discord_id = ${discord_id}`
            );

            if (result == '') {
                let logNotResult = await guild.channels.cache.find((channel) => channel.id == '843580489800745011');
                logNotResult.send(`**${discord_id}** estava sem respostas no form de **${servidor}**!`);
                canal[x].delete().catch(() => {});
                continue;
            }

            let formMessage = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${canal[x].embeds[0].title} → ${discord_id}`);
            let formMessage2 = new Discord.MessageEmbed().setColor('#0099ff').setTitle(``);
            let formMessage3 = new Discord.MessageEmbed().setColor('#0099ff').setTitle(``);

            let cont = 1;

            for (let i in result) {
                if (cont < 6) {
                    formMessage = formMessage.addFields(
                        {
                            name: `Pergunta ${result[i].servidor} número ${cont}`,
                            value: result[i].message_question,
                            inline: true,
                        },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: '\u200B', value: `***${result[i].awnser}***`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: false }
                    );
                    cont += 1;
                } else if (cont < 12) {
                    formMessage2 = formMessage2.addFields(
                        {
                            name: `Pergunta ${result[i].servidor} número ${cont}`,
                            value: result[i].message_question,
                            inline: true,
                        },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: '\u200B', value: `***${result[i].awnser}***`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: false }
                    );
                    cont += 1;
                } else {
                    formMessage3 = formMessage3.addFields(
                        {
                            name: `Pergunta ${result[i].servidor} número ${cont}`,
                            value: result[i].message_question,
                            inline: true,
                        },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: '\u200B', value: `***${result[i].awnser}***`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: false }
                    );
                    cont += 1;
                }
            }

            await canalAwait.send(formMessage).catch(() => {});
            if (formMessage2.fields != '') {
                await canalAwait.send(formMessage2).catch(() => {});
            }
            if (formMessage3.fields != '') {
                await canalAwait.send(formMessage3).catch(() => {});
            }

            const filter = (f) =>
                (f.author == message.author && f.content.toLowerCase() === 'aprovado') ||
                f.content.toLowerCase() === 'reprovado' ||
                f.content.toLowerCase() === 'proximo';

            await canalAwait
                .awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                .then(async (collected) => {
                    collected = collected.first();
                    collected = collected.content.toLowerCase();

                    if (collected == 'proximo') {
                        return;
                    } else if (collected == 'reprovado') {
                        try {
                            var fetchUser = await client.users.fetch(discord_id);
                        } catch (error) {
                            message.channel
                                .send(PlayerDiscordNotFound(message))
                                .then((m) => m.delete({ timeout: 12000 }).catch(() => {}));
                        }
                        canal[x].delete().catch(() => {});

                        await con.query(`delete from form_respostas_2Etapa where discord_id = ${discord_id}`);

                        fetchUser.send(LogReprovado(fetchUser));
                    } else {
                        try {
                            var fetchUser = await client.users.fetch(discord_id);
                            var fetchedUser = await client.guilds.cache
                                .get('343532544559546368')
                                .members.fetch(fetchUser);
                        } catch (error) {
                            return message.channel
                                .send(PlayerDiscordNotFound(message))
                                .then((m) => m.delete({ timeout: 12000 }).catch(() => {}));
                        }
                        message.guild.members.cache.get(discord_id).roles.add('818257971133808660');

                        fetchUser.send(LogAprovado(fetchUser));
                        client.channels.cache.get('848364797975068682').send(LogAprovadoChannel(fetchUser, result));

                        let canalLogInfo = await guild.channels.cache.find(
                            (channel) => channel.name == servidor && channel.parentID == '842203130208321557'
                        );
                        await canalLogInfo.send(logInfos(fetchUser, result));

                        canal[x].delete().catch(() => {});

                        await con.query(`delete from form_respostas_2Etapa where discord_id = ${discord_id}`);
                    }
                })
                .catch(() => {
                    return (
                        canalAwait.send(`${message.author} **| Você não respondeu a tempo....Deletando Canal**`),
                        setTimeout(async function () {
                            canalAwait.delete().catch(() => {});
                        }, 6000)
                    );
                });
        }

        await canalCheck.send(FormCompleted(message));
        setTimeout(async function () {
            canalCheck.delete().catch(() => {});
        }, 6000);
    },
};
