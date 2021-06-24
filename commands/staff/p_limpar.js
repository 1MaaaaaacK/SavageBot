const { WrongNumber, MissingPermission, OldMessage } = require('./embed');
module.exports = {
    name: 'limpar',
    description: 'Limpar chat excluindo mensagens',
    usage: 'quantidade - apagar msg de bot?(Responda sim caso queira pagar! Se não quiser, basta deixar em branco)',
    cooldown: 0,
    permissions: ['711022747081506826'], //gerente
    args: 1,
    async execute(client, message, args) {
        let quantidade = Number(args[0]),
            includeBot = String(args[1]).toLowerCase();

        if (quantidade > 99 || quantidade < 1)
            return message.channel.send(WrongNumber(message)).then((m) => m.delete({ timeout: 6000 }).catch(() => {}));
        if (includeBot == 'sim' || includeBot == 's') {
            if (message.member.roles.cache.has('603318536798077030')) {
                includeBot = true;
            } else {
                includeBot = false;
                await message.channel.send(MissingPermission(message));
            }
        } else {
            includeBot = false;
        }
        let date = Date.now();
        quantidade += 1;
        message.channel.messages.fetch({ limit: quantidade }).then((m) => {
            let messagesFound = [],
                messagesMoreThan14 = [];

            m.forEach(function (element) {
                if (Math.round(Math.abs(date - element.createdTimestamp)) / (1000 * 60 * 60 * 24) < 14) {
                    if (includeBot == false) {
                        if (!element.author.bot) {
                            messagesFound.push(element);
                        }
                    } else {
                        messagesFound.push(element);
                    }
                } else {
                    messagesMoreThan14.push(element);
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
                        .send(
                            `Deletei ${
                                messages.size > 2
                                    ? `**${messages.size - 1}** mensagens`
                                    : `**${messages.size - 1}** mensagem`
                            }${
                                messagesMoreThan14.length > 0
                                    ? ` e **Não consegui deletar ${messagesMoreThan14.length}** mensagens, pois tem mais de 14 dias que elas foram mandadas`
                                    : ''
                            }`
                        )
                        .then((m) => m.delete({ timeout: 10000 }));
                });
            } catch (err) {
                return message.channel.send(OldMessage(message)).then((z) => z.delete({ timeout: 7000 }));
            }
        });
    },
};
