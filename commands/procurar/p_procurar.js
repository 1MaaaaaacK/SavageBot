const Discord = require('discord.js');
const { serversInfos } = require('../../configs/config_geral');
const { connection } = require('../../configs/config_privateInfos');
const { WrongServer, GerenteError, InternalServerError } = require('../../embed/geral');
const { SteamIdNotFound } = require('./embed');
const chalk = require('chalk');

module.exports = {
    name: 'procurar',
    description: 'Ver o cargo de um staff atrabés do @ dele',
    usage: 'Servidor - Steamid **ou** !procurar servidor',
    cooldown: 0,
    permissions: ['711022747081506826'], // Gerente
    args: 1,
    async execute(client, message, args) {
        let servidor = String(args[0]).toLowerCase(),
            steamid = args[1];

        if (steamid !== undefined && steamid.startsWith('STEAM_0')) {
            steamid = steamid.replace('0', '1');
        }

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (serversInfosFound == undefined)
            return message.channel.send(WrongServer(message, serversInfos)).then((m) => m.delete({ timeout: 10000 }));

        if (!message.member.roles.cache.has(serversInfosFound.gerenteRole))
            return message.channel.send(GerenteError(message)).then((m) => m.delete({ timeout: 7000 }));

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
                message.channel.send(InternalServerError(message)).then((m) => m.delete({ timeout: 10000 })),
                console.error(chalk.redBright('Erro no Select'), error)
            );
        }
        if (rows == '') {
            return message.channel.send(SteamIdNotFound(message, steamid)).then((m) => {
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
            .setTitle(
                steamid !== undefined ? `Set do Player no servidor ${servidor}` : `Players Setados no ${servidor}`
            )
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
    },
};
