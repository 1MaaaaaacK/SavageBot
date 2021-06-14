const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const { panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const { cargosCertos } = require('../../configs/config_geral');
const { connection } = require('../../configs/config_privateInfos');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826') && !message.member.roles.cache.has('831219575588388915'))
        return;
    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let discord1 = String(splitarg[0]),
        steamid = String(splitarg[1]),
        cargo = String(splitarg[2]).toLowerCase(),
        tempo = splitarg[3],
        valor = splitarg[4],
        servidor = String(splitarg[5]).toLowerCase(),
        extra = String(splitarg[6]);
    if (!discord1 || !steamid || !tempo || !cargo || !valor || !servidor)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> Para setar alguem basta digitar ***!setar @ do Player - Steamid - Cargo - Tempo em Dias - Valor - Servidor - Observações(opcional)***`
            )
            .then((m) => m.delete({ timeout: 15000 }));

    if (!extra) {
        extra = 'Inexistentes';
    }

    if (steamid !== undefined && steamid.startsWith('STEAM_0')) {
        steamid = steamid.replace('0', '1');
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

    if (cargosCertos.find((m) => m == cargo) == undefined)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> ***Voce digitou o cargo errado, os cargos certos são:*** \n\`\`\`vip, mod, modplus, adm, admplus, diretor\`\`\``
            )
            .then((m) => m.delete({ timeout: 15000 }));

    let dataInicial = Date.now();
    dataInicial = Math.floor(dataInicial / 1000);
    let dataFinal = 0,
        DataFinalUTC = 0;

    if (tempo !== 0) {
        dataFinal = dataInicial + tempo * 86400;
        DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString('en-GB');
    }
    let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');

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
            { name: 'Data Final', value: DataFinalUTC == 0 ? '**PERMANENTE**' : DataFinalUTC },
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
            { name: '**Tempo de Duração**', value: `\`\`\`${tempo == 0 ? 'Permanente' : `${tempo} Dias`}\`\`\`` },
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
                `😫 **| <@${usuarioId}> Você errou o servidor!!!\nOs servidores sao:**\n\`\`\`${serversInfos.map(
                    function (server) {
                        return ` ${server.name}`;
                    }
                )}\`\`\``
            )
            .then((m) => m.delete({ timeout: 10000 }));

    if (
        !message.member.roles.cache.has(serversInfosFound.gerenteRole) &&
        !message.member.roles.cache.has('831219575588388915')
    )
        return message.channel
            .send(
                `😫 **| <@${message.author.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`
            )
            .then((m) => m.delete({ timeout: 7000 }));

    let guild = client.guilds.cache.get('792575394271592458');

    const canal = guild.channels.cache.find(
        (channel) => channel.name === serversInfosFound.canalAlvo && channel.parentID == '792575394271592459'
    );

    let isVip = false;

    if (cargo == 'vip') {
        isVip = true;
    } else {
        cargo = cargo.concat('p');
    }

    let rows;
    const con = connection.promise();

    try {
        [rows] = await con.query(
            `select steamid, server_id from vip_sets where steamid = "${steamid}" AND server_id = (select id from vip_servers where server_name = "${servidor}")`
        );
    } catch (error) {
        return (
            message.channel
                .send(`${message.author} **| Houve um erro ao setar o player, contate o 1Mack para ver o ocorrido!**`)
                .then((m) => m.delete({ timeout: 10000 })),
            console.log(error)
        );
    }

    let opa;

    if (rows != '') {
        await message.channel
            .send(
                `${message.author} **| O player que voce esta tentando setar já possui um cargo.**
\n**Digite \`SIM\` - Para eu excluir o cargo anterior e setar o novo**
\n**ou**\n\n**Digite \`NAO\` - Para que eu deixe o cargo antigo e não ponha o novo**`
            )
            .then(async (m) => {
                m.delete({ timeout: 15000 });
                let filter = (m) => m.author.id === message.author.id;
                await m.channel
                    .awaitMessages(filter, {
                        max: 1,
                        time: 15000,
                        errors: ['time'],
                    })
                    .then((message) => {
                        message = message.first();
                        message.delete({ timeout: 1000 });
                        if (message.content.toUpperCase() == 'NAO' || message.content.toUpperCase() == 'N') {
                            return (opa = message.channel
                                .send('**Abortando1 Comando** <a:savage_loading:837104765338910730>')
                                .then((m) => m.delete({ timeout: 5000 })));
                        } else if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') {
                            return (opa = 's');
                        }
                    })
                    .catch((err) => {
                        return (opa = message.channel
                            .send('**Abortando2 Comando** <a:savage_loading:837104765338910730>')
                            .then((m) => m.delete({ timeout: 5000 })));
                    });
            });
    }

    try {
        if (opa === 's') {
            await con.query(
                `update vip_sets set name = '${fetchUser.username}',
            steamid = '${steamid}',
            discord_id = '${usuarioId}', 
            cargo = '${cargo}', 
            date_create = '${DataInicialUTC}', 
            date_final = '${DataFinalUTC}', 
            isVip = '1', 
            valor = '${valor}'
            WHERE (steamid='${steamid}' OR discord_id='${usuarioId}') AND vip_sets.server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
            );
        } else if (opa === undefined) {
            await con.query(
                `insert into vip_sets(name, steamid, discord_id, cargo, date_create, date_final, isVip, valor, server_id) 
                SELECT '${fetchUser.username}' ,'${steamid}', '${usuarioId}', '${cargo}', '${DataInicialUTC}', '${DataFinalUTC}', '1', '${valor}', 
                vip_servers.id FROM vip_servers WHERE server_name = '${servidor}'`
            );
        } else return opa;
    } catch (error) {
        return (
            message.channel
                .send(`${message.author} **| Houve um erro ao procurar os sets, contate o 1Mack para ver o ocorrido!**`)
                .then((m) => m.delete({ timeout: 10000 })),
            console.log(error)
        );
    }
    try {
        [rows] = await con.query(
            `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
        );
    } catch (error) {
        return console.log(error);
    }

    let setInfos = rows.map((item) => {
        return `"${item.steamid}"  "@${item.cargo}" //${item.name}  ${
            item.isVip == 1 ? `(${item.date_create} - ${item.discord_id} - ${item.date_final})` : `(${item.discord_id})`
        })`;
    });

    setInfos = setInfos.join('\n');

    for (let j in serversInfos[serversInfosFound.serverNumber].identifier) {
        try {
            await fetch(
                `https://panel.mjsv.us/api/client/servers/${
                    serversInfos[serversInfosFound.serverNumber].identifier[j]
                }/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                        Accept: 'application/json',
                        Authorization: `Bearer ${panelApiKey.api}`,
                    },
                    body: setInfos,
                }
            );
        } catch (error) {
            return (
                message.channel
                    .send(`${message.author} **| Não consegui setar o player, entre em contato com o 1Mack**`)
                    .then((m) => m.delete({ timeout: 7000 })),
                console.log(error)
            );
        }

        try {
            fetch(
                `https://panel.mjsv.us/api/client/servers/${
                    serversInfos[serversInfosFound.serverNumber].identifier[j]
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

    message.channel
        .send(`✅ **|** O **${fetchedUser.user.username}** foi setado com o cargo **${cargo}** in-game com sucesso!!!`)
        .then((m) => m.delete({ timeout: 5000 }));

    if (isVip == false) {
        message.guild.members.cache.get(usuarioId).roles.add([serversInfosFound.tagComprado, '722814929056563260']);
        message.guild.members.cache.get(usuarioId).setNickname('Savage | ' + fetchedUser.user.username);
    } else {
        message.guild.members.cache.get(usuarioId).roles.add([serversInfosFound.tagVip, '753728995849142364']);
    }
    canal.send(logVip);
    fetchUser.send(vipSendMSG);
    client.channels.cache.get('835283126619340830').send(vipSendAllMSG);
};

exports.help = {
    name: 'setar',
};
