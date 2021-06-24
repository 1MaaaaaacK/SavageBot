const { connection } = require('../../configs/config_privateInfos');
const { BanSucess, Banlog, BanError } = require('./embed');
const chalk = require('chalk');

module.exports = {
    name: 'banir',
    description: 'Banir alguém do servidor',
    usage: 'nick - steamid - tempo em minutos - motivo',
    cooldown: 15,
    permissions: ['778273624305696818'], //Perm ban
    args: 4,
    async execute(client, message, args) {
        let nick = args[0],
            steamid = args[1],
            tempo = args[2],
            reason = args[3];

        let timeNow = Date.now();
        timeNow = Math.floor(timeNow / 1000);
        let timeEnd = timeNow + tempo * 60;

        const con = connection.promise();

        try {
            let sqlBans =
                    'INSERT INTO sb_bans (authid, name, created, ends, length, reason, aid, sid, country, type) VALUES ?',
                SqlBan_VALUES = [[`${steamid}`, `${nick}`, timeNow, timeEnd, tempo, reason, 22, 0, null, 0]];

            await con.query(sqlBans, [SqlBan_VALUES]);
            client.channels.cache.get('721854111741509744').send(Banlog(nick, steamid, tempo, reason, message));
            message.channel
                .send(BanSucess(message, nick, steamid))
                .then((m) => m.delete({ timeout: 10000 }).catch(() => {}));
        } catch (error) {
            message.channel.send(BanError(message));
            console.error(chalk.redBright('Erro no Banimento'), error);
        }
    },
};
