const Discord = require('discord.js');
const { serversInfos } = require('../../configs/config_geral');
const { connection } = require('../../configs/config_privateInfos');
module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let discord = splitarg[0];

    if (!discord)
        return message.channel
            .send(`**${message.author} | A forma correta de usar é: !cargos @ do usuario**`)
            .then((m) => m.delete({ timeout: 10000 }));

    discord = discord.slice(0, -1).substring(3);

    try {
        var fetchUser = await client.users.fetch(discord);
    } catch (error) {
        return message.channel.send(`${message.author} **| Você escreveu o discord do player errado!**`);
    }

    let StaffFoundEmbed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(fetchUser.username);
    let StaffFoundEmbed2 = new Discord.MessageEmbed().setColor('#0099ff').setTimestamp();

    let rows, opa;
    const con = connection.promise();

    try {
        [rows] = await con.query(
            `select * from vip_sets inner join vip_servers
            on vip_sets.server_id = vip_servers.id
            where discord_id ='${discord}'`
        );
    } catch (error) {
        //tratar erro
        console.log(error);
    }
    if (rows == '') {
        return message.channel.send(`**<@${message.author.id}> | Não encontrei `).then((m) => {
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
};

exports.help = {
    name: 'cargos',
};
