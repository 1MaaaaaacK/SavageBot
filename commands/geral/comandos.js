const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    message.delete();
    const embedMain = new Discord.MessageEmbed().setColor('#36393f').setTitle(`**Comandos**`).addFields(
        {
            name: 'Gerais',
            value: 'Reaja com 📕',
        },
        {
            name: 'Administração',
            value: 'Reaja com 👮',
        }
    );

    const embedGeral = new Discord.MessageEmbed().setColor('#36393f').setTitle(`**Comandos Gerais**`).addFields({
        name: '!sugestao',
        value: '!sugestao Sua sugestão',
    });

    let msg = await message.channel.send(embedMain);
    await msg.react('👍');
    await msg.react('👎');
    await msg
        .awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '👍', {
            max: 1,
            time: 10000,
        })
        .then((collected) => {
            const reaction = collected.first();
            console.log(reaction.users /* .find(message.author.id) */);
            if (reaction.emoji.name == '👍') {
                msg.edit(embedGeral);
                setTimeout(() => {
                    msg.delete();
                }, 2000);
                //console.log(reaction)
            }
        })
        .catch((collected) => {
            msg.delete();
            message.channel
                .send(`**<@${message.author.id}> | Você deve reagir na mensagem para poder ver os comandos!!**`)
                .then((m) =>
                    m.delete({
                        timeout: 8000,
                    })
                );
        });
};

exports.help = {
    name: 'comandos',
};
