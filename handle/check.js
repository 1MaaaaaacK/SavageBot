const Discord = require('discord.js');
const fetch = require('node-fetch');
const { webhookVipExpirado, webhookSavageLogs } = require('../configs/config_webhook');
const { serversInfos } = require('../configs/config_geral');
const { panelApiKey, connection } = require('../configs/config_privateInfos');

const webhookLogs = new Discord.WebhookClient(webhookVipExpirado.id, webhookVipExpirado.token);
const webhookChecagemLogs = new Discord.WebhookClient(webhookSavageLogs.id, webhookSavageLogs.token);

async function checagem() {
    for (let y in serversInfos) {
        let rows;
        const con = connection.promise();
        let dataInicial = Date.now();
        dataInicial = Math.floor(dataInicial / 1000);

        let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString();

        try {
            [rows] = await con.query(
                `select * from vip_sets where date_final < "${DataInicialUTC}" AND date_final != 0 AND server_id = (select id from vip_servers where server_name = "${serversInfos[y].name}")`
            );
        } catch (error) {
            //tratar erro
            console.log(error);
        }
        if (rows == '') {
            webhookChecagemLogs.send(
                `**Procurei no servidor ${serversInfos[y].name} e não achei nenhum cargo expirado!**`,
                {
                    username: 'SavageLogs',
                    avatarURL:
                        'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
                }
            );
            continue;
        }
        rows.forEach((m) => {
            let codigo = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

            const logVipExpirado = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(m.id)
                .addFields(
                    { name: 'Servidor', value: serversInfos[y].name },
                    {
                        name: 'Informações',
                        value: `\`\`\`"${m.steamid}  "${m.cargo}"  //"${m.name} (${m.date_create} - ${m.discord_id} - ${m.date_final}\`\`\``,
                    },
                    { name: 'Código', value: `\`\`\`${codigo}\`\`\`` }
                )
                .setTimestamp();

            webhookLogs.send({
                username: 'SavageLog',
                avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
                embeds: [logVipExpirado],
            });
        });

        try {
            [rows] = await con.query(`delete FROM vip_sets where id IN (${rows.map((x) => x.id)})`);
        } catch (error) {
            webhookChecagemLogs.send(`**Não consegui deletar os sets no servidor ${serversInfos[y].name}**`, {
                username: 'SavageLogs',
                avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
            });
            console.log(error);
            continue;
        }
        let setInfos;
        try {
            [rows] = await con.query(
                `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
            );
            setInfos = rows.map((item) => {
                if (rows.isVip == 0) {
                    return `"${item.steamid}"  "${item.cargo}" //${fetchedUser.user.username} (${item.date_create} - ${item.discord_id} - ${item.date_final})`;
                } else {
                    return `"${item.steamid}"  "${item.cargo}" //${fetchedUser.user.username} (${item.discord_id})`;
                }
            });
        } catch (error) {
            webhookChecagemLogs.send(
                `**Deletei os sets no servidor ${serversInfos[y].name}, porém não consegui setá-los no servidor!**`,
                {
                    username: 'SavageLogs',
                    avatarURL:
                        'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
                }
            );
            console.log(error);
            continue;
        }

        setInfos = setInfos.join('\n');
        try {
            fetch(
                `https://panel.mjsv.us/api/client/servers/${serversInfos[y].identifier}/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
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
            webhookChecagemLogs.send(
                `**Deletei os sets no servidor ${serversInfos[y].name}, porém não consegui setá-los no servidor!**`,
                {
                    username: 'SavageLogs',
                    avatarURL:
                        'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
                }
            );
            console.log(error);
            continue;
        }
    }
}

module.exports = {
    checagem,
};
