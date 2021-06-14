const Discord = require('discord.js');
const fetch = require('node-fetch');
const { panelApiKey, connection } = require('../../configs/config_privateInfos');
const { serversInfos, cargosCertos } = require('../../configs/config_geral');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('831219575588388915')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let discord1 = String(splitarg[0]),
        steamid = String(splitarg[1]),
        cargo = String(splitarg[2]).toLowerCase(),
        servidor = String(splitarg[3]).toLowerCase(),
        extra = String(splitarg[4]);

    if (!discord1 || !steamid || !cargo || !servidor)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> Para setar alguém basta digitar ***!setarstaff @ do Player - Steamid - Cargo - Servidor - Observações(opcional)***`
            )
            .then((m) => m.delete({ timeout: 15000 }));

    if (!extra) {
        extra = false;
    }

    if (steamid !== undefined && steamid.startsWith('STEAM_0')) {
        steamid = steamid.replace('0', '1');
    }

    if (steamid == 'STEAM_1:1:79461554' || steamid == 'STEAM_0:1:79461554')
        return message.channel
            .send(`😫 **|** <@${message.author.id}> Voce não pode ter o 1Mack como alvo :)`)
            .then((m) => m.delete({ timeout: 15000 }));

    if (cargosCertos.find((m) => m == cargo) == undefined || cargo == 'vip')
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> ***Voce digitou o cargo errado, os cargos certos são:*** \n\`\`\`mod, modplus, adm, admplus, diretor\`\`\``
            )
            .then((m) => m.delete({ timeout: 15000 }));

    if (cargo == 'dono' && message.author.id != '323281577956081665')
        return message.channel
            .send(`😫 **|** <@${message.author.id}> Somente o 1MaaaaaacK pode setar alguém de dono!!***`)
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

    let logStaff = new Discord.MessageEmbed()
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

    if (extra != false) {
        logStaff = logStaff.addField('Observações', extra);
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
                `😫 **| <@${usuarioId}> Você errou o servidor!!!\nOs servidores sao:**\n\`\`\`${serversInfos.map(
                    function (server) {
                        return ` ${server.name}`;
                    }
                )}\`\`\``
            )
            .then((m) => m.delete({ timeout: 10000 }));

    let guild = client.guilds.cache.get('792575394271592458');

    const canal = guild.channels.cache.find((channel) => channel.id === '792576052144373760');

    let rows;
    const con = connection.promise();

    try {
        [rows] = await con.query(
            `select steamid, server_id from vip_sets where steamid = "${steamid}" AND server_id = (select id from vip_servers where server_name = "${servidor}")`
        );
    } catch (error) {
        return (
            message.channel
                .send(`${message.author} **| Não consegui setar o player, entre em contato com o 1Mack**`)
                .then((m) => m.delete({ timeout: 7000 })),
            console.log(error)
        );
    }
    let opa = undefined;
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
                        message.delete({ timeout: 2000 });
                        if (message.content.toUpperCase() == 'NAO' || message.content.toUpperCase() == 'N') {
                            return (opa = message.channel
                                .send('**Abortando Comando** <a:savage_loading:837104765338910730>')
                                .then((m) => m.delete({ timeout: 5000 })));
                        } else if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') {
                            return (opa = 's');
                        }
                    })
                    .catch(() => {
                        return (opa = message.channel
                            .send(
                                '**Você não respondeu a tempo!!! lembre-se, você tem apenas 15 segundos para responder!** \n***Abortando Comando*** <a:savage_loading:837104765338910730>'
                            )
                            .then((m) => m.delete({ timeout: 10000 })));
                    });
            });
    }

    try {
        if (opa === 's') {
            await con.query(
                `update vip_sets set
            name = '${fetchedUser.user.username}',
            steamid = '${steamid}',
            discord_id = '${usuarioId}', 
            cargo = '${cargo}', 
            date_create = '', 
            date_final = '', 
            isVip = '0', 
            valor = ''
            WHERE (steamid='${steamid}' OR discord_id='${usuarioId}') AND vip_sets.server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
            );
        } else if (opa === undefined) {
            await con.query(
                `insert into vip_sets(name, steamid, discord_id, cargo, date_create, date_final, isVip, valor, server_id) 
                SELECT '${fetchedUser.user.username}', '${steamid}', '${usuarioId}', '${cargo}', '', '', '0', '', 
                vip_servers.id FROM vip_servers WHERE server_name = '${servidor}'`
            );
        } else return opa;
    } catch (error) {
        return (
            message.channel
                .send(`${message.author} **| Não consegui setar o player, entre em contato com o 1Mack**`)
                .then((m) => m.delete({ timeout: 7000 })),
            console.log(error)
        );
    }

    [rows] = await con.query(
        `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
    );
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
    try {
        message.guild.members.cache.get(usuarioId).roles.add([serversInfosFound.tagDoCargo, '722814929056563260']);
        message.guild.members.cache.get(usuarioId).setNickname('Savage | ' + fetchedUser.user.username);
    } catch (error) {
        message.channel
            .send(`${message.author} **| Não consegui setar o cargo/Renomear o player, faça isso manualmente!!**`)
            .then((m) => m.delete({ timeout: 10000 }));
    }

    canal.send(logStaff);
    client.channels.cache.get('710288627103563837').send(staffSendAllMSG);
};

exports.help = {
    name: 'setarstaff',
};
