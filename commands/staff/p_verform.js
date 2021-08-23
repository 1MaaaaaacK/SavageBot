const Discord = require('discord.js');
const wait = require('util').promisify(setTimeout);
const { connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const { GerenteError, PlayerDiscordNotFound } = require('../../embed/geral');
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
    options: [
        {name: 'servidor', type: 3, description: 'Escolha um servidor', required: true, choices: serversInfos.map(m => { return {name: m.name, value: m.name}})}
    ],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '711022747081506826', type: 1, permission: true}], //Gerente
    async execute(client, interaction) {
        let servidor = interaction.options.getString('servidor')

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (!interaction.member._roles.find(m => m == serversInfosFound.gerenteRole))
        return interaction.reply({embeds: [GerenteError(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        const con = connection.promise();

        let canalCheck = client.channels.cache.find((m) => m.name === `verform${servidor}→${interaction.user.id}`);

        if (canalCheck === undefined) {
            await interaction.guild.channels.create(`verform${servidor}→${interaction.user.id}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
                parent: '818261624317149235',
            });
            canalCheck = client.channels.cache.find((m) => m.name === `verform${servidor}→${interaction.user.id}`);
        } else {
            return interaction.reply({embeds: [FormAlreadyOpened(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        }

        let guild = client.guilds.cache.get('792575394271592458');

        let canal = guild.channels.cache.find(
            (channel) => channel.name == servidor && channel.parentID == '839343718016614411'
        );
        canal = await canal.messages.fetch();

        canal = await canal.map((m) => m);
        if (canal == undefined) {
            return interaction.reply({embeds: [FormCompleted(interaction)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));
        }
        interaction.reply({embeds: [FormCreated(interaction, canalCheck)]}).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        for (let x in canal) {
            let canalAwait = canalCheck;
            await canalAwait.bulkDelete(100);

            let discord_id = canal[x].embeds[0].description.match(/\d+/)[0];

            let [result] = await con.query(
                `select form_messages_2Etapa.message_id, message_question, servidor, discord_id, awnser from form_messages_2Etapa
                inner join form_respostas_2Etapa
                on form_messages_2Etapa.message_id = form_respostas_2Etapa.message_id
                where form_respostas_2Etapa.discord_id = ${discord_id}`
            );

            if (result == '') {
                let logNotResult = await guild.channels.cache.find((channel) => channel.id == '843580489800745011');
                logNotResult.send({content: `**${discord_id}** estava sem respostas no form de **${servidor}**!`});
                canal[x].delete();
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

            await canalAwait.send({embeds: [formMessage]});
            if (formMessage2.fields != '') {
                await canalAwait.send({embeds: [formMessage2]});
            }
            if (formMessage3.fields != '') {
                await canalAwait.send({embeds: [formMessage3]});
            }

            const filter = (f) =>
                f.author == interaction.user && (f.content.toLowerCase() === 'aprovado' ||
                f.content.toLowerCase() === 'reprovado' ||
                f.content.toLowerCase() === 'proximo');

            await canalAwait
                .awaitMessages({ filter, max: 1, time: 1000000, errors: ['time'] })
                .then(async (collected) => {
                    collected = collected.first();
                    collected = collected.content.toLowerCase();

                    if (collected == 'proximo') {
                        return;
                    } else if (collected == 'reprovado') {
                        try {
                            var fetchUser = await client.users.fetch(discord_id);
                        } catch (error) {
                            canalAwait.send({embeds: [PlayerDiscordNotFound(interaction)]})
                                .then(async (m) => {
                                    await wait(5000)
                                    await m.delete()
                                });
                        }
                        canal[x].delete();

                        await con.query(`delete from form_respostas_2Etapa where discord_id = ${discord_id}`);

                        fetchUser.send({embeds: [LogReprovado(fetchUser)]});
                    } else {
                        try {
                            var fetchUser = await client.users.fetch(discord_id);
                            var fetchedUser = await client.guilds.cache
                                .get('343532544559546368')
                                .members.fetch(fetchUser);
                        } catch (error) {
                            return canalAwait.send({embeds: [PlayerDiscordNotFound(interaction)]})
                                .then(async (m) => {
                                    await wait(5000)
                                    await m.delete()
                                });
                        }
                        interaction.guild.members.cache.get(discord_id).roles.add('818257971133808660');

                        fetchUser.send({embeds: [LogAprovado(fetchUser)]});
                        client.channels.cache.get('848364797975068682').send({embeds: [LogAprovadoChannel(fetchUser, result)]});

                        let canalLogInfo = await guild.channels.cache.find(
                            (channel) => channel.name == servidor && channel.parentID == '842203130208321557'
                        );
                        await canalLogInfo.send({embeds: [logInfos(fetchUser, result)]});

                        canal[x].delete();

                        await con.query(`delete from form_respostas_2Etapa where discord_id = ${discord_id}`);
                    }
                })
                .catch(async () => {
                    return (
                        await canalAwait.send({content: `${interaction.user} **| Você não respondeu a tempo....Deletando Canal**`}),
                        await wait(6000),
                        await canalAwait.delete()
                    );
                });
        }

        await canalCheck.send({embeds: [FormCompleted(interaction)]});
        setTimeout(async function () {
            canalCheck.delete();
        }, 6000);
    },
};
