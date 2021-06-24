const Discord = require('discord.js');

exports.WrongChannel = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Use o canal <#778411417291980830> para sugerir algo !`
        );
    return embed;
};
exports.SugestaoLog = function (message, sugestao) {
    const embed = new Discord.MessageEmbed()
        .setColor('#cce336')
        .setTitle(`***${message.author.username} (ID${message.author.id})***`)
        .setDescription(`**${sugestao}**`)
        .setFooter('!sugestao para sugerir');
    return embed;
};
