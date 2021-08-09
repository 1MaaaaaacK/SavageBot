const Discord = require('discord.js');
exports.NotTarget = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, você não pode ter o 1Mack como alvo/não pode setar Fundador, Diretor e Gerente!`
        );
    return embed;
};
exports.WorngTime = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Voce digitou o tempo errado, o tempo é em dias, ou seja, 1, 2, 3, 15, 30, 40... !`
        );
    return embed;
};
exports.logVip = function (fetchedUser, discord1, steamid, DataInicialUTC, DataFinalUTC, cargo, valor, extra, message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${fetchedUser.username}`)
        .addFields(
            { name: 'discord', value: discord1 },
            { name: 'Steamid', value: steamid },
            { name: 'Data da Compra', value: DataInicialUTC },
            { name: 'Data Final', value: DataFinalUTC == 0 ? '**PERMANENTE**' : DataFinalUTC },
            { name: 'Cargo', value: cargo },
            { name: 'Valor', value: valor },
            { name: 'Observações', value: extra }
        )
        .setFooter(`Setado Pelo ${message.author.username}`);
    return embed;
};

exports.vipSendMSG = function (fetchUser, cargo, tempo, servidor) {
    const embed = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(
            `***A sua compra foi concluída com sucesso!***\n\nAgradecemos pela confiança e esperamos que você se divirta com seu novo cargo 🥳`
        )
        .addFields(
            { name: '**Cargo**', value: `\`\`\`${cargo.toUpperCase()}\`\`\`` },
            { name: '**Tempo de Duração**', value: `\`\`\`${tempo == 0 ? 'Permanente' : `${tempo} Dias`}\`\`\`` },
            { name: '**Servidor Escolhido**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` }
        );
    return embed;
};

exports.AskQuestion = function (message) {
    const embed = new Discord.MessageEmbed().setColor('#cce336').setDescription(
        `<a:warning_savage:856210165338603531> ${message.author},  O player que voce esta tentando setar já possui um cargo.
        \n**Digite \`SIM\` - Para eu excluir o cargo anterior e setar o novo**
        \n**ou**\n\n**Digite \`NAO\` - Para que eu deixe o cargo antigo e não ponha o novo**`
    );
    return embed;
};

exports.SetSuccess = function (message, fetchedUser, cargo) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${message.author}, O **${fetchedUser.username}** foi setado com o cargo **${cargo}** in-game com sucesso !`
        );
    return embed;
};

exports.isDono = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Somente o 1MaaaaaacK pode setar alguém de dono !`
        );
    return embed;
};

exports.staffSendAllMSG = function (fetchUser, cargo, servidor) {
    const embed = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle('***Novo Staff***')
        .addFields(
            { name: 'Jogador', value: fetchUser.username },
            { name: 'Cargo', value: cargo.toUpperCase() },
            { name: 'Servidor', value: servidor.toUpperCase() }
        )
        .setThumbnail(fetchUser.avatarURL())
        .setTimestamp();
    return embed;
};
