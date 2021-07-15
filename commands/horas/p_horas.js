const Discord = require('discord.js');
const { connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');
const { GerenteError, WrongServer } = require('../../embed/geral');
const { HorasLog, StaffHoursNotFound, HoursNotFoundError } = require('./embed');
module.exports = {
    name: 'horas',
    description: 'Ver as horas in-game dos staffs',
    usage: 'servidor - steamid',
    cooldown: 0,
    permissions: ['711022747081506826'], // Gerente
    args: 2,
    async execute(client, message, args) {
        let servidor = String(args[0]).toLowerCase(),
            steamid = String(args[1]);

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (serversInfosFound == undefined)
            return message.channel.send(WrongServer(message, serversInfos)).then((m) => m.delete({ timeout: 7000 }));

        if (!message.member.roles.cache.has(serversInfosFound.gerenteRole))
            return message.channel.send(GerenteError(message)).then((m) => m.delete({ timeout: 7000 }));

        const con = connection.promise();
        let result;
        try {
            [result] = await con.query(`SELECT * FROM watchdog_${servidor} WHERE auth like '%${steamid.slice(10)}'`);

            if (result == '') {
                return message.channel.send(StaffHoursNotFound(message)).then((m) => m.delete({ timeout: 5000 }));
            }

            function HourFormat(duration) {
                var hrs = ~~(duration / 3600);
                var mins = ~~((duration % 3600) / 60);

                return mins == 0 ? `${hrs} horas` : `${hrs} horas e ${mins} minutos`;
            }

            message.channel.send(HorasLog(result, HourFormat, servidor, steamid, message));
        } catch (error) {
            message.channel.send(HoursNotFoundError(message)).then((m) => m.delete({ timeout: 5000 }));
            console.log(error);
        }
    },
};
