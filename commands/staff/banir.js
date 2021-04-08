const Discord = require('discord.js');
const { connection } = require('../../configs/config_privateInfos');

const { BANtutorial, BANplayerError } = require('../../embed/error');
const { BANsucesso } = require('../../embed/sucesso');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('778273624305696818')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let nick = splitarg[0],
        steamid = splitarg[1],
        tempo = splitarg[2],
        reason = splitarg[3];
    if (!nick || !steamid || !tempo || !reason)
        return message.channel.send(BANtutorial(message)).then((m) => m.delete({ timeout: 10000 }));

    const logBan = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`**DISCORD**`)
        .addFields(
            { name: 'Nick Do Acusado', value: nick },
            { name: 'Steamid', value: steamid },
            {
                name: 'Tempo Do Banimento',
                value: tempo == 0 ? '**PERMANENTE**' : tempo + ' ' + 'Minuto(s)',
            },
            { name: 'Motivo', value: reason }
        )
        .setFooter(`Banido Pelo ${message.author.username}`);

    let timeNow = Date.now();
    timeNow = Math.floor(timeNow / 1000);

    let timeEnd = timeNow + tempo * 60;
    try {
        let sqlBans =
                'INSERT INTO sb_bans (authid, name, created, ends, length, reason, aid, sid, country, type) VALUES ?',
            SqlBan_VALUES = [[`${steamid}`, `${nick}`, timeNow, timeEnd, tempo, reason, 22, 0, null, 0]];

        connection.query(sqlBans, [SqlBan_VALUES], function (err) {
            if (err)
                return client.channels.cache.get('770401787537522738').send(BANplayerError(message)), console.log(err);
            client.channels.cache.get('721854111741509744').send(logBan);
            message.channel.send(BANsucesso(message, nick, steamid)).then((m) => m.delete({ timeout: 10000 }));
        });
    } catch (error) {
        client.channels.cache.get('770401787537522738').send(BANplayerError(message));
        console.log(error);
    }
};
exports.help = {
    name: 'banir',
};
