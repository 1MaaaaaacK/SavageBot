const Discord = require('discord.js');
const { query } = require('gamedig');
const { webhookIpServidores, webhookPlayersTotal } = require('../configs/config_webhook');
const webhookIpServidoresSend = new Discord.WebhookClient(webhookIpServidores.id, webhookIpServidores.token);
const webhookPlayersTotalSend = new Discord.WebhookClient(webhookPlayersTotal.id, webhookPlayersTotal.token);

var Catch = [];

async function mapUpdate() {
    const servers = [
        (jailbreak = {
            host: '',
            port: '',
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
    let Embed2 = new Discord.MessageEmbed().setColor('#5F40C1');
    let Embed3 = new Discord.MessageEmbed()
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
        } else {
            if (Catch[i].playersTotal !== undefined) {
                contPlayers += Catch[i].players;
                contPlayersTotal += Catch[i].playersTotal;
            }
            Embed3 = Embed3.addFields(
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
    await webhookIpServidoresSend.send({
        username: 'SavageServidores',
        avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
        embeds: [EmbedImg, Embed, Embed2, Embed3],
    });
    let Embed4 = new Discord.MessageEmbed()
        .setColor('#5F40C1')
        .setTitle('Players Online')
        .setTimestamp()
        .setDescription(`\`\`\`${contPlayers}/${contPlayersTotal}\`\`\``);

    await webhookPlayersTotalSend.send({
        username: 'SavageServidores',
        avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
        embeds: [Embed4],
    });
}
module.exports = {
    mapUpdate,
};
