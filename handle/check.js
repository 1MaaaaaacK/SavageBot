const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const fetch = require('node-fetch');
const { webhookVipExpirado, webhookSavageLogs } = require('../configs/config_webhook');
const { serversInfos } = require('../configs/config_geral');
const { panelApiKey } = require('../configs/config_privateInfos');

const webhookLogs = new Discord.WebhookClient(webhookVipExpirado.id, webhookVipExpirado.token);
const webhookChecagemLogs = new Discord.WebhookClient(webhookSavageLogs.id, webhookSavageLogs.token);

function checagem() {
    for (let y in serversInfos) {
        fs.readFile(`./servers/admins_simple_${serversInfos[y].name}.txt`, 'utf8', function (err, data) {
            if (err) return console.log(err);

            let dataArray = data.split('\n');
            let lastIndex = [-1];
            let timeCatch;
            let idCatch = [];
            let timeNow = Date.now();
            timeNow = Math.floor(timeNow / 1000);

            let cont = 0;
            for (let i in dataArray) {
                if (dataArray[i].substring(dataArray[i].length - 1, dataArray[i].length) == '\r') {
                    if (dataArray[i].substring(dataArray[i].length - 12, dataArray[i].length - 10) == '16') {
                        timeCatch = dataArray[i].slice(dataArray[i].length - 12, dataArray[i].length - 2);

                        if (timeCatch < timeNow) {
                            lastIndex[cont] = i;
                            idCatch[cont] = dataArray[i].slice(dataArray[i].length - 33, dataArray[i].length - 14);
                            cont = cont + 1;
                        }
                    }
                } else {
                    if (dataArray[i].substring(dataArray[i].length - 11, dataArray[i].length - 9) == '16') {
                        timeCatch = dataArray[i].slice(dataArray[i].length - 11, dataArray[i].length - 1);

                        if (timeCatch < timeNow) {
                            lastIndex[cont] = i;
                            idCatch[cont] = dataArray[i].slice(dataArray[i].length - 32, dataArray[i].length - 13);
                            cont = cont + 1;
                        }
                    }
                }
            }

            cont = 0;
            let expirados = [];
            if (lastIndex == -1)
                return webhookChecagemLogs.send(
                    `**Procurei no servidor ${serversInfos[y].name} e não achei nenhum cargo expirado!**`,
                    {
                        username: 'SavageLogs',
                        avatarURL:
                            'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
                    }
                );
            for (let i in lastIndex) {
                expirados[cont] = dataArray.splice(lastIndex[i] - cont, 1);

                cont = cont + 1;
            }
            let codigo = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

            for (let z in expirados) {
                const logVipExpirado = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(idCatch[z])
                    .addFields(
                        { name: 'Servidor', value: serversInfos[y].name },
                        {
                            name: 'Informações',
                            value: `\`\`\`${expirados[z]}\`\`\``,
                        },
                        { name: 'Código', value: `\`\`\`${codigo}\`\`\`` }
                    )
                    .setTimestamp();

                webhookLogs.send({
                    username: 'SavageLog',
                    avatarURL:
                        'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
                    embeds: [logVipExpirado],
                });
            }

            dataArray = dataArray.join('\n');

            fs.writeFile(`./servers/admins_simple_${serversInfos[y].name}.txt`, dataArray, (err) => {
                if (err) throw err;

                fs.readFile(`./servers/admins_simple_${serversInfos[y].name}.txt`, 'utf8', function (err, data) {
                    fetch(
                        `https://panel.mjsv.us/api/client/servers/${serversInfos[y].identifier}/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
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
                });
            });
        });
    }
}

module.exports = {
    checagem,
};
