const Discord = require('discord.js');
const { connection, panelApiKey } = require('../../configs/config_privateInfos');
const { serversInfos, servidoresHoras } = require('../../configs/config_geral');

module.exports = {
    name: 'horasdemotar',
    description: 'Ver as horas in-game dos staffs',
    options: [{name: 'servidor', type: 3, description: 'Escolha um Servidor', required: true, choices: servidoresHoras.map(m => { return {name: m, value: m}})}],
    default_permission: false,
    cooldown: 0,
    permissions: [{id: '711022747081506826', type: 1, permission: true}, // Gerente
                {id: '831219575588388915', type: 1, permission: true}], //perm set
    async execute(client, interaction) {

        let servidor = interaction.options.getString('servidor').toLowerCase()

        const serversInfosFound = serversInfos.find((m) => m.name === servidor);

        if (!interaction.member._roles.find(m => m == serversInfosFound.gerenteRole))
            return interaction.reply({
                content:`😫 **| <@${interaction.user.id}> Você não pode ter esse servidor como alvo, pois você não é gerente dele!**`
            })
            .then(() => setTimeout(() => interaction.deleteReply(), 10000));

        const con = connection.promise();

        let canalCheck = client.channels.cache.find((m) => m.name === `horasdemotar→${interaction.user.id}`);

        if (canalCheck === undefined) {
            await interaction.guild.channels.create(`horasdemotar→${interaction.user.id}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
                parent: '818261624317149235',
            });
            canalCheck = client.channels.cache.find((m) => m.name === `horasdemotar→${interaction.user.id}`);
        }
        interaction.deferReply()
        interaction.followUp({content: `Canal criado com sucesso <#${canalCheck.id}>`}).then(() => setTimeout(() => interaction.deleteReply(), 10000));

        let canalAwait = canalCheck;
        let guild = client.guilds.cache.get('792575394271592458');

        await canalAwait.bulkDelete(100);

        let [result] = await con.query(
            `select * from watchdog_${servidor} inner join vip_sets
            on auth = steamid
            where isVip = '0'
            and time < '72000'
            and server_id = (select id from vip_servers where server_name = '${servidor}')`
        );

        if (result == '') {
            return (
                await canalCheck.send({content: 'Não achei ninguém com hora menor!! Deletando canal'}),
                setTimeout(async function () {
                    canalCheck.delete();
                }, 6000)
            );
        }

        for (let i in result) {
            canalAwait.bulkDelete(100);

            function HourFormat(duration) {
                var hrs = ~~(duration / 3600);
                var mins = ~~((duration % 3600) / 60);

                return mins == 0 ? `${hrs} horas` : `${hrs} horas e ${mins} minutos`;
            }

            let formMessage = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(result[i].name)
                .addFields(
                    { name: 'Steamid', value: `${result[i].steamid}` },
                    { name: 'DiscordID', value: `${result[i].discord_id}` },
                    { name: 'Cargo', value: `${result[i].cargo}` },
                    { name: 'Horas Jogadas', value: `${HourFormat(result[i].time)}` }
                );

            await canalAwait.send({embeds: [formMessage]});

            const filter = (f) =>
                (f.author == interaction.user && f.content.toLowerCase() === 'demotar') ||
                f.content.toLowerCase() === 'proximo';

            await canalAwait
                .awaitMessages(filter, { max: 1, time: 1000000, errors: ['time'] })
                .then(async (collected) => {
                    collected = collected.first();
                    collected = collected.content.toLowerCase();

                    if (collected == 'proximo') {
                        return;
                    } else if (collected == 'demotar') {
                        try {
                            var fetchUser = await client.users.fetch(result[i].discord_id);
                        } catch (error) {
                            canalAwait
                                .send({content:
                                    `**<@${interaction.user.id}> | Não achei o discord desse player, confira se ele realmente está no discord!!**`
                                })
                        
                            console.log(error);
                        }

                        await con.query(`delete from watchdog_${servidor} where auth = ${result[i].steamid}`);
                        await con.query(`delete from vip_sets where steamid = ${result[i].steamid} 
                    and server_id = (select id from vip_servers where server_name = '${servidor}')`);

                        const logDemoted = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(fetchUser.username)
                            .addFields(
                                {
                                    name: 'discord',
                                    value: fetchUser.toString(),
                                },
                                { name: 'Steamid', value: steamid },
                                { name: 'Servidor', value: servidor.toUpperCase() },
                                { name: 'Observações', value: extra }
                            )
                            .setFooter(`Demotado Pelo ${interaction.user.username}`);

                        const demotedSendMSG = new Discord.MessageEmbed()
                            .setColor('FF0000')
                            .setTitle(`Olá ${fetchUser.username}`)
                            .setDescription(
                                `***Você foi demotado!!***\n\nAgradecemos o tempo que passou conosco, porém tudo uma hora chega ao Fim...`
                            )
                            .addFields(
                                { name: '**STEAMID**', value: `\`\`\`${steamid}\`\`\`` },
                                { name: '**Servidor**', value: `\`\`\`${servidor.toUpperCase()}\`\`\`` },
                                { name: '**Motivo**', value: `\`\`\`Ter menos do que 20 horas\`\`\`` }
                            );

                        try {
                            fetchUser.send({embeds: [demotedSendMSG]});
                        } catch (error) {}

                        let canal = guild.channels.cache.find((channel) => channel.id == '792576104681570324');

                        canal.send({embeds: [logDemoted]});

                        [result] = await con.query(
                            `SELECT * FROM vip_sets where server_id = (select vip_servers.id from vip_servers where vip_servers.server_name = '${servidor}')`
                        );
                        let setInfos = rows.map((item) => {
                            return `"${item.steamid}"  "@${item.cargo}" //${item.name}  ${
                                item.isVip == 1
                                    ? `(${item.date_create} - ${item.discord_id} - ${item.date_final})`
                                    : `(${item.discord_id})`
                            })`;
                        });

                        setInfos = setInfos.join('\n');

                        for (let j in serversInfosFound.identifier) {
                            try {
                                await fetch(
                                    `https://panel.mjsv.us/api/client/servers/${
                                        serversInfosFound.identifier[j]
                                    }/files/write?file=%2Fcsgo%2Faddons%2Fsourcemod%2Fconfigs%2Fadmins_simple.ini`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'text/plain',
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${panelApiKey.api}`,
                                        },
                                        body: setInfos,
                                    }
                                );
                            } catch (error) {
                                return (
                                    canalAwait.send({content:
                                            `${interaction.user} **| Não consegui remover o cargo do staff de dentro do servidor, entre em contato com o 1Mack**`
                                        })
                                        .then((m) => setTimeout(() => m.delete(), 10000)),
                                    console.log(error)
                                );
                            }

                            try {
                                fetch(
                                    `https://panel.mjsv.us/api/client/servers/${
                                        serversInfosFound.identifier[j]
                                    }/command`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${panelApiKey.api}`,
                                        },
                                        body: JSON.stringify({ command: 'sm_reloadadmins' }),
                                    }
                                );
                            } catch {}
                        }
                    }
                })
                .catch(() => {
                    return (
                        canalAwait.send({content: `${interaction.user} **| Você não respondeu a tempo....Deletando Canal**`}),
                        setTimeout(async function () {
                            canalAwait.delete();
                        }, 6000)
                    );
                });
        }

        await canalCheck.send({content: 'Todos os forms já foram lidos!'});
        setTimeout(async function () {
            canalCheck.delete();
        }, 6000);
    },
};
