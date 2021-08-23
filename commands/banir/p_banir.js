const { connection } = require('../../configs/config_privateInfos');
const { BanSucess, Banlog, BanError } = require('./embed');
const chalk = require('chalk');
//nick - steamid - tempo em minutos - motivo
module.exports = {
    name: 'banir',
    description: 'Banir alguém do servidor',
    options: [{name: 'nick', type: 3, description: 'Nick do Player', required: true, choices: null},
            {name: 'steamid', type: 3, description: 'Steamid do Player', required: true, choices: null},
            {name: 'tempo', type: 4, description: 'Valor em minutos', required: true, choices: null},
            {name: 'motivo', type: 3, description: 'Motivo do Ban', required: true, choices: null}],
    default_permission: false,
    cooldown: 15,
    permissions: [{id: '778273624305696818', type: 1, permission: true}], //Perm ban
    async execute(client, interaction) {
         let nick = interaction.options.getString('nick'),
            steamid = interaction.options.getString('steamid'),
            tempo = interaction.options.getInteger('tempo').toString(),
            reason = interaction.options.getString('motivo');
           
         let timeNow = Date.now();
        timeNow = Math.floor(timeNow / 1000);
        let timeEnd = timeNow + tempo * 60;

        const con = connection.promise();

        try {
            let sqlBans =
                    'INSERT INTO sb_bans (authid, name, created, ends, length, reason, aid, sid, country, type) VALUES ?',
                SqlBan_VALUES = [[`${steamid}`, `${nick}`, timeNow, timeEnd, tempo, reason, 22, 0, null, 0]];

            await con.query(sqlBans, [SqlBan_VALUES]);
            client.channels.cache.get('721854111741509744').send({embeds: [Banlog(nick, steamid, tempo, reason, interaction.user)]});
            await interaction.reply({embeds: [BanSucess(interaction.user, nick, steamid)]})
            setTimeout(() => interaction.deleteReply(), 7000)
        } catch (error) {
            interaction.channel.send({embeds: [BanError(interaction.user)]});
            console.error(chalk.redBright('Erro no Banimento'), error);
        }  
    },
};
