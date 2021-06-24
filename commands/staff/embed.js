const Discord = require('discord.js');

exports.LogAdv = function (discord, adv, reason, message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`**ADV**`)
        .addFields(
            {
                name: 'Staff:',
                value: `**${discord}**`,
            },
            { name: 'ADV:', value: `**${adv}**` },
            { name: 'Motivo:', value: reason }
        )
        .setFooter(`Aplicada Pelo ${message.author.username}`);
    return embed;
};

exports.AvdSuccess = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`<a:right_savage:856211226300121098> ${message.author}, Adv aplicada no staff com sucesso !`);
    return embed;
};

exports.WrongUsage = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Voce não pode por o título, a descrição e a imagem como 'null' todos ao mesmo tempo !`
        );
    return embed;
};

exports.WrongNumber = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, A quantidade máxima de mensagens que eu posso deletar são 99 e a mínima é 1 !`
        );
    return embed;
};

exports.MissingPermission = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Você não tem permissão para excluir msgs de bots. Irei excluir apenas as msgs de players !`
        );
    return embed;
};

exports.OldMessage = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Não consegui excluir as msgs, provavelmente tem alguma que é mais antiga do que 14 dias! !`
        );
    return embed;
};

exports.WrongUsageOfCommand = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Você escreveu algo errado, digite !rsugestao para ver a forma correta de usar o comando !`
        );
    return embed;
};
exports.newEmbed = function (valido, m, resposta, message) {
    const embed = new Discord.MessageEmbed()
        .setColor(valido.color)
        .setTitle(`***${valido.title}***`)
        .addFields(
            { name: '\u200B', value: '**Sugerido Por**', inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `\u200B`, value: m.embeds[0].title, inline: true },
            { name: '\u200B', value: `**Sugestão**`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `\u200B`, value: m.embeds[0].description, inline: true },
            { name: '\u200B', value: '**Resposta**', inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `\u200B`, value: resposta, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }
        )
        .setFooter(`Respondido pelo ${message.author.username}`)
        .setTimestamp();
    return embed;
};
exports.UserSendEmbed = function (valido, messageid) {
    const embed = new Discord.MessageEmbed()
        .setColor(valido.color)
        .setTitle(`Sua sugestão foi ${valido.title.substring(0, valido.title.length - 1) + 'a'}!`)
        .setDescription(`> Link da sua sugestão: 
    > https://discord.com/channels/343532544559546368/778411417291980830/${messageid}`);
    return embed;
};

exports.FormAlreadyOpened = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Já tem alguem vendo os formulários desse servidor !`
        );
    return embed;
};

exports.FormCompleted = function (message) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${message.author}, Não há mais ninguém que tenha feito o form !`
        );
    return embed;
};

exports.FormCreated = function (message, canalCheck) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${message.author}, canal criado com sucesso <#${canalCheck.id}> !`
        );
    return embed;
};

exports.LogReprovado = function (fetchUser) {
    const embed = new Discord.MessageEmbed()
        .setColor('CF1616')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(`***Você foi reprovado no formulário!***`);
    return embed;
};

exports.LogAprovado = function (fetchUser) {
    const embed = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(`***Você passou para a próxima fase do recrutamento, a qual será feita por entrevista***`);
    return embed;
};

exports.LogAprovadoChannel = function (fetchUser, result) {
    const embed = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Novo Candidato`)
        .addFields(
            { name: 'Nome', value: fetchUser.username },
            { name: 'Servidor', value: result[result.length - 1].servidor },
            { name: 'ID', value: fetchUser.id }
        )
        .setFooter('Aprovado ')
        .setTimestamp();
    return embed;
};
exports.logInfos = function (fetchUser, result) {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setTitle(fetchUser.username)
        .addFields(
            { name: 'ID', value: fetchUser.id },
            { name: 'Nome', value: result[0].awnser },
            { name: 'Idade', value: result[1].awnser },
            { name: 'STEAM', value: result[2].awnser },
            { name: 'Ajudará Mensalmente', value: result[7].awnser }
        );
    return embed;
};
