const Discord = require('discord.js');
const { query } = require('gamedig');

var Catch = [];

async function mapUpdate(message, client, once, msg1, msg2) {
    const servers = [
        (jailbreak = {
            host: '131.196.196.197',
            port: '27170',
        }),
        (deathrun = {
            host: '131.196.196.197',
            port: '27080',
        }),
        (awp = {
            host: '131.196.196.197',
            port: '27090',
        }),
        (retake = {
            host: '131.196.196.197',
            port: '27130',
        }),
        (retakepistol = {
            host: '131.196.196.197',
            port: '27150',
        }),
        (mix4fun = {
            host: '131.196.196.197',
            port: '27190',
        }),
        (surf = {
            host: '131.196.196.197',
            port: '27110',
        }),
    ];

    for (let i in servers) {
        query({
            type: 'csgo',
            host: servers[i].host,
            port: servers[i].port,
        })
            .then((state) => {
                Catch[i] = {
                    name: state.name,
                    mapa: state.map,
                    players: state.raw.numplayers,
                    playersTotal: state.maxplayers,
                    ip: state.connect,
                };
            })
            .catch((error) => {
                Catch[i] = { name: 'off', mapa: 'off', players: 0, playersTotal: 0, ip: 'off' };
            });
    }
    if (Catch == '') return;

    const EmbedImg = new Discord.MessageEmbed()
        .setColor('#5F40C1')
        .setImage('https://cdn.discordapp.com/attachments/719223540783775804/730203351521689660/savage.png');

    let Embed = new Discord.MessageEmbed().setColor('#5F40C1');
    let Embed2 = new Discord.MessageEmbed()
        .setColor('#5F40C1')
        .setTimestamp()
        .setFooter('A lista atualizada a cada 5 minutos');

    let contPlayers = 0,
        contPlayersTotal = 0;

    for (let i in Catch) {
        if (i < 5) {
            if (Catch[i].playersTotal !== undefined) {
                contPlayers += Catch[i].players;
                contPlayersTotal += Catch[i].playersTotal;
            }
            Embed = Embed.addFields(
                {
                    name: `<a:diamante:650792674248359936> **${Catch[i].name}** <a:diamante:650792674248359936>`,
                    value: '\u200B',
                },
                { name: '**Mapa**', value: Catch[i].mapa, inline: true },
                { name: '**Players**', value: `${Catch[i].players}/${Catch[i].playersTotal}`, inline: true },
                {
                    name: '**Conexao Direta**',
                    value: 'steam://connect/' + Catch[i].ip,
                    inline: true,
                },
                { name: `\u200B`, value: '\u200B' }
            );
        } else if (i >= 5 && i < 10) {
            if (Catch[i].playersTotal !== undefined) {
                contPlayers += Catch[i].players;
                contPlayersTotal += Catch[i].playersTotal;
            }
            Embed2 = Embed2.addFields(
                {
                    name: `<a:diamante:650792674248359936> **${Catch[i].name}** <a:diamante:650792674248359936>`,
                    value: '\u200B',
                },
                { name: '**Mapa**', value: Catch[i].mapa, inline: true },
                { name: '**Players**', value: `${Catch[i].players}/${Catch[i].playersTotal}`, inline: true },
                {
                    name: '**Conexao Direta**',
                    value: 'steam://connect/' + Catch[i].ip,
                    inline: true,
                },
                { name: `\u200B`, value: '\u200B' }
            );
        }
    }
    
    if (once) {
        once = false
        await message.channel.send(EmbedImg);
        msg1 = await message.channel.send(Embed);
        msg2 = await message.channel.send(Embed2);
    } else {
        msg1.edit(Embed);
        msg2.edit(Embed2);
    }

    let Embed4 = new Discord.MessageEmbed()
        .setColor('#5F40C1')
        .setTitle('Players Online')
        .setTimestamp()
        .setDescription(`\`\`\`${contPlayers}/${contPlayersTotal}\`\`\``);

    await client.channels.cache.get('825124273655250984').send(Embed4);
}
module.exports = {
    mapUpdate,
};
