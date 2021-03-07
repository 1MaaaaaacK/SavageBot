const Discord = require('discord.js');
const fs = require('fs');
const { serversInfos } = require('../../configs/config_geral');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let steamid = splitarg[1],
        servidor = `${splitarg[0]}`;

    if (!servidor)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> Para procurar alguem basta digitar
     ***!procurar - Servidor***
     
     ou
     
     ***!procurar Servidor - Steamid***`
            )
            .then((m) => m.delete({ timeout: 15000 }));

    servidor = servidor.toLowerCase();

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

    fs.readFile(
        `./servers/admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
        { encoding: 'utf-8' },
        async function (err, data) {
            if (err) return console.log(err);
            let dataArray = data.split('\n');
            if (steamid != undefined) {
                dataArray = dataArray.filter((m) => m.includes(steamid));
                dataArray = dataArray.join('\n');
            } else {
                dataArray = dataArray.filter((m) => m.includes('STEAM'));
                dataArray = dataArray.join('\n');
            }

            if (dataArray == '')
                return message.channel
                    .send(
                        `**<@${message.author.id}> | Não encontrei ninguém com essa steamid no servidor ${servidor}!**`
                    )
                    .then((m) => {
                        m.delete({ timeout: 6000 });
                    });

            const logStaffFind = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Players Setados`)
                .setTimestamp();
            message.channel
                .send(`**<@${message.author.id}> | Te mandei os players setados no seu privado!**`)
                .then((m) => {
                    m.delete({ timeout: 6000 });
                });

            if (dataArray.length <= 2048) {
                message.author.send(logStaffFind.setDescription(`\`\`\`${dataArray}\`\`\``));
            } else {
                await message.author.send(
                    logStaffFind.setDescription('**Encontrei muitos sets, vou te enviar em forma de arquivo!**')
                );

                message.author.send({
                    files: [
                        {
                            attachment: `./servers/admins_simple_${
                                serversInfos[serversInfosFound.serverNumber].name
                            }.txt`,
                            name: `admins_simple_${serversInfos[serversInfosFound.serverNumber].name}.txt`,
                        },
                    ],
                });
            }
        }
    );
};

exports.help = {
    name: 'procurar',
};
