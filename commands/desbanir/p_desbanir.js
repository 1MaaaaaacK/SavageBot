const { connection } = require('../../configs/config_privateInfos');
const { DesbanLog, PlayerNotFound } = require('./embed');
const { InternalServerError } = require('../../embed/geral');
const chalk = require('chalk');

module.exports = {
    name: 'desbanir',
    description: 'Desbanir alguém do servidor',
    usage: 'steamid - motivo',
    cooldown: 30,
    permissions: ['778273624305696818'], //Perm Ban
    args: 2,
    async execute(client, message, args) {
        if (!message.member.roles.cache.has('778273624305696818')) return;

        let steamid = args[0],
            reason = args[1];

        let timeNow = Date.now();
        timeNow = Math.floor(timeNow / 1000);

        const con = connection.promise();

        try {
            let [rows] = await con.query(
                `SELECT authid, RemoveType from sb_bans WHERE authid = "${steamid}" AND RemovedOn is null`
            );

            if (rows == '') {
                return message.channel.send(PlayerNotFound(message)).then((m) => m.delete({ timeout: 6000 }));
            }
            await con.query(
                `UPDATE sb_bans SET RemovedBy = 22, RemoveType = "U", RemovedOn = ${timeNow}, ureason = "${reason}" WHERE authid = "${steamid}"`
            );
            client.channels.cache.get('721854111741509744').send(DesbanLog(steamid, reason, message));
            message.channel.send(DesbanLog(steamid, reason, message)).then((m) => m.delete({ timeout: 5000 }));
        } catch (error) {
            message.channel.send(InternalServerError(message)).then((m) => m.delete({ timeout: 6000 }));
            console.error(chalk.redBright('Erro no Desbanir'), error);
        }
    },
};
