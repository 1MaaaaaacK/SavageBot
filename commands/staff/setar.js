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
        tempo = splitarg[3],
        valor = splitarg[4],
        servidor = `${splitarg[5]}`;
    extra = splitarg[6];
    if (!discord1 || !steamid || !tempo || !cargo || !valor || !servidor)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> Para setar alguem basta digitar ***!setar @ do Player - Steamid - Cargo - Tempo em Dias - Valor - Servidor - Observaçoes(opcional)***`
            )
            .then((m) => m.delete({ timeout: 15000 }));

    if (!extra) {
        extra = 'Inexistentes';
    }
    if (steamid == 'STEAM_1:1:79461554' || steamid == 'STEAM_0:1:79461554')
        return message.channel
            .send(`😫 **|** <@${message.author.id}> Voce não pode ter o 1Mack como alvo :)`)
            .then((m) => m.delete({ timeout: 15000 }));
    tempo = parseInt(tempo);
    if ((!isNaN(tempo) && Number.isInteger(tempo)) == false)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> ***Voce digitou o tempo errado, o tempo é em dias, ou seja, 1, 2, 3, 15, 30, 40...***`
            )
            .then((m) => m.delete({ timeout: 15000 }));

    cargo = cargo.toLowerCase();
    if (cargosCertos.find((m) => m == cargo) == undefined)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> ***Voce digitou o cargo errado, os cargos certos são:*** \n\`\`\`vip, mod, modplus, adm, admplus, diretor\`\`\``
            )
            .then((m) => m.delete({ timeout: 15000 }));
    servidor = servidor.toLowerCase();
    let dataInicial = Date.now();
    dataInicial = Math.floor(dataInicial / 1000);
    let dataFinal = dataInicial + tempo * 86400;

    let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString(),
        DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString();

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

    const logVip = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${fetchedUser.user.username}`)
        .addFields(
            { name: 'discord', value: discord1 },
            { name: 'Steamid', value: steamid },
            { name: 'Data da Compra', value: DataInicialUTC },
            { name: 'Data Final', value: DataFinalUTC },
            { name: 'Cargo', value: cargo },
            { name: 'Valor', value: valor },
            { name: 'Observações', value: extra }
        )
        .setFooter(`Setado Pelo ${message.author.username}`);
    const vipSendMSG = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle(`Olá ${fetchUser.username}`)
        .setDescription(
            `***A sua compra foi concluída com sucesso!***\n\nAgradecemos pela confiança e esperamos que você se divirta com seu novo cargo 🥳`
        )
        .addFields(
            { name: '**Cargo**', value: `\`\`\`${cargo.toUpperCase()}\`\`\`` },
            { name: '**Tempo de Duração**', value: `\`\`\`${tempo} Dias\`\`\`` },
            { name: '**Servidor Escolhido**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` }
        );
    const vipSendAllMSG = new Discord.MessageEmbed()
        .setColor('F0FF00')
        .setTitle(cargo == 'vip' ? '***Novo VIP***' : '***Novo Staff***')
        .addFields({ name: 'Jogador', value: fetchUser.username }, { name: 'Cargo', value: cargo.toUpperCase() })
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
    const canal = guild.channels.cache.find((channel) => channel.name === serversInfosFound.canalAlvo);

    let isVip = false;

    if (cargo == 'vip') {
        cargo = 'Vip';
        isVip = true;
    } else if (cargo == 'trial') {
        cargo = 'TrialP';
    } else if (cargo == 'mod') {
        cargo = 'ModP';
    } else if (cargo == 'modplus') {
        cargo = 'ModPlusP';
    } else if (cargo == 'adm') {
        cargo = 'AdmP';
    } else if (cargo == 'admplus') {
        cargo = 'AdmPlusP';
    } else if (cargo == 'diretor') {
        cargo = 'DiretorP';
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
                                message.delete({ timeout: 2000 });
                                if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') {
                                    cont = 0;
                                    for (let i in TotalSteamid) {
                                        dataArray.splice(TotalSteamid[i] - cont, 1);
                                        cont = cont + 1;
                                    }
                                    dataArray.push(
                                        `\r\n"${steamid}"  "@${cargo}"  //${fetchedUser.user.username} (${DataFinalUTC} - DC${usuarioId} - ${dataFinal})`
                                    );
                                    for (let i in dataArray) {
                                        if (dataArray[i] == '\r') {
                                            dataArray.splice(i, 1);
                                        }
                                    }

                                    const updatedData = dataArray.join('\n');
                                    
                                    fs.writeFile(
                                        `./servers/admins_simple_${
                                            serversInfos[serversInfosFound.serverNumber].name
                                        }.txt`,
                                        updatedData,
                                        (err) => {
                                            if (err) throw err;
                                            try {
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
    
                                                        if (err) return err;
                                                    }
                                                );
                                            } catch (error) {
                                                return console.log(error)
                                            }
                                           
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
                                            message.channel
                                                .send(
                                                    `✅ **|** O **${fetchedUser.user.username}** foi setado com o cargo **${cargo}** in-game com sucesso!!!`
                                                )
                                                .then((m) => m.delete({ timeout: 5000 }));
                                            if (isVip == false) {
                                                message.guild.members.cache
                                                    .get(usuarioId)
                                                    .roles.add([serversInfosFound.tagComprado, '722814929056563260']);
                                                message.guild.members.cache
                                                    .get(usuarioId)
                                                    .setNickname('Savage | ' + fetchedUser.user.username);
                                            } else {
                                                message.guild.members.cache
                                                    .get(usuarioId)
                                                    .roles.add([serversInfosFound.tagVip, '753728995849142364']);
                                            }
                                            canal.send(logVip);
                                            fetchUser.send(vipSendMSG);
                                            client.channels.cache.get('826064960824148020').send(vipSendAllMSG);
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
                                        '**Você não respondeu a tempo! Digite !setar novamente, após isso você tem apenas 15s para responder __SIM__ ou __NAO__**'
                                    )
                                    .then((m) => m.delete({ timeout: 10000 }));
                            });
                    });
            } else {
                fs.appendFile(
                    `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
                    `\r\n"${steamid}"  "@${cargo}"  //${fetchedUser.user.username} (${DataFinalUTC} - DC${usuarioId} - ${dataFinal})`,
                    function (err) {
                        if (err) return err;
                        try {
                            fs.readFile(
                                `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
                                'utf8',
                                async function (err, data) {
                                    await fetch(
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
                                }
                                );
                        } catch (error) {
                            return console.log(error)
                        }
                     
    
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
                         
                        message.channel
                            .send(
                                `✅ **|** O **${fetchedUser.user.username}** foi setado com o cargo **${cargo}** in-game com sucesso!!!`
                            )
                            .then((m) => m.delete({ timeout: 5000 }));
                        if (isVip == false) {
                            message.guild.members.cache
                                .get(usuarioId)
                                .roles.add([serversInfosFound.tagComprado, '722814929056563260']);
                            message.guild.members.cache
                                .get(usuarioId)
                                .setNickname('Savage | ' + fetchedUser.user.username);
                        } else {
                            message.guild.members.cache
                                .get(usuarioId)
                                .roles.add([serversInfosFound.tagVip, '753728995849142364']);
                        }
                        canal.send(logVip);
                        fetchUser.send(vipSendMSG);
                        client.channels.cache.get('826064960824148020').send(vipSendAllMSG);
                    }
                );
            }
        }
    );
};

exports.help = {
    name: 'setar',
};
