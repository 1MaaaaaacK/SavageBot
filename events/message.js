const { ArgsFail, MissinPermissions, AwaitCooldown } = require('../embed/geral');
const { checkChannels } = require('../handle/checkChannels');
const { botConfig } = require('../configs/config_privateInfos');
const Discord = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: 'message',
    once: 'on',
    execute(message, client) {
        checkChannels(message, client);
        const { cooldowns } = client;
        if (!message.content.startsWith(botConfig.prefix) || message.author.bot) return;

        const args = message.content.split(' ').slice(1).join(' ').split(' - ');

        let command = message.content.slice(1).split(' ').shift().toLowerCase();

        if (!client.commands.has(command)) return;
        if (message.channel.type === 'dm') return;

        command = client.commands.get(command);

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel
                    .send(AwaitCooldown(message, timeLeft, command))
                    .then((m) => m.delete({ timeout: 8000 }));
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        if (command.permissions) {
            let bool = false;
            for (let i in command.permissions) {
                message.member.roles.cache.find((m) => {
                    if (m == command.permissions[i]) return (bool = true);
                });
            }

            if (bool == false)
                return message.channel.send(MissinPermissions(message)).then((m) => m.delete({ timeout: 8000 }));
        }
        message.delete();

        if (args.length < command.args && command.args !== 0) {
            return message.channel
                .send(ArgsFail(message, botConfig.prefix, command.name, command.usage))
                .then((m) => m.delete({ timeout: 8000 }));
        }
        try {
            command.execute(client, message, args);
        } catch (error) {
            console.error(chalk.redBright('Erro de Comando'), error);
        }
    },
};
