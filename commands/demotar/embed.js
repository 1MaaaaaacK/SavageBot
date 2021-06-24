const Discord = require('discord.js');

exports.MackNotTarget = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${message.author}, você não pode ter o 1Mack como alvo !`);
    return embed;
};

exports.SteamidNotFound = function (message, servidor) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`<a:warning_savage:856210165338603531> ${message.author}, não encontrei ninguém com essa steamid no servidor ${servidor}!`);
    return embed;
};

exports.PlayerDiscordRoleNotFound = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, não achei o discord desse player, você terá que remover o cargo dele do discord manualmente !`
        );
    return embed;
};

exports.DemotedLog = function (fetchUser, steamid, extra, message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(fetchUser.username)
        .addFields(
            {
                name: 'discord',
                value: fetchUser,
            },
            { name: 'Steamid', value: steamid },
            { name: 'Observações', value: extra }
        )
        .setFooter(`Demotado Pelo ${message.author.username}`);
    return embed;
};
exports.DemotedSendMSG = function (fetchUser, steamid, servidor, extra) {
    const embed = new Discord.MessageEmbed()
        .setColor('FF0000')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(
            `***Você foi demotado!!***\n\nAgradecemos o tempo que passou conosco, porém tudo uma hora chega ao Fim...`
        )
        .addFields(
            { name: '**STEAMID**', value: `\`\`\`${steamid}\`\`\`` },
            { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
            { name: '**Motivo**', value: `\`\`\`${extra}\`\`\`` }
        );
    return embed;
};

exports.DemotedAskConfirm = function (message, rows) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ffff00')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author} Tem certeza que quer fazer isso ? \n\n**Eu achei ${rows.length} player com essa SteamID** \n\`\`\`Digite SIM ou NÃO\`\`\``
        );
    return embed;
};
