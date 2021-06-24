const Discord = require('discord.js');

exports.PlayerDiscordNotFound = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${message.author}, Não achei o discord desse player !`);
    return embed;
};

exports.InternalServerError = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Houve um erro interno, contate o 1mack !`
        );
    return embed;
};

exports.WrongServer = function (message, serversInfos) {
    const embed = new Discord.MessageEmbed().setColor('#ff0000').setDescription(
        `<a:warning_savage:856210165338603531> ${
            message.author
        }, você errou o servidor. \n\n**Esses são os servidores registrados:** \n\`\`\`${serversInfos.map(function (
            server
        ) {
            return ` ${server.name}`;
        })}\`\`\``
    );
    return embed;
};

exports.GerenteError = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, você não pode ter esse servidor como alvo, pois não é o gerente dele !`
        );
    return embed;
};

exports.RenameError = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, não consegui renomear o player, faça isso manualmente !`
        );
    return embed;
};

exports.WrongRole = function (message, cargosCertos, bool) {
    const embed = new Discord.MessageEmbed().setColor('#ff0000').setDescription(
        `<a:warning_savage:856210165338603531> ${
            message.author
        }, você errou o cargo. \n\n**Esses são os cargos certos:** \n\`\`\`${cargosCertos.map(function (server) {
            if (server == 'vip' && bool == true) {
                return '';
            } else {
                return ` ${server}`;
            }
        })}\`\`\``
    );
    return embed;
};

exports.ArgsFail = function (message, prefix, command, usage) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, você escreveu o comando errado !\nA forma correta de usar é: **!${command} ${usage}**`
        );
    return embed;
};

exports.MissinPermissions = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, você não tem permissão para usar esse comando !`
        );
    return embed;
};

exports.AwaitCooldown = function (message, timeLeft, command) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${
                message.author
            }, você só poderá usar o comando ***${command.name.toUpperCase()}*** daqui **${timeLeft.toFixed(
                1
            )} segundos** !`
        );
    return embed;
};
