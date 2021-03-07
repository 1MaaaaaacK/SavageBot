module.exports.run = async (client, message, args) => {
    if (message.author.id !== '323281577956081665') return;

    await message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let quantidade = splitarg[0];

    let valores = 0;

    message.channel.messages.fetch({ limit: quantidade }).then((m) => {
        m.forEach((element) => {
            if (element.embeds == '') return;

            let elemento = element.embeds[0].fields[5].value;

            if (elemento == 0 || isNaN(elemento) == true) return;

            if (elemento.includes(',')) {
                elemento = elemento.replace(',', '.');
            }

            valores += parseFloat(elemento);
        });

        message.channel.send(valores).then(m => m.delete({timeout: 2000}))
    });
};
exports.help = {
    name: 'valor',
};
