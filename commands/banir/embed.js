const Discord = require('discord.js');

exports.BanSucess = function (message, nick, steamid) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${message.author} O Player ${nick}, cuja Steamid é ${steamid} foi **banido** com sucesso !`
        );
    return embed;
};

exports.Banlog = function (nick, steamid, tempo, reason, message) {
    const embed = new Discord.MessageEmbed()
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
    return embed;
};

exports.BanError = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${message.author}, houve um erro ao tentar banir o player !`);
    return embed;
};
