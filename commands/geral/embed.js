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

exports.PerfilInfoGenerating = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#cce336')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Gerando informações do seu perfil, aguarde <a:savage_loading:837104765338910730>`
        );
    return embed;
};

exports.PerfilWrong = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Algo deu errado, confira se você pegou o link certo do seu perfil!!`
        );
    return embed;
};
