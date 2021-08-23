const Discord = require('discord.js');
const { query } = require('gamedig');
const {serversInfos} = require('../../configs/config_geral')
const { webhookIpServidores, webhookPlayersTotal } = require('../../configs/config_webhook');
const webhookIpServidoresSend = new Discord.WebhookClient({id: webhookIpServidores.id, token: webhookIpServidores.token});
const webhookPlayersTotalSend = new Discord.WebhookClient({id: webhookPlayersTotal.id, token: webhookPlayersTotal.token});
var Catch = [];

async function mapUpdate() {
    for (let i in serversInfos) {
        query({
            type: 'csgo',
            host: serversInfos[i].host,
            port: serversInfos[i].port,
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
    let CatchFormat =  Catch.map((m, i) => {
        return `<a:diamante:650792674248359936> **${m.name}** <a:diamante:650792674248359936>\n\n**Mapa:** ${m.mapa}\n**Players:** ${m.players}/${m.playersTotal}\n**IP:** steam://connect/${m.ip}${i + 1 == Catch.length ? '' : '\n▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂\n'}`
    })
    
    let embedImg = new Discord.MessageEmbed()
        .setColor('36393f')
        .setImage('https://cdn.discordapp.com/attachments/814295769699713047/877679866219233350/ip-dos-servidores.gif')
    let embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setDescription(CatchFormat.toString())
        .setFooter('A lista atualizada a cada 5 minutos')
        .setTimestamp()
let cont = 0, contTotal = 0
        for(let i in Catch) {
            cont += Catch[i].players
            contTotal += Catch[i].playersTotal
        }
    let EmbedPlayersTotal = new Discord.MessageEmbed()
        .setColor('#5F40C1')
        .setTitle('Players Online')
        .setTimestamp()
        .setDescription(`\`\`\`${cont}/${contTotal}\`\`\``)


        await webhookIpServidoresSend.send({
            username: 'SavageServidores',
            avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
            embeds: [embedImg, embed],
        }); 
        await webhookPlayersTotalSend.send({
        username: 'SavageServidores',
        avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
        embeds: [EmbedPlayersTotal],
    }); 
}
module.exports = {
    mapUpdate,
};
