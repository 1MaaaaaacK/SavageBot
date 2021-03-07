const Discord = require('discord.js');
const client = new Discord.Client();

module.exports.run = async (client, message, args) => {
    message.delete({ timeout: 1000 });

    if (message.channel.id !== '778411417291980830')
        return (
            message.channel
                .send(`😫 **|** ***<@${message.author.id}> Use o canal <#778411417291980830> para sugerir algo!!***`)
                .then((m) => m.delete({ timeout: 5000 })),
            client.channels.cache
                .get('770401787537522738')
                .send(`<@${message.author.id}> usou o comando !sugestao fora do chat sugestao!!`)
        );

    let splitarg = args.join(' ').split(' - ');

    let sugestao = splitarg[0];

    if (!sugestao)
        return message.channel
            .send(
                `😫 **|** ***<@${message.author.id}>*** Para fazer uma sugestão basta digitar ***!sugestao Sua sugestão***`
            )
            .then((m) => m.delete({ timeout: 5000 }));

    const logSugestao = new Discord.MessageEmbed()
        .setColor('#cce336')
        .setTitle(`***${message.author.username}***`)
        .setDescription(`**${sugestao}**`)
        .setFooter('!sugestao para sugerir');

    client.channels.cache
        .get('778411417291980830')
        .send(logSugestao)
        .then((message) => message.react('778432828148023297').then(() => message.react('778432818862227526')));

    client.channels.cache.get('770401787537522738').send(`<@${message.author.id}> enviou uma sugestão!`);
};

exports.help = {
    name: 'sugestao',
};
