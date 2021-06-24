const Discord = require('discord.js');

exports.SteamIdNotFound = function (message, servidor) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Não encontrei ninguém com essa steamid no servidor ${servidor} !`
        );
    return embed;
};
