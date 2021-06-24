const { panelApiKey, connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const fetch = require('node-fetch');
const {
    MackNotTarget,
    SteamidNotFound,
    PlayerDiscordRoleNotFound,
    DemotedLog,
    DemotedSendMSG,
    DemotedAskConfirm,
} = require('./embed');
const { WrongServer, GerenteError, InternalServerError, RenameError } = require('../../embed/geral');
const chalk = require('chalk');

module.exports = {
    name: 'demotar',
    description: 'Demotar algéum do servidor',
    usage: 'steamid - servidor - motivo',
    cooldown: 0,
    permissions: ['831219575588388915'], //Perm Set
    args: 3,
    async execute(client, message, args) {
        let steamid = String(args[0]),
            servidor = String(args[1]).toLowerCase(),
            extra = String(args[2]);

        if (
            (steamid == 'STEAM_1:1:79461554' || steamid == 'STEAM_0:1:79461554') &&
            message.author.id !== '323281577956081665'
        )
            return message.channel
                .send(MackNotTarget(message))
                .then((m) => m.delete({ timeout: 15000 }).catch(() => {}));

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (serversInfosFound == undefined)
            return message.channel
                .send(WrongServer(message, serversInfos))
                .then((m) => m.delete({ timeout: 10000 }).catch(() => {}));

        let guild = client.guilds.cache.get('792575394271592458');
        const canal = guild.channels.cache.find((channel) => channel.id === '792576104681570324');
        let rows, opa, rows2;
        const con = connection.promise();

        if (steamid.startsWith('STEAM_0')) {
            steamid = steamid.replace('0', '1');
        }

        try {
            [rows] = await con.query(
                `select steamid, server_id, cargo, discord_id from vip_sets where steamid = "${steamid}" AND server_id = (select id from vip_servers where server_name = "${servidor}")`
            );
        } catch (error) {
            return (
                message.channel
                    .send(InternalServerError(message))
                    .then((m) => m.delete({ timeout: 10000 }).catch(() => {})),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }

        if (rows == '') {
            return message.channel.send(SteamidNotFound(message, servidor)).then((m) => {
                m.delete({ timeout: 7000 }).catch(() => {});
            });
        }

        await message.channel.send(DemotedAskConfirm(message, rows)).then(async (m) => {
            m.delete({ timeout: 15000 }).catch(() => {});

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
                            .then((m) => m.delete({ timeout: 5000 }).catch(() => {})));
                    } else if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') {
                        return (opa = 's');
                    }
                })
                .catch((err) => {
                    return (opa = message.channel
                        .send('**Você não respondeu a tempo, abortando Comando** <a:savage_loading:837104765338910730>')
                        .then((m) => m.delete({ timeout: 5000 }).catch(() => {})));
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
                    .send(InternalServerError(message))
                    .then((m) => m.delete({ timeout: 10000 }).catch(() => {})),
                console.error(chalk.redBright('Erro no Delete'), error)
            );
        }

        try {
            var fetchUser = await client.users.fetch(rows[0].discord_id);
            var fetchedUser = await client.guilds.cache.get('343532544559546368').members.fetch(fetchUser);
        } catch (error) {
            message.channel
                .send(PlayerDiscordRoleNotFound(message))
                .then((m) => m.delete({ timeout: 12000 }).catch(() => {}));
        }
        try {
            [rows2] = await con.query(
                `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
            );
        } catch (error) {
            return (
                message.channel
                    .send(InternalServerError(message))
                    .then((m) => m.delete({ timeout: 10000 }).catch(() => {})),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }

        let setInfos = rows2.map((item) => {
            return `"${item.steamid}"  "@${item.cargo}" //${item.name}  ${
                item.isVip == 1
                    ? `(${item.date_create} - ${item.discord_id} - ${item.date_final})`
                    : `(${item.discord_id})`
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
                        .send(InternalServerError(message))
                        .then((m) => m.delete({ timeout: 10000 }).catch(() => {})),
                    console.error(chalk.redBright('Erro no Admins_Simple'), error)
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

        if (fetchedUser != undefined) {
            if (fetchedUser.nickname != null) {
                let cont = 0,
                    contVip = 0;

                for (let x = 0; x < serversInfos.length; x++) {
                    for (let i in fetchedUser._roles) {
                        if (fetchedUser._roles[i] == serversInfos[x].tagDoCargo) {
                            cont = cont + 1;
                        } else if (fetchedUser._roles[i] == serversInfos[x].tagComprado) {
                            cont = cont + 1;
                        } else if (fetchedUser._roles[i] == serversInfos[x].tagVip) {
                            contVip = contVip + 1;
                        }
                    }
                }
                if (rows[0].cargo.includes('vip')) {
                    if (contVip > 1) {
                        fetchedUser.roles.remove(serversInfosFound.tagVip);
                    } else {
                        fetchedUser.roles.remove([serversInfosFound.tagVip, '753728995849142364']);
                    }
                } else if (cont > 1) {
                    fetchedUser.roles.remove([serversInfosFound.tagDoCargo, serversInfosFound.tagComprado]);
                } else {
                    fetchedUser.roles.remove([
                        serversInfosFound.tagDoCargo,
                        '722814929056563260',
                        serversInfosFound.tagComprado,
                    ]);
                    fetchedUser.setNickname(fetchedUser.nickname.substr(9)).catch((error) => {
                        message.channel.send(RenameError(message)).then((m) =>
                            m
                                .delete({
                                    timeout: 12000,
                                })
                                .catch(() => {})
                        );
                    });
                }
            }
        }
        try {
            canal.send(DemotedLog(fetchUser, steamid, extra, message));
            fetchUser.send(DemotedSendMSG(fetchUser, steamid, servidor, extra));
        } catch (error) {}

        message.channel
            .send(`**<@${message.author.id}> | Staff demotado com sucesso!!**`)
            .then((m) => m.delete({ timeout: 5000 }).catch(() => {}));
    },
};
