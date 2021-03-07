const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (message.channel.id != '710291543608655892')
        return (
            message.delete({ timeout: 1000 }),
            message.channel
                .send(`**<@${message.author.id}> |** Esse comando so poder ser usado no canal <#710291543608655892>`)
                .then((m) => m.delete({ timeout: 8000 }))
        );
    let splitarg = args.join(' ').split(' - ');
    let steamid64 = `${splitarg[0]}`;

    if (
        steamid64.includes('https://steamcommunity.com/id/') == false &&
        steamid64.includes('https://steamcommunity.com/profiles/') == false
    )
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> Para ver as inforamações do seu perfil, basta digitar **!perfil LinkDoPerfil**\n\n**Exemplo:**\` !perfil https://steamcommunity.com/id/1MaaaaaacK/\``
            )
            .then((m) => m.delete({ timeout: 10000 }));

    if (steamid64.slice(-1) == '/') {
        steamid64 = steamid64.slice(0, -1);
    }
    steamid64 = steamid64.slice(30);
    fetch(`https://steamidapi.uk/request.php?api=8Y5B7NZNN8ZO8BYH2Q4N&player=${steamid64}&request_type=5&format=json`)
        .then((res) => res.json())
        .then((json) => {
            try {
                steamid64 = json.linked_users.steamid64;
            } catch (error) {}
            fetch(
                `https://steamidapi.uk/request.php?api=8Y5B7NZNN8ZO8BYH2Q4N&player=${steamid64}&request_type=1&format=json`
            )
                .then((res) => res.json())
                .then((json) => {
                    const profileGet = {
                        steamid: json.profile.steamid,
                        foto: json.profile.avatar,
                        nome: json.profile.playername,
                    };

                    fetch(
                        `https://steamidapi.uk/request.php?api=8Y5B7NZNN8ZO8BYH2Q4N&player=${steamid64}&request_type=2&format=json`
                    )
                        .then((res) => res.json())
                        .then((json) => {
                            const embed = new Discord.MessageEmbed()
                                .setColor('36393f')
                                .setThumbnail(profileGet.foto)
                                .setTitle(profileGet.nome)
                                .addFields(
                                    { name: 'Steamid', value: profileGet.steamid, inline: true },
                                    { name: '\u200B', value: '\u200B', inline: true },
                                    { name: 'Vac', value: json.profile_bans.vac, inline: true },
                                    { name: '\u200B', value: '\u200B' },
                                    { name: 'TradeBan', value: json.profile_bans.tradeban, inline: true },
                                    { name: '\u200B', value: '\u200B', inline: true },
                                    { name: 'CommunityBan', value: json.profile_bans.communityban, inline: true },
                                    { name: '\u200B', value: '\u200B' },
                                    {
                                        name: 'Total de Jogos',
                                        value:
                                            json.steamid_data.game_count == 'unavailable'
                                                ? 'Privado'
                                                : json.steamid_data.game_count,
                                        inline: true,
                                    },
                                    { name: '\u200B', value: '\u200B', inline: true },
                                    {
                                        name: 'Amigos com Vac',
                                        value: json.steamid_data.vac_banned_friends,
                                        inline: true,
                                    },
                                    { name: '\u200B', value: '\u200B' },
                                    { name: 'Total de Amigos', value: json.steamid_data.friend_count, inline: true },
                                    { name: '\u200B', value: '\u200B', inline: true },
                                    {
                                        name: 'Total de Amigos já Adicionados',
                                        value: json.steamid_data.friend_history_count,
                                        inline: true,
                                    }
                                );
                            message.channel.send(embed);
                        });
                })
                .catch(() => {
                    return message.channel
                        .send(
                            '**Não consegui achar seu perfil, provavelmente você escreveu algo errado!\nA forma certa usar é essa: \n\n**Exemplo:**` !perfil https://steamcommunity.com/id/1MaaaaaacK/`**',
                            client.channels.cache.get().send(`**${message.author.id}** usou o comando **!perfil** __errado__`)
                        )
                        .then((m) => m.delete({ timeout: 10000 }));
                });
                client.channels.cache.get().send(`**${message.author.id}** usou o comando **!perfil** __corretamente__`)
        });
};
exports.help = {
    name: 'perfil',
};
