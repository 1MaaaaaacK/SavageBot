const fetch = require('node-fetch');
const { connection, panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const {
    AskQuestion,
    CheckDatabaseError,
    Top1NotFound,
    logVip,
    vipSendAllMSG,
    vipSendMSG,
    SetSuccess,
} = require('./embed');
const chalk = require('chalk');

const { InternalServerError } = require('../../embed/geral');
module.exports = {
    name: 'resetrank',
    description: 'Resetar ranks e dar Vip pro TOP1 ',
    usage: '',
    cooldown: 30,
    permissions: ['603318536798077030'], //fundador
    args: 0,
    async execute(client, message, args) {
        message.channel.send(AskQuestion(message)).then((m) => {
            m.delete({ timeout: 15000 }).catch(() => {});

            let filter = (m) => m.author.id === message.author.id;
            m.channel
                .awaitMessages(filter, {
                    max: 1,
                    time: 15000,
                    errors: ['time'],
                })
                .then(async (message) => {
                    message = message.first();
                    message.delete({ timeout: 2000 });
                    if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') {
                        const servidores = ['awp', 'mix', 'retake', 'retakepistol', 'surf'];
                        let rows, rows1;
                        for (let serverNumber in servidores) {
                            const con = connection.promise();

                            try {
                                [rows] = await con.query(
                                    `select lvl_${servidores[serverNumber]}.steam, 
                lvl_${servidores[serverNumber]}.name, 
                lvl_${servidores[serverNumber]}.value, du_users.userid from lvl_${servidores[serverNumber]} 
                inner join du_users on lvl_${servidores[serverNumber]}.steam = du_users.steamid order by value desc limit 5`
                                );
                            } catch (error) {
                                return (
                                    message.channel
                                        .send(InternalServerError(message))
                                        .then((m) => m.delete({ timeout: 10000 }).catch(() => {})),
                                    console.error(chalk.redBright('Erro no Select'), error)
                                );
                            }

                            async function DeletarRank() {
                                try {
                                    await con.query(`delete from lvl_${servidores[serverNumber]}`);
                                } catch (error) {
                                    return (
                                        message.channel
                                            .send(CheckDatabaseError(message, servidores, serverNumber))
                                            .then((m) => m.delete({ timeout: 10000 }).catch(() => {})),
                                        console.error(chalk.redBright('Erro no Delete'), error)
                                    );
                                }
                            }

                            let procurar = rows.find((m) => m.userid !== '');
                            if (procurar !== undefined) {
                                try {
                                    [rows1] = await con.query(
                                        `select * from vip_sets where steamid = "${procurar.steam}" AND server_id = (select id from vip_servers where server_name = "${servidores[serverNumber]}")`
                                    );
                                } catch (error) {
                                    return (
                                        message.channel
                                            .send(InternalServerError(message))
                                            .then((m) => m.delete({ timeout: 10000 }).catch(() => {})),
                                        console.error(chalk.redBright('Erro no Select'), error)
                                    );
                                }

                                try {
                                    var fetchUser = await client.users.fetch(procurar.userid);
                                    var fetchedUser = await client.guilds.cache
                                        .get('343532544559546368')
                                        .members.fetch(fetchUser);
                                } catch (error) {
                                    message.channels
                                        .send(Top1NotFound(message, servidores, serverNumber, procurar))
                                        .then((m) => m.delete({ timeout: 12000 }).catch(() => {}));
                                    DeletarRank();
                                    continue;
                                }

                                let dataInicial = Date.now();
                                dataInicial = Math.floor(dataInicial / 1000);

                                let dataFinal = dataInicial + 30 * 86400,
                                    DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString('en-GB');

                                let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString('en-GB');

                                if (rows1 == '') {
                                    try {
                                        await con.query(
                                            `insert into vip_sets(name, steamid, discord_id, cargo, date_create, date_final, isVip, valor, server_id) 
                        SELECT '${fetchUser.username}' ,'${procurar.steam}', '${procurar.userid}', 'vip', '${DataInicialUTC}', '${DataFinalUTC}', '1', '0', 
                        vip_servers.id FROM vip_servers WHERE server_name = '${servidores[serverNumber]}'`
                                        );
                                    } catch (error) {
                                        //tratar erro
                                        console.error(chalk.redBright('Erro no Insert'), error);
                                    }
                                } else if (
                                    rows1[0].date_final != '0' &&
                                    rows1[0].date_final != null &&
                                    rows1[0].isVip == 1
                                ) {
                                    //Gambiarra :)
                                    dataFinal =
                                        rows1[0].date_final.slice(3, 5) +
                                        '/' +
                                        rows1[0].date_final.slice(0, 2) +
                                        '/' +
                                        rows1[0].date_final.slice(6, 10);
                                    dataFinal = Date.parse(dataFinal) / 1000 + 30 * 86400;
                                    DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString('en-GB');
                                    try {
                                        await con.query(
                                            `update vip_sets set name = '${fetchUser.username}',
                                            steamid = '${procurar.steam}',
                                            discord_id = '${procurar.userid}', 
                                            cargo = 'vip', 
                                            date_create = '${DataInicialUTC}', 
                                            date_final = '${DataFinalUTC}', 
                                            isVip = '1', 
                                            valor = '0'
                                            WHERE (steamid='${procurar.steam}' 
                                            OR discord_id='${procurar.userid}') AND vip_sets.server_id = (select vip_servers.id from vip_servers 
                                            where vip_servers.server_name = '${servidores[serverNumber]}')`
                                        );
                                    } catch (error) {
                                        return (
                                            message.channel
                                                .send(InternalServerError(message))
                                                .then((m) => m.delete({ timeout: 10000 }).catch(() => {})),
                                            console.error(chalk.redBright('Erro no Update'), error)
                                        );
                                    }
                                } else {
                                    message.channel
                                        .send(`Não teve nenhum **TOP** no servidor **${servidores[serverNumber]}**`)
                                        .then((m) => m.delete({ timeout: 10000 }).catch(() => {}));
                                    DeletarRank();
                                    continue;
                                }

                                try {
                                    [rows] = await con.query(
                                        `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidores[serverNumber]}')`
                                    );
                                } catch (error) {
                                    return (
                                        message.channel
                                            .send(
                                                `Aconteceu algum erro ao checar a Database do **${servidores[serverNumber]}**, contate o 1Mack`
                                            )
                                            .then((m) => m.delete({ timeout: 10000 })),
                                        console.error(chalk.redBright('Erro no Select'), error)
                                    );
                                }
                                let setInfos = rows.map((item) => {
                                    return `"${item.steamid}"  "@${item.cargo}" //${
                                        item.name
                                    }  ${`(${item.date_create} - ${item.discord_id} - ${item.date_final})`})`;
                                });

                                setInfos = setInfos.join('\n');

                                const serversInfosFound = serversInfos.find((m) => m.name === servidores[serverNumber]);

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
                                            message.channel
                                                .send(InternalServerError(message))
                                                .then((m) => m.delete({ timeout: 7000 }).catch(() => {})),
                                            console.error(chalk.redBright('Erro na Setagem'), error)
                                        );
                                    }

                                    try {
                                        fetch(
                                            `https://panel.mjsv.us/api/client/servers/${serversInfosFound.identifier[j]}/command`,
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
                                    .send(SetSuccess(message, fetchedUser, servidores, serverNumber))
                                    .then((m) => m.delete({ timeout: 5000 }).catch(() => {}));

                                message.guild.members.cache
                                    .get(procurar.userid)
                                    .roles.add([serversInfosFound.tagVip, '753728995849142364']);

                                let guild = client.guilds.cache.get('792575394271592458');

                                const canal = guild.channels.cache.find(
                                    (channel) => channel.id === '851458777470337084'
                                );
                                canal.send(
                                    logVip(
                                        fetchedUser,
                                        procurar,
                                        DataInicialUTC,
                                        DataFinalUTC,
                                        servidores,
                                        serverNumber
                                    )
                                );
                                fetchUser.send(vipSendMSG(fetchUser, servidores, serverNumber));
                                client.channels.cache.get('835283126619340830').send(vipSendAllMSG(fetchUser));
                                DeletarRank();
                            } else {
                                message.channel
                                    .send(`Não teve nenhum **TOP** no servidor **${servidores[serverNumber]}**`)
                                    .then((m) => m.delete({ timeout: 10000 }).catch(() => {}));
                                DeletarRank();
                                continue;
                            }
                        }
                    } else if (message.content.toUpperCase() == 'NAO' || message.content.toUpperCase() == 'N') {
                        message.channel
                            .send('Abortando comando<a:savage_loading:837104765338910730>')
                            .then((m) => m.delete({ timeout: 6000 }).catch(() => {}));
                    }
                })
                .catch(() => {
                    message.channel
                        .send('Você não respondeu a tempo, abortando comando<a:savage_loading:837104765338910730>')
                        .then((m) => m.delete({ timeout: 6000 }).catch(() => {}));
                });
        });
    },
};
