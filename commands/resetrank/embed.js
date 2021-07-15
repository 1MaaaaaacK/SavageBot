const Discord = require('discord.js')
exports.CheckDatabaseError = function (message, servidores, serverNumber) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Aconteceu algum erro ao checar a Database do **${servidores[serverNumber]}**, contate o 1Mack !`
        );
    return embed;
};
exports.AskQuestion = function (message) {
    const embed = new Discord.MessageEmbed().setColor('#cce336').setDescription(
        `<a:warning_savage:856210165338603531> ${message.author},  tem certeza que quer resetar o rank de todos os servers e dar ***VIP*** para o TOP1?
        \n**Digite \`SIM\` - Para resetar**
        \n**ou**\n\n**Digite \`NAO\` - Para não resetar**`
    );
    return embed;
};

exports.Top1NotFound = function (message, servidores, serverNumber, procurar) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Não achei o discord do top1 do **${servidores[serverNumber]}**, <@${procurar.userid}> !`
        );
    return embed;
};

exports.logVip = function (fetchedUser, procurar, DataInicialUTC, DataFinalUTC, servidores, serverNumber) {
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${fetchedUser.user.username}`)
        .addFields(
            { name: 'discord', value: procurar.userid },
            { name: 'Steamid', value: procurar.steam },
            { name: 'Data do Set', value: DataInicialUTC },
            {
                name: 'Data Final',
                value: DataFinalUTC,
            },
            { name: 'Cargo', value: 'VIP' },
            { name: 'Valor', value: '0' },
            { name: 'Servidor', value: servidores[serverNumber] }
        )
        .setFooter(`Setado Pelo ${message.author.username}`);
    return embed;
};
exports.vipSendMSG = function (fetchUser, servidores, serverNumber) {
    const embed = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(
            `***Você recebeu um VIP de 1 Mês por ter estado no TOP5 do servidor ${servidores[serverNumber]}!***\n\nEsperamos que você se divirta com seu novo cargo 🥳`
        )
        .addFields(
            { name: '**Cargo**', value: `\`\`\`VIP\`\`\`` },
            {
                name: '**Tempo de Duração**',
                value: `\`\`\`30 Dias\`\`\``,
            },
            {
                name: '**Servidor**',
                value: `\`\`\`${servidores[serverNumber]}\`\`\``,
            }
        );
    return embed;
};
exports.vipSendAllMSG = function (fetchUser) {
    const embed = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle('***Novo VIP***')
        .addFields({ name: 'Jogador', value: fetchUser.username }, { name: 'Cargo', value: 'VIP' })
        .setThumbnail(fetchUser.avatarURL())
        .setTimestamp();
    return embed;
};

exports.SetSuccess = function (message, fetchedUser, servidores, serverNumber) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${message.author}, O **${fetchedUser.user.username}** foi setado com o cargo **VIP** in-game no **${servidores[serverNumber]}** com sucesso !`
        );
    return embed;
};
