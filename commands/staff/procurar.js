const Discord = require('discord.js');
const { serversInfos } = require('../../configs/config_geral');
const { connection } = require('../../configs/config_privateInfos');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let steamid = splitarg[1],
        servidor = String(splitarg[0]).toLowerCase();

    if (!servidor)
        return message.channel
            .send(
                `😫 **|** <@${message.author.id}> Para procurar alguém basta digitar
     ***!procurar - Servidor***
     
     ou
     
     ***!procurar Servidor - Steamid***`
            )
            .then((m) => m.delete({ timeout: 15000 }));

    if (steamid !== undefined && steamid.startsWith('STEAM_0')) {
        steamid = steamid.replace('0', '1');
    }

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

    if (!message.member.roles.cache.has(serversInfosFound.gerenteRole))
        return message.channel
            .send(
                `😫 **| <@${message.author.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`
            )
            .then((m) => m.delete({ timeout: 7000 }));

    let rows;
    const con = connection.promise();

    try {
        [rows] = await con.query(
            `select * from vip_sets where ${
                steamid == undefined ? `server_id =` : `steamid = "${steamid}" AND server_id =`
            }(select id from vip_servers where server_name = "${servidor}")`
        );
    } catch (error) {
        return (
            message.channel
                .send(`${message.author} **| Houve um erro ao procurar os sets, contate o 1Mack para ver o ocorrido!**`)
                .then((m) => m.delete({ timeout: 10000 })),
            console.log(error)
        );
    }
    if (rows == '') {
        return message.channel
            .send(`**<@${message.author.id}> | Não encontrei ninguém com essa steamid no servidor ${servidor}!**`)
            .then((m) => {
                m.delete({ timeout: 6000 });
            });
    }
    let setInfos = rows.map((item) => {
        return `"${item.steamid}"  "@${item.cargo}" //${
            item.isVip == 0
                ? `${item.name}  (${item.discord_id})`
                : `${item.name} (${item.date_create} - ${item.discord_id} - ${item.date_final})`
        }`;
    });

    setInfos = setInfos.join('\n');

    message.channel.send(`**<@${message.author.id}> | Te mandei os players setados no seu privado!**`).then((m) => {
        m.delete({ timeout: 6000 });
    });

    const [first, ...rest] = Discord.Util.splitMessage(setInfos, { maxLength: 2042 });

    const logStaffFind = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(steamid !== undefined ? `Set do Player no servidor ${servidor}` : `Players Setados no ${servidor}`)
        .setDescription(`\`\`\`${first}\`\`\``);

    if (!rest.length) {
        return message.author.send(logStaffFind);
    }

    await message.author.send(logStaffFind);

    for (const text of rest) {
        logStaffFind.setDescription(`\`\`\`${text}\`\`\``);
        logStaffFind.setTitle('');
        await message.author.send(logStaffFind);
    }
};

exports.help = {
    name: 'procurar',
};
