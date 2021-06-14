const Discord = require('discord.js');
const { panelApiKey, connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const fetch = require('node-fetch');

const { DEMOTARtutorial, DEMOTARserverError, DEMOTARgerenteError } = require('../../embed/error');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let steamid = String(splitarg[0]),
        servidor = String(splitarg[1]).toLowerCase(),
        extra = String(splitarg[2]);

    if (!steamid || !servidor || !extra)
        return message.channel.send(DEMOTARtutorial(message)).then((m) => m.delete({ timeout: 10000 }));

    if (steamid == 'STEAM_1:1:79461554' || steamid == 'STEAM_0:1:79461554')
        return message.channel
            .send(`😫 **|** <@${message.author.id}> Voce não pode ter o 1Mack como alvo :)`)
            .then((m) => m.delete({ timeout: 15000 }));

    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    if (serversInfosFound == undefined)
        return message.channel
            .send(DEMOTARserverError(message, serversInfos))
            .then((m) => m.delete({ timeout: 10000 }));

    if (!message.member.roles.cache.has(serversInfos.find((m) => m.name == servidor).gerenteRole))
        return message.channel.send(DEMOTARgerenteError(message)).then((m) => m.delete({ timeout: 7000 }));

    let guild = client.guilds.cache.get('792575394271592458');
    const canal = guild.channels.cache.find((channel) => channel.id === '792576104681570324');
    let rows, opa;
    const con = connection.promise();

    try {
        [rows] = await con.query(
            `select steamid, server_id, discord_id from vip_sets where steamid = "${steamid}" AND server_id = (select id from vip_servers where server_name = "${servidor}")`
        );
    } catch (error) {
        return (
            message.channel
                .send(`${message.author} **| Houve um erro ao demotar o player, contate o 1Mack para ver o ocorrido!**`)
                .then((m) => m.delete({ timeout: 10000 })),
            console.log(error)
        );
    }

    if (rows == '') {
        return message.channel
            .send(`**<@${message.author.id}> | Não encontrei ninguém com essa steamid no servidor ${servidor}!**`)
            .then((m) => {
                m.delete({ timeout: 7000 });
            });
    }

    await message.channel
        .send(
            `**<@${message.author.id}> | Tem certeza que quer fazer isso? Eu achei ${rows.length} player(s) com essa steamID.** \n**Digite \`SIM\` ou \`NAO\`**`
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
                            .send('**Abortando Comando** <a:savage_loading:837104765338910730>')
                            .then((m) => m.delete({ timeout: 5000 })));
                    } else if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') {
                        return (opa = 's');
                    }
                })
                .catch((err) => {
                    return (opa = message.channel
                        .send('**Você não respondeu a tempo, abortando Comando** <a:savage_loading:837104765338910730>')
                        .then((m) => m.delete({ timeout: 5000 })));
                });
        });

    if (opa != 's') return opa;

    try {
        await con.query(
            `DELETE FROM vip_sets 
        WHERE steamid='${steamid}' AND vip_sets.server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
        );
    } catch (error) {
        return (
            message.channel
                .send(`${message.author} **| Houve um erro ao demotar o player, contate o 1Mack para ver o ocorrido!**`)
                .then((m) => m.delete({ timeout: 10000 })),
            console.log(error)
        );
    }

    try {
        var fetchUser = await client.users.fetch(rows[0].discord_id);
        var fetchedUser = await client.guilds.cache.get('343532544559546368').members.fetch(fetchUser);
    } catch (error) {
        message.channel
            .send(
                `**<@${message.author.id}> | Não achei o discord desse player, você terá que remover o cargo do discord dele manualmente!**`
            )
            .then((m) => m.delete({ timeout: 12000 }));
        console.log(error);
    }
    try {
        [rows] = await con.query(
            `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
        );
    } catch (error) {
        return (
            message.channel
                .send(`${message.author} **| Houve um erro ao demotar o player, contate o 1Mack para ver o ocorrido!**`)
                .then((m) => m.delete({ timeout: 10000 })),
            console.log(error)
        );
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
                    .send(
                        `${message.author} **| Não consegui setar os players no admins_simple, entre em contato com o 1Mack**`
                    )
                    .then((m) => m.delete({ timeout: 10000 })),
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

    const logDemoted = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(fetchUser.username)
        .addFields(
            {
                name: 'discord',
                value: fetchUser,
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
                fetchedUser.roles.remove([serversInfosFound.tagDoCargo, serversInfosFound.tagComprado]);
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
    try {
        canal.send(logDemoted);
        fetchUser.send(demotedSendMSG);
    } catch (error) {}

    message.channel
        .send(`**<@${message.author.id}> | Staff demotado com sucesso!!**`)
        .then((m) => m.delete({ timeout: 5000 }));
};
exports.help = {
    name: 'demotar',
};
