const Discord = require('discord.js');
const { connection } = require('../../configs/config_privateInfos');
module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('778273624305696818')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let steamid = splitarg[0],
        reason = splitarg[1];

    if (!steamid || !reason)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> Para desbanir alguem basta digitar ***!desbanir Steamid do player - motivo do desban***`
            )
            .then((m) => m.delete({ timeout: 10000 }));

    const logDesban = new Discord.MessageEmbed()
        .setColor('#4287f5')
        .setTitle(`**DESBAN**`)
        .addFields({ name: 'Steamid', value: steamid }, { name: 'Motivo', value: reason })
        .setFooter(`Desbanido Pelo ${message.author.username}`);

    let timeNow = Date.now();
    timeNow = Math.floor(timeNow / 1000);

    try {
        let sqlDesban = `UPDATE sb_bans SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${reason}" WHERE authid = "${steamid}"`;

        connection.query(sqlDesban, function (err) {
            if (err)
                return (
                    client.channels.cache
                        .get('770401787537522738')
                        .send(`😫 **| <@${message.author.id}> Houve um erro ao tentar desbanir o player!**`),
                    console.log(err)
                );
            client.channels.cache.get('721854111741509744').send(logDesban);
            message.channel
                .send(
                    `🤡 **| <@${message.author.id}> O Player cuja Steamid é ${steamid} foi __desbanido__ com sucesso!!**`
                )
                .then((m) => m.delete({ timeout: 5000 }));
        });
    } catch (error) {
        client.channels.cache
            .get('770401787537522738')
            .send(
                `😫 **| <@${message.author.id}> Houve um erro ao tentar desbanir o player ou não há ninguem com essa steamid!!**`
            );
        console.log(error);
    }
};
exports.help = {
    name: 'desbanir',
};
