const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require('mysql');
const fs = require('fs');
const fetch = require('node-fetch');
const { connection } = require('../../configs/config_privateInfos');
const { panelApiKey } = require('../../configs/config_geral');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('778273624305696818')) return;

    message.delete({ timeout: 1000 });
    /* 
      message.channel.send(`**<@${message.author.id}> |** Você tem certeza que quer resetar o rank de todos os servers e dar ***VIP*** para o TOP1?
      \n**Digite \`SIM\` - Para eu excluir o cargo anterior e setar o novo**
      \n**ou**\n\n**Digite \`NAO\` - Para que eu deixe o cargo antigo e não ponha o novo**`).then(m => {
          m.delete({ timeout: 15000 })
  
          let filter = m => m.author.id === message.author.id
          m.channel.awaitMessages(filter, {
              max: 1,
              time: 15000,
              errors: ['time']
          })
              .then(message => {
                  message = message.first()
                  message.delete({ timeout: 2000 })
                  if (message.content.toUpperCase() == 'SIM' || message.content.toUpperCase() == 'S') { */

    const servidores = ['awp', 'mix', 'retake', 'retakepistol'];

    try {
        for (let serverNumber in servidores) {
            connection.query(
                `select lvl_${servidores[serverNumber]}.steam, lvl_${servidores[serverNumber]}.name, lvl_${servidores[serverNumber]}.value, du_users.userid from lvl_${servidores[serverNumber]} inner join du_users on lvl_${servidores[serverNumber]}.steam = du_users.steamid order by value desc limit 5`,
                function (err, result) {
                    if (err) return console.log(err);
                    let topRank = [],
                        cont = 0;

                    result.forEach((valor) => {
                        if (valor.userid !== '') {
                            topRank[cont] = valor;
                            cont += 1;
                        }
                    });
                    if (topRank == '') {
                        return message.channel
                            .send(`Não achei nenhum TopRank no **${servidores[serverNumber]}**`)
                            .then((m) => m.delete({ timeout: 7000 }));
                    }

                    fs.readFile(
                        `./servers/admins_simple_${serversApi[serverNumber].name}.txt`,
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
                            let dataInicial = Date.now();
                            dataInicial = Math.floor(dataInicial / 1000);
                            let dataFinal = dataInicial + tempo * 86400;

                            let DataInicialUTC = new Date(dataInicial * 1000).toLocaleDateString(),
                                DataFinalUTC = new Date(dataFinal * 1000).toLocaleDateString();

                            cont = 0;
                            for (let i in TotalSteamid) {
                                dataArray.splice(TotalSteamid[i] - cont, 1);
                                cont = cont + 1;
                            }
                            dataArray.push(
                                `\r\n"${steamid}"  "@${cargo}"  //${fetchedUser.user.username} (${DataFinalUTC} - DC${topRank.userid} - ${dataFinal})`
                            );
                            for (let i in dataArray) {
                                if (dataArray[i] == '\r') {
                                    dataArray.splice(i, 1);
                                }
                            }

                            const updatedData = dataArray.join('\n');
                            fs.writeFile(
                                `./servers/admins_simple_${serversApi[serverNumber].name}.txt`,
                                updatedData,
                                (err) => {
                                    if (err) throw err;

                                    fs.readFile(
                                        `./servers/admins_simple_${serversApi[serverNumber].name}.txt`,
                                        'utf8',
                                        function (err, data) {
                                            fetch(
                                                `https://panel.mjsv.us/api/client/servers/${serversApi[serverNumber].identifier}/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
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
                                    message.channel
                                        .send(
                                            `✅ **|** O **<@${topRank.userid}>** foi setado com **Vip** in-game com sucesso!!!`
                                        )
                                        .then((m) => m.delete({ timeout: 5000 }));
                                    message.guild.members.cache.get(usuarioId).roles.add('753728995849142364');

                                    canal.send(logVip);
                                }
                            );
                        }
                    );
                }
            );
        }
    } catch (error) {
        client.channels.cache
            .get('770401787537522738')
            .send(`😫 **| <@${message.author.id}> Houve um erro ao tentar banir o player!**`);
        console.log(error);
    }

    /*       }
    })


 






}) */
};
exports.help = {
    name: 'resetrank',
};
