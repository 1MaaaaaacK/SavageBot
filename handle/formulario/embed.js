const Discord = require('discord.js');

exports.WrongChannel = function (user) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${user}, use o canal <#839706805104803860> para fazer o formulário !`
        );
    return embed;
};

exports.HasAlreadyChannel = function (user, canalAwait) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${user}, você já possui uma sala, <#${canalAwait.id}> !`
        );
    return embed;
};

exports.HasAlreadyDoneForm = function (user) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${user}, você já fez o formulário, caso não tenha feito, entre em contato com a administração!`
        );
    return embed;
};
exports.FormStart = function (user) {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setTitle('Savage Servidores')
        .setDescription(
            `Olá ${user},
            
            > Ficamos felizes em saber que você quer fazer parte da nossa staff 🥳
            > 
            > Antes de iniciarmos o formulário, sabia que você terá 1 minuto para responder a cada pergunta!
            > 
            > Se você falhar, poderá refazer o formuário!
            > 
            > Para começar, clique no emoji **[<a:right_savage:856211226300121098>]** que está localizado abaixo dessa mensagem
            \n<:blank:773345106525683753>`
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
        .setFooter(
            'Sistema de Formuário Exclusivo da Savage Servidores',
            'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
        );
    return embed;
};

exports.ChannelCreated = function (user, canalAwait) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(
            `<a:right_savage:856211226300121098> ${user}, sua sala já foi criada, <#${canalAwait.id}> !`
        );
    return embed;
};
