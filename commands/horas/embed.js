const Discord = require('discord.js');

exports.HoursNotFoundError = function (interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${interaction.user}, Houve um erro ao procurar a hora desse player, provavelmente não existe esse servidor no sistema de horários !`
        );
    return embed;
};

exports.StaffHoursNotFound = function (interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${interaction.user}, não encontrei as horas desse staff !`);
    return embed;
};

exports.HorasLog = function (result, HourFormat, servidor, steamid, interaction) {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setTitle(result[0].name)
        .addFields(
            { name: `**Horas Jogadas**`, value: HourFormat(result[0].time) },
            { name: '**Servidor**', value: servidor.toUpperCase() },
            { name: '**Steamid**', value: steamid }
        )
        .setFooter(`Horas Requisitadas pelo ${interaction.user.username}`)
        .setTimestamp();
    return embed;
};
