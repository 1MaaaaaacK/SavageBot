const { connection } = require('../../configs/config_privateInfos');
const { PlayerDiscordNotFound, InternalServerError } = require('../../embed/geral');
const chalk = require('chalk');
const Discord = require('discord.js');
module.exports = {
    name: 'cargos',
    description: 'Ver os cargos do player in-game',
    usage: '@ do player',
    cooldown: 0,
    permissions: ['711022747081506826'], //Perm ban
    args: 1,
    async execute(client, message, args) {
        let discord = args[0];

        discord = discord.slice(0, -1).substring(3);

        try {
            var fetchUser = await client.users.fetch(discord);
        } catch (error) {
            return message.channel.send(PlayerDiscordNotFound(message));
        }

        let StaffFoundEmbed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(fetchUser.username);
        let StaffFoundEmbed2 = new Discord.MessageEmbed().setColor('#0099ff').setTimestamp();

        let rows;
        const con = connection.promise();

        try {
            [rows] = await con.query(
                `select * from vip_sets inner join vip_servers
            on vip_sets.server_id = vip_servers.id
            where discord_id ='${discord}'`
            );
        } catch (error) {
            return (
                message.channel.send(InternalServerError(message)).then((m) => m.delete({ timeout: 5000 })),
                console.error(chalk.redBright('Erro no Banimento'), error)
            );
        }
        if (rows == '') {
            return message.channel.send(`**<@${message.author.id}> | Não encontrei**`).then((m) => {
                m.delete({ timeout: 7000 });
            });
        }

        rows.forEach((m, i) => {
            if (i < 5) {
                StaffFoundEmbed = StaffFoundEmbed.addField(
                    `<a:diamante:650792674248359936> **${m.server_name}** <a:diamante:650792674248359936>`,
                    '\u200B'
                );

                StaffFoundEmbed = StaffFoundEmbed.addFields(
                    { name: `\u200B`, value: `**set**`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    {
                        name: `\u200B`,
                        value: `\`\`\`${`"${m.steamid}"  "@${m.cargo}" //${
                            m.isVip == 0
                                ? `${m.name}  (${m.discord_id})`
                                : `${m.name} (${m.date_create} - ${m.discord_id} - ${m.date_final})`
                        }`}\`\`\``,
                        inline: true,
                    }
                );
            } else {
                StaffFoundEmbed2 = StaffFoundEmbed2.addField(
                    `<a:diamante:650792674248359936> **${m.server_name}** <a:diamante:650792674248359936>`,
                    '\u200B'
                );

                StaffFoundEmbed2 = StaffFoundEmbed2.addFields(
                    { name: `\u200B`, value: `**set**`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    {
                        name: `\u200B`,
                        value: `\`\`\`${`"${m.steamid}"  "@${m.cargo}" //${
                            m.isVip == 0
                                ? `${m.name}  (${m.discord_id})`
                                : `${m.name} (${m.date_create} - ${m.discord_id} - ${m.date_final})`
                        }`}\`\`\``,
                        inline: true,
                    }
                );
            }
        });

        message.channel.send('**Te enviei os cargos desse staff no seu PV**').then((m) => m.delete({ timeout: 5000 }));
        await message.author.send(StaffFoundEmbed);
        if (StaffFoundEmbed2.fields != '') {
            await message.author.send(StaffFoundEmbed2);
        }
    },
};
