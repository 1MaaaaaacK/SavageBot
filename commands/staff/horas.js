const Discord = require('discord.js');
const { connection } = require('../../configs/config_privateInfos');
const { serversInfos } = require('../../configs/config_geral');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('711022747081506826')) return;

    message.delete({ timeout: 1000 });
    let splitarg = args.join(' ').split(' - ');

    let servidor = String(splitarg[0]).toLowerCase(),
        steamid = `${splitarg[1]}`;

    if (!server || !steamid)
        return message.channel
            .send(`${message.author} **| A forma correta de usar é: !horastaff servidor - steamid**`)
            .then((m) => m.delete({ timeout: 10000 }));

    

    const serversInfosFound = serversInfos.find((m) => m.name === servidor);

    if (serversInfosFound == undefined)
        return message.channel
            .send(
                `😫 **| ${message.author} Você errou o servidor!!!\nOs servidores sao: \njb, dr, mix, awp, retake, retakepistol, ttt, scout, mg**`
            )
            .then((m) => m.delete({ timeout: 7000 }));

    if (!message.member.roles.cache.has(serversInfosFound.gerenteRole))
        return message.channel
            .send(
                `😫 **| <@${message.author.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`
            )
            .then((m) => m.delete({ timeout: 7000 }));

    connection.query(
        `SELECT * FROM watchdog_${servidor} WHERE auth like '%${steamid.slice(10)}'`,
        function (err, result) {
            if (err)
                return (
                    message.channel
                        .send(
                            `${message.author} **| Houve um erro ao procurar a hora desse player, provavelmente não existe esse servidor no sistema de horários**`
                        )
                        .then((m) => m.delete({ timeout: 5000 })),
                    console.log(err)
                );
            if (result == '') {
                return message.channel
                    .send(`${message.author} **| Não encontrei as horas desse staff **`)
                    .then((m) => m.delete({ timeout: 5000 }));
            }

            function HourFormat(duration) {
                var hrs = ~~(duration / 3600);
                var mins = ~~((duration % 3600) / 60);

                return mins == 0 ? `${hrs} horas` : `${hrs} horas e ${mins} minutos`;
            }

            const embed = new Discord.MessageEmbed()
                .setColor('36393f')
                .setTitle(result[0].name)
                .addFields(
                    { name: `**Horas Jogadas**`, value: HourFormat(result[0].time) },
                    { name: '**Servidor**', value: servidor.toUpperCase() },
                    { name: '**Steamid**', value: steamid }
                )
                .setFooter(`Horas Requisitadas pelo ${message.author.username}`)
                .setTimestamp();
            message.channel.send(embed);
        }
    );
};

exports.help = {
    name: 'horas',
};
