const Discord = require('discord.js');
const { WrongUsage } = require('./embed');

module.exports = {
    name: 'embed',
    description: 'Enviar Embeds',
    usage: `cor - titulo - descrição - imagem - rodapé - timestamp
        
    OBS: Somente a cor, o titulo e a descrição são obrigatórios!
    
    EXEMPLO COMPLETO
    
    \`\`\`!embed 115490 - Teste - Aqui voce pode falar o que bem entender! - https://cdn.discordapp.com/attachments/751428595536363610/832988382819778570/savage.png - Aqui eh o que vai no rodape - sim\`\`\`
    EXEMPLO Facil
    \`\`\`!embed 115490 - Seu Titulo - Esse eh um exemplo mais facil de entender\`\`\``,
    cooldown: 0,
    permissions: ['831219575588388915'], //Perm ban
    args: 3,
    async execute(client, message, args) {
        let color = String(args[0]),
            title = String(args[1]),
            description = String(args[2]),
            image = String(args[3]),
            reactions = String(args[4]).split(' ');
        (footer = String(args[5])), (timestamp = String(args[6]));

        if (title == 'null' && description == 'null' && image == 'null') {
            return message.channel.send(WrongUsage(message)).then((m) => m.delete({ timeout: 15000 }).catch(() => {}));
        }
        const embed = new Discord.MessageEmbed().setColor(`#${color}`);

        if (title !== 'null') {
            embed.setTitle(title);
        }
        if (description !== 'null') {
            embed.setDescription(description);
        }
        if (image.includes('http') || image.includes('https')) {
            embed.setImage(image);
        }
        if (footer !== 'undefined') {
            embed.setFooter(footer);
        }
        if (timestamp.toLowerCase() === 'sim') {
            embed.setTimestamp();
        }

        try {
            if (reactions !== 'undefined' && reactions !== null) {
                message.channel.send(embed).then(async (m) => {
                    for (let i in reactions) {
                        await m.react(reactions[i]);
                    }
                });
            } else {
                message.channel.send(embed);
            }
        } catch (error) {
            return message.channel.send(
                `${message.author} **| Voce escreveu algo errado, o modo certo é: !embed cor - titulo - descrição - imagem - rodapé - timestamp`
            );
        }
    },
};
