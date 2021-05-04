const Discord = require('discord.js');
const { ADVtutorial } = require('../../embed/error');
const { ADVaviso } = require('../../embed/aviso');
const { ADVsucesso } = require('../../embed/sucesso');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let discord = splitarg[0],
        reason = splitarg[1];

    if (!discord || !reason)
        return message.channel.send(ADVtutorial(message)).then((m) => m.delete({ timeout: 10000 }));
    const usuarioId = discord.slice(0, -1).substring(3),
        userCatch = client.guilds.cache.get('343532544559546368').members.cache.get(usuarioId);
    let adv;

    if (
        !userCatch._roles.find((roles) => roles == '607704706088828955') &&
        !userCatch._roles.find((roles) => roles == '607704708051894272')
    ) {
        userCatch.roles.add('607704706088828955');
        adv = '1';
    } else if (
        userCatch._roles.find((roles) => roles == '607704706088828955') &&
        userCatch._roles.find((roles) => roles == '607704708051894272')
    ) {
        return client.channels.cache
            .get('751428595536363610')
            .send(message.channel.send(ADVaviso(message, usuarioId)))
    } else {
        userCatch.roles.add('607704708051894272');
        adv = '2';
    }

    message.channel
        .send(ADVsucesso(message))
        .then((m) => m.delete({ timeout: 5000 }));

    const logAdv = new Discord.MessageEmbed()
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

    client.channels.cache.get('779013964138414090').send(logAdv);
};

exports.help = {
    name: 'adv',
};
