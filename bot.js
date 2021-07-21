const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require('fs');
const { botConfig } = require('./configs/config_privateInfos');

const { checagem } = require('./handle/checks/check');
const { mapUpdate } = require('./handle/extras/map');

const commandFolders = fs.readdirSync('./commands');
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith('.js') && file.startsWith('p_'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once == 'once') {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

process.on('unhandledRejection', (err) => {
    if (
        err.message !== 'Unknown Channel' &&
        err.message !== 'Unknown Message' &&
        err.message !== 'Cannot send messages to this user'
    ) {
        console.log(err);
    }
});

setInterval(function () {
    checagem();
}, 43200000);
setInterval(function () {
    mapUpdate();
}, 300000);

client.login(botConfig.token);
