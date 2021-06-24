const Discord = require('discord.js');
module.exports = {
    name: 'comandos',
    description: 'Listar todos os meus comandos',
    usage: '',
    cooldown: 0,
    permissions: false,
    args: 0,
    async execute(client, message, args) {
        const data = [];
        const { commands } = message.client;

        let embed = new Discord.MessageEmbed().setColor('#00ff00');

        if (args[0] == '') {
            embed = embed.setDescription(
                `✅ ${message.author}, aqui está a minha lista com todos os comandos:\n\`\`\`${commands
                    .map((command) => command.name)
                    .join(', ')}\`\`\``
            );

            embed.setFooter(`Para ver as informações de um comando\n!comandos NomeDoComando`);
        } else {
            const command = commands.get(args[0]);

            if (!command) {
                embed = embed.setColor('#ff0000');
                embed = embed.setDescription(
                    `:warning: ${message.author}, o comando ***${args[0].toUpperCase()}*** não existe !`
                );
                return message.channel.send(embed);
            }
            embed.addFields(
                { name: '\u200B', value: '**Comando**', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '\u200B', value: command.name, inline: true },
                { name: '\u200B', value: '**Descrição**', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '\u200B', value: command.description, inline: true },
                { name: '\u200B', value: '**Modo de usar**', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '\u200B', value: command.usage, inline: true },
                { name: '\u200B', value: '**CoolDown**', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '\u200B', value: `${command.cooldown} segundos`, inline: true },
                { name: '\u200B', value: '**Permissões Necessárias**', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '\u200B', value: command.permissions.map(m => `<@&${m}>`), inline: true }
            );
        }
        return message.channel.send(embed);
    },
};
