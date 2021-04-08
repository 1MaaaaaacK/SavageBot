const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const { panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const { cargosCertos } = require('../../configs/config_geral');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let discord1 = splitarg[0],
        steamid = splitarg[1],
        cargo = `${splitarg[2]}`,
        servidor = `${splitarg[3]}`,
        extra = splitarg[4];

    if (!discord1 || !steamid || !cargo || !servidor)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> Para setar alguem basta digitar ***!setarstaff @ do Player - Steamid - Cargo - Servidor - Observaçoes(opcional)***`
            )
            .then((m) => m.delete({ timeout: 15000 }));

    if (!extra) {
        extra = false;
    }
    if (steamid == 'STEAM_1:1:79461554' || steamid == 'STEAM_0:1:79461554')
        return message.channel
            .send(`😫 **|** <@${message.author.id}> Voce não pode ter o 1Mack como alvo :)`)
            .then((m) => m.delete({ timeout: 15000 }));
    cargo = cargo.toLowerCase();
    if (cargosCertos.find((m) => m == cargo) == undefined)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> ***Voce digitou o cargo errado, os cargos certos são:*** \n\`\`\`vip, mod, modplus, adm, admplus, diretor\`\`\``
            )
            .then((m) => m.delete({ timeout: 15000 }));
    servidor = servidor.toLowerCase();

    if (cargo == 'dono' && message.author.id != '323281577956081665')
        return message.channel
            .send(`😫 **|** <@${message.author.id}> Somente o 1MaaaaaacK pode setar alguem de dono!!***`)
            .then((m) => m.delete({ timeout: 5000 }));

    const usuarioId = discord1.slice(0, -1).substring(3);

    try {
        var fetchUser = await client.users.fetch(usuarioId);
        var fetchedUser = await client.guilds.cache.get('343532544559546368').members.fetch(fetchUser);
    } catch (error) {
        return (
            message.channel
                .send(
                    `**<@${message.author.id}> | Não achei o discord desse player, confira se ele realmente está no discord!!**`
                )
                .then((m) => m.delete({ timeout: 12000 })),
            console.log(error)
        );
    }

    let logStaff = null;

    if (extra == false) {
        logStaff = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${fetchedUser.user.username}`)
            .addFields(
                { name: 'discord', value: discord1 },
                { name: 'Steamid', value: steamid },
                { name: 'Cargo', value: cargo },
                { name: 'Servidor', value: servidor }
            )
            .setTimestamp()
            .setFooter(`Setado Pelo ${message.author.username}`);
    } else {
        logStaff = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${fetchedUser.user.username}`)
            .addFields(
                { name: 'discord', value: discord1 },
                { name: 'Steamid', value: steamid },
                { name: 'Cargo', value: cargo },
                { name: 'Servidor', value: servidor },
                { name: 'Observações', value: extra }
            )
            .setTimestamp()
            .setFooter(`Setado Pelo ${message.author.username}`);
    }

    const staffSendAllMSG = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle('***Novo Staff***')
        .addFields(
            { name: 'Jogador', value: fetchUser.username },
            { name: 'Cargo', value: cargo.toUpperCase() },
            { name: 'Servidor', value: servidor.toUpperCase() }
        )
        .setThumbnail(fetchUser.avatarURL())
        .setTimestamp();
    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    if (serversInfosFound == undefined)
        return message.channel
            .send(
                `😫 **| <@${usuarioId}> Você errou o servidor!!!\nOs servidores sao: \njb, dr, mix, awp, retake, retakepistol, ttt, scout, mg**`
            )
            .then((m) => m.delete({ timeout: 7000 }));

    if (!message.member.roles.cache.has(serversInfosFound.gerenteRole))
        return message.channel
            .send(
                `😫 **| <@${message.author.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`
            )
            .then((m) => m.delete({ timeout: 7000 }));

    let guild = client.guilds.cache.get('792575394271592458');

    const canal = guild.channels.cache.find((channel) => channel.id === '792576052144373760');

    if (cargo == 'trial') {
        cargo = 'Trial';
    } else if (cargo == 'mod') {
        cargo = 'Mod';
    } else if (cargo == 'modplus') {
        cargo = 'ModPlus';
    } else if (cargo == 'adm') {
        cargo = 'Adm';
    } else if (cargo == 'admplus') {
        cargo = 'AdmPlus';
    } else if (cargo == 'diretor') {
        cargo = 'Diretor';
    } else if (cargo == 'dono') {
        cargo = 'Dono';
    }

    fs.readFile(
        `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
        'utf8',
        function (err, data) {
            if (err) throw err;
            let TotalSteamid = [],
                dataArray = data.split('\n'),
                cont = 0;
            for (let i in dataArray) {
                if (dataArray[i] == '\r' || dataArray[i] == '') {
                    dataArray.splice(i, 1);
                }
                if (dataArray[i] !== undefined) {
                    if (dataArray[i].match(steamid)) {
                        TotalSteamid[0 + cont] = i;
                        cont = cont + 1;
                    }
                }
            }
            if (TotalSteamid.length >= 1) {
                message.channel
                    .send(
                        `**<@${message.author.id}> | O player que voce esta tentando setar já possui um cargo.
       ** \n**Digite \`SIM\` - Para eu excluir o cargo anterior e setar o novo **
       \n**ou**\n\n**Digite \`NAO\` - Para que eu deixe o cargo antigo e não ponha o novo**`
                    )
                    .then((m) => {
                        m.delete({ timeout: 15000 });
                        let filter = (m) => m.author.id === message.author.id;
                        m.channel
                            .awaitMessages(filter, {
                                max: 1,
                                time: 15000,
                                errors: ['time'],
                            })
                            .then((message) => {
                                message = message.first();
                                message.delete({ timeout: 1000 });
                                if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') {
                                    cont = 0;
                                    for (let i in TotalSteamid) {
                                        dataArray.splice(TotalSteamid[i] - cont, 1);
                                        cont = cont + 1;
                                    }
                                    dataArray.push(
                                        `\r\n"${steamid}"  "@${cargo}"  //${fetchedUser.user.username} (DC${usuarioId})`
                                    );
                                    const updatedData = dataArray.join('\n');

                                    fs.writeFile(
                                        `./servers/admins_simple_${
                                            serversInfos[serversInfosFound.serverNumber].name
                                        }.txt`,
                                        updatedData,
                                        (err) => {
                                            if (err) throw err;

                                            fs.readFile(
                                                `./servers/admins_simple_${
                                                    serversInfos[serversInfosFound.serverNumber].name
                                                }.txt`,
                                                'utf8',
                                                function (err, data) {
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
                                                            body: data,
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

                                                    if (err) return err;
                                                }
                                            );
                                            message.channel
                                                .send(
                                                    `✅ **|** O **${fetchedUser.user.username}** foi setado com o cargo **${cargo}** in-game com sucesso!!!`
                                                )
                                                .then((m) => m.delete({ timeout: 5000 }));

                                            message.guild.members.cache
                                                .get(usuarioId)
                                                .roles.add([serversInfosFound.tagDoCargo, '722814929056563260']);
                                            message.guild.members.cache
                                                .get(usuarioId)
                                                .setNickname('Savage | ' + fetchedUser.user.username);

                                            canal.send(logStaff);
                                            client.channels.cache.get('710288627103563837').send(staffSendAllMSG);
                                        }
                                    );
                                } else if (
                                    message.content.toUpperCase() == 'NAO' ||
                                    message.content.toUpperCase() == 'N'
                                ) {
                                    return message.channel
                                        .send(`Comando abortado!`)
                                        .then((m) => m.delete({ timeout: 5000 }));
                                } else {
                                    return message.channel
                                        .send(`Resposta invalida, digite o comando novamente, **!setar**`)
                                        .then((m) => m.delete({ timeout: 5000 }));
                                }
                            })
                            .catch(() => {
                                return message.channel
                                    .send(
                                        '**Você não respondeu a tempo! Digite !setarstaff novamente, após isso você tem apenas 15s para responder __SIM__ ou __NAO__**'
                                    )
                                    .then((m) => m.delete({ timeout: 10000 }));
                            });
                    });
            } else {
                fs.appendFile(
                    `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
                    `\r\n"${steamid}"  "@${cargo}"  //${fetchedUser.user.username} (DC${usuarioId})`,
                    function (err) {
                        if (err) return err;

                        fs.readFile(
                            `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
                            'utf8',
                            function (err, data) {
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
                                        body: data,
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

                                if (err) return err;
                            }
                        );

                        message.channel
                            .send(
                                `✅ **|** O **${fetchedUser.user.username}** foi setado com o cargo **${cargo}** in-game com sucesso!!!`
                            )
                            .then((m) => m.delete({ timeout: 5000 }));

                        message.guild.members.cache
                            .get(usuarioId)
                            .roles.add([serversInfosFound.tagDoCargo, '722814929056563260']);
                        message.guild.members.cache.get(usuarioId).setNickname('Savage | ' + fetchedUser.user.username);
                        canal.send(logStaff);
                        client.channels.cache.get('710288627103563837').send(staffSendAllMSG);
                    }
                );
            }
        }
    );
};

exports.help = {
    name: 'setarstaff',
};
