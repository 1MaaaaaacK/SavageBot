const fetch = require('node-fetch');
const { panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const { cargosCertos } = require('../../configs/config_geral');
const { connection } = require('../../configs/config_privateInfos');
const { MackNotTarget, WorngTime, AskQuestion, SetSuccess, vipSendMSG, logVip } = require('./embed');
const {
    GerenteError,
    WrongRole,
    PlayerDiscordNotFound,
    WrongServer,
    InternalServerError,
} = require('../../embed/geral');
const chalk = require('chalk');

module.exports = {
    name: 'setar',
    description: 'Setar um cargo comprado para algum player',
    usage: '@ do Player - steamid - cargo - tempo em dias - valor - servidor - observações',
    cooldown: 0,
    permissions: ['711022747081506826', '831219575588388915'], // Gerente
    args: 7,
    async execute(client, message, args) {
        let discord1 = String(args[0]),
            steamid = String(args[1]),
            cargo = String(args[2]).toLowerCase(),
            tempo = args[3],
            valor = args[4],
            servidor = String(args[5]).toLowerCase(),
            extra = String(args[6]);

        if (!extra) {
            extra = 'Inexistentes';
        }

        if (steamid !== undefined && steamid.startsWith('STEAM_0')) {
            steamid = steamid.replace('0', '1');
        }

        if (
            (steamid == 'STEAM_1:1:79461554' || steamid == 'STEAM_0:1:79461554') &&
            message.author.id !== '323281577956081665'
        )
            return message.channel.send(MackNotTarget(message)).then((m) => m.delete({ timeout: 15000 }));

        tempo = parseInt(tempo);

        if ((!isNaN(tempo) && Number.isInteger(tempo)) == false)
            return message.channel.send(WorngTime(message)).then((m) => m.delete({ timeout: 15000 }));

        if (cargosCertos.find((m) => m == cargo) == undefined)
            return message.channel
                .send(WrongRole(message, cargosCertos, false))
                .then((m) => m.delete({ timeout: 15000 }));

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (serversInfosFound == undefined)
            return message.channel.send(WrongServer(message, serversInfos)).then((m) => m.delete({ timeout: 10000 }));

        if (
            !message.member.roles.cache.has(serversInfosFound.gerenteRole) &&
            !message.member.roles.cache.has('831219575588388915')
        )
            return message.channel.send(GerenteError(message)).then((m) => m.delete({ timeout: 7000 }));

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
            return message.channel.send(PlayerDiscordNotFound(message)).then((m) => m.delete({ timeout: 12000 }));
        }

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
                message.channel.send(InternalServerError(message)).then((m) => m.delete({ timeout: 10000 })),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }

        let opa;

        if (rows != '') {
            await message.channel.send(AskQuestion(message)).then(async (m) => {
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
                            .send('**Abortando Comando** <a:savage_loading:837104765338910730>')
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
                message.channel.send(InternalServerError(message)).then((m) => m.delete({ timeout: 10000 })),
                console.error(chalk.redBright('Erro no Insert'), error)
            );
        }
        try {
            [rows] = await con.query(
                `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
            );
        } catch (error) {
            return console.error(chalk.redBright('Erro no Select'), error);
        }

        let setInfos = rows.map((item) => {
            return `"${item.steamid}"  "@${item.cargo}" //${item.name}  ${
                item.isVip == 1
                    ? `(${item.date_create} - ${item.discord_id} - ${item.date_final})`
                    : `(${item.discord_id})`
            })`;
        });

        setInfos = setInfos.join('\n');

        for (let j in serversInfosFound.identifier) {
            try {
                await fetch(
                    `https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]}/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
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
                    message.channel.send(InternalServerError(message)).then((m) => m.delete({ timeout: 7000 })),
                    console.error(chalk.redBright('Erro na Setagem'), error)
                );
            }

            try {
                fetch(`https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]}/command`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${panelApiKey.api}`,
                    },
                    body: JSON.stringify({ command: 'sm_reloadadmins' }),
                });
            } catch {}
        }

        message.channel.send(SetSuccess(message, fetchedUser, cargo)).then((m) => m.delete({ timeout: 5000 }));

        if (isVip == false) {
            message.guild.members.cache.get(usuarioId).roles.add([serversInfosFound.tagComprado, '722814929056563260']);
            message.guild.members.cache.get(usuarioId).setNickname('Savage | ' + fetchedUser.user.username);
        } else {
            message.guild.members.cache.get(usuarioId).roles.add([serversInfosFound.tagVip, '753728995849142364']);
        }
        canal.send(logVip(fetchedUser, discord1, steamid, DataInicialUTC, DataFinalUTC, cargo, valor, extra, message));
        fetchUser.send(vipSendMSG(fetchUser, cargo, tempo, servidor));
    },
};
