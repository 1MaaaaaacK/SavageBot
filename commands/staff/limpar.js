module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    await message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let quantidade = splitarg[0];

    if (!quantidade)
        return message.channel
            .send(`😫 **|** <@${message.author.id}> Para limpar o chat basta digitar **!limpar quantidade**`)
            .then((m) => m.delete({ timeout: 5000 }));

    if (quantidade > 100 || quantidade < 1)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> A quantidade máxima de mensagens que eu posso deletar são 100 e a mínima é 1!`
            )
            .then((m) => m.delete({ timeout: 4000 }));

    message.channel.messages.fetch({ limit: quantidade }).then((m) => {
        let messagesFound = [];
        m.forEach(function (element) {
            if (!element.author.bot) {
                messagesFound.push(element);
            }
        });
        if (messagesFound == '') {
            return message.channel
                .send('**Eu não achei nenhuma mensagem que eu possa excluir!!**')
                .then((m) => m.delete({ timeout: 4000 }));
        }
        try {
            message.channel.bulkDelete(messagesFound).then((messages) => {
                message.channel
                    .send(`Deletei **${messages.size}** mensagem(s)`)
                    .then((m) => m.delete({ timeout: 2000 }));
            });
        } catch (err) {
            return (
                message.channel
                    .send('Eu não consegui excluir as mensagens, fale com o mack e veja o que deu!')
                    .then((z) => z.delete({ timeout: 7000 })),
                console.log(err)
            );
        }
    });
};

exports.help = {
    name: 'limpar',
};
