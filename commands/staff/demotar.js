const Discord = require('discord.js');
const fs = require('fs');
const { panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const fetch = require('node-fetch');

const { DEMOTARtutorial, DEMOTARserverError, DEMOTARgerenteError } = require('../../embed/error');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let steamid = splitarg[0],
        servidor = `${splitarg[1]}`,
        extra = splitarg[2];

    if (!steamid || !servidor || !extra)
        return message.channel.send(DEMOTARtutorial(message)).then((m) => m.delete({ timeout: 10000 }));
    if (steamid == 'STEAM_1:1:79461554' || steamid == 'STEAM_0:1:79461554')
        return message.channel
            .send(`😫 **|** <@${message.author.id}> Voce não pode ter o 1Mack como alvo :)`)
            .then((m) => m.delete({ timeout: 15000 }));

    servidor = servidor.toLowerCase();

    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    if (serversInfosFound == undefined)
        return message.channel.send(DEMOTARserverError(message)).then((m) => m.delete({ timeout: 7000 }));

    if (!message.member.roles.cache.has(serversInfos.find((m) => m.name == servidor).gerenteRole))
        return message.channel.send(DEMOTARgerenteError(message)).then((m) => m.delete({ timeout: 7000 }));

    let guild = client.guilds.cache.get('792575394271592458');
    const canal = guild.channels.cache.find((channel) => channel.id === '792576104681570324');

    fs.readFile(
        `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
        { encoding: 'utf-8' },
        function (err, data) {
            if (err) return console.log(err);
            let dataArray = data.split('\n');
            let playerLength = [-1];
            let cont = 0;

            for (let i in dataArray) {
                if (dataArray[i] == '\r') {
                    dataArray.slice(i, 1);
                }
                if (dataArray[i].substring(1, steamid.length + 1) === steamid) {
                    playerLength[0 + cont] = i;
                    cont = cont + 1;
                }
            }
            if (playerLength == -1)
                return message.channel
                    .send(`**<@${message.author.id}> | Não achei ninguém com essa SteamID!**`)
                    .then((m) => m.delete({ timeout: 7000 }));

            message.channel
                .send(
                    `**<@${message.author.id}> | Tem certeza que quer fazer isso? Eu achei ${playerLength.length} player(s) com essa steamID.** \n**Digite \`SIM\` ou \`NAO\`**`
                )
                .then((m) => {
                    m.delete({ timeout: 10000 });
                    let filter = (m) => m.author.id === message.author.id;
                    m.channel
                        .awaitMessages(filter, {
                            max: 1,
                            time: 10000,
                            errors: ['time'],
                        })
                        .then(async (message) => {
                            message = message.first();
                            message.delete({ timeout: 2000 });
                            if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') {
                                let playerId = [-1];
                                cont = 0;
                                let userEmbed = 'Desconhecido';
                                let playerIdEmbed;

                                for (let i in playerLength) {
                                    try {
                                        playerId[0 + cont] = dataArray[playerLength[i]].substr(
                                            dataArray[playerLength[i]].match('DC').index + 2,
                                            18
                                        );
                                        cont = cont + 1;
                                    } catch (err) {}

                                    dataArray.splice(playerLength[i], 1);
                                }
                                if (playerId == -1) {
                                    message.channel
                                        .send(
                                            `**<@${message.author.id}> | Não achei o discord desse player no __admins_simple__, você terá que remover o cargo do discord dele manualmente!**`
                                        )
                                        .then((m) => m.delete({ timeout: 12000 }));
                                    playerIdEmbed = 'Desconhecido';
                                } else {
                                    await message.channel
                                        .send(`<@${playerId[0]}>`)
                                        .then((m) => m.delete({ timeout: 1000 }));

                                    playerIdEmbed = `<@${playerId[0]}>`;

                                    try {
                                        var fetchUser = await client.users.fetch(playerId[0]);
                                        var fetchedUser = await client.guilds.cache
                                            .get('343532544559546368')
                                            .members.fetch(fetchUser);
                                        userEmbed = fetchedUser.user.username;
                                    } catch (error) {
                                        message.channel
                                            .send(
                                                `**<@${message.author.id}> | Não achei o discord desse player, você terá que remover o cargo do discord dele manualmente!**`
                                            )
                                            .then((m) => m.delete({ timeout: 12000 }));
                                        console.log(error);
                                    }
                                }
                                dataArray = dataArray.join('\n');

                                fs.writeFile(
                                    `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
                                    dataArray,
                                    (err) => {
                                        if (err)
                                            return (
                                                message.channel
                                                    .send(
                                                        `**<@${message.author.id}> | Houve um erro interno, contate o 1MaaaaaacK**`
                                                    )
                                                    .then((m) =>
                                                        m.delete({
                                                            timeout: 10000,
                                                        })
                                                    ),
                                                console.log(err)
                                            );
                                    }
                                );
                                fs.readFile(
                                    `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
                                    'utf8',
                                    function (err, data2) {
                                        if (err)
                                            return (
                                                message.channel
                                                    .send(
                                                        `**<@${message.author.id}> | Houve um erro interno, contate o 1MaaaaaacK**`
                                                    )
                                                    .then((m) =>
                                                        m.delete({
                                                            timeout: 10000,
                                                        })
                                                    ),
                                                console.log(err)
                                            );

                                        fetch(
                                            `https://panel.mjsv.us/api/client/servers/${
                                                serversInfos[serversInfosFound.serverNumber].identifier
                                            }/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'text/plain',
                                                    Accept: 'application/json',
                                                    Authorization: `Bearer ${panelApiKey.api}`,
                                                },
                                                body: data2,
                                            }
                                        );
                                        try {
                                            fetch(
                                                `https://panel.mjsv.us/api/client/servers/${
                                                    serversInfos[serversInfosFound.serverNumber].identifier
                                                }/command`,
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${panelApiKey.api}`,
                                                    },
                                                    body: JSON.stringify({ command: 'sm_reloadadmins' }),
                                                }
                                            );
                                        } catch {}
                                    }
                                );

                                const logDemoted = new Discord.MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle(userEmbed)
                                    .addFields(
                                        {
                                            name: 'discord',
                                            value: playerIdEmbed,
                                        },
                                        { name: 'Steamid', value: steamid },
                                        { name: 'Observações', value: extra }
                                    )
                                    .setFooter(`Demotado Pelo ${message.author.username}`);
                                const demotedSendMSG = new Discord.MessageEmbed()
                                    .setColor('FF0000')
                                    .setTitle(`Olá ${fetchUser.username}`)
                                    .setDescription(
                                        `***Você foi demotado!!***\n\nAgradecemos o tempo que passou conosco, porém tudo uma hora chega ao Fim...`
                                    )
                                    .addFields(
                                        { name: '**STEAMID**', value: `\`\`\`${steamid}\`\`\`` },
                                        { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
                                        { name: '**Motivo**', value: `\`\`\`${extra}\`\`\`` }
                                    );
                                if (fetchedUser != undefined) {
                                    if (fetchedUser.nickname != null) {
                                        cont = 0;

                                        for (let x = 0; x < serversInfos.length; x++) {
                                            for (let i in fetchedUser._roles) {
                                                if (fetchedUser._roles[i] == serversInfos[x].tagDoCargo) {
                                                    cont = cont + 1;
                                                } else if (fetchedUser._roles[i] == serversInfos[x].tagComprado) {
                                                    cont = cont + 1;
                                                }
                                            }
                                        }
                                        if (cont > 1) {
                                            fetchedUser.roles.remove(serversInfosFound.tagDoCargo);
                                            fetchedUser.roles.remove(serversInfosFound.tagComprado);
                                        } else {
                                            fetchedUser.roles.remove([
                                                serversInfos.find((m) => m.name == servidor).tagDoCargo,
                                                '722814929056563260',
                                                serversInfos.find((m) => m.name == servidor).tagComprado,
                                            ]);
                                            fetchedUser.setNickname(fetchedUser.nickname.substr(9)).catch((error) => {
                                                message.channel
                                                    .send(
                                                        `**<@${message.author.id}> | Não consegui renomear o player, tente fazer isso manualmente!**`
                                                    )
                                                    .then((m) =>
                                                        m.delete({
                                                            timeout: 12000,
                                                        })
                                                    );
                                                console.log(error);
                                            });
                                        }
                                    }
                                }
                                await canal.send(logDemoted);
                                fetchUser.send(demotedSendMSG);

                                message.channel
                                    .send(`**<@${message.author.id}> | Staff demotado com sucesso!!**`)
                                    .then((m) => m.delete({ timeout: 5000 }));
                            } else if (message.content.toUpperCase() == 'NAO' || message.content.toUpperCase() == 'N') {
                                return message.channel
                                    .send(`Comando abortado!`)
                                    .then((m) => m.delete({ timeout: 5000 }));
                            } else {
                                return message.channel
                                    .send(`Resposta invalida, digite o comando novamente, **!demotar**`)
                                    .then((m) => m.delete({ timeout: 5000 }));
                            }
                        })
                        .catch(() => {
                            return message.channel
                                .send(
                                    '**Você não respondeu a tempo! Digite !demotar novamente, após isso você tem apenas 10s para responder __SIM__ ou __NAO__**'
                                )
                                .then((m) => m.delete({ timeout: 10000 }));
                        });
                });
        }
    );
};

exports.help = {
    name: 'setar',
};
