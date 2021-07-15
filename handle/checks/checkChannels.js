const Discord = require('discord.js');
const { query } = require('gamedig');
const { serversInfos } = require('../../configs/config_geral');
const { webhookVipExpirado, webhookIpServidores } = require('../../configs/config_webhook');
async function checkChannels(message, client) {
    if (message.channel.id === '795494831291891774') {
        if (message.webhookID !== webhookVipExpirado.id) return;

        message.embeds.forEach(async (embed) => {
            let usuarioInfo = {
                id: embed.title,
                info: embed.fields[1].value,
                servidor: embed.fields[0].value,
                codigo: embed.fields[2].value,
            };
            let guild = client.guilds.cache.get('792575394271592458');
            const canal = guild.channels.cache.find((channel) => channel.id === '795504520876130306');

            await client.guilds.cache
                .get('343532544559546368')
                .channels.cache.find((channel) => channel.id === '710288627103563837')
                .send(`<@${usuarioInfo.id}>`)
                .then((m) => m.delete({ timeout: 1000 }));
            let fechedUserBool = true;
            try {
                var fetchUser = await client.users.fetch(usuarioInfo.id);
            } catch (error) {
                return (
                    canal.send(
                        `**Não achei o discord do player <@${usuarioInfo.id}>, mas eu já removi ele do admins_simple.**`
                    ),
                    console.log(error)
                );
            } finally {
                try {
                    var fetchedUser = await client.guilds.cache.get('343532544559546368').members.fetch(fetchUser);
                } catch (error) {
                    fechedUserBool = false;
                }
            }

            const embedVipExpirado = new Discord.MessageEmbed()
                .setColor('#0066FF')
                .setTitle(`Olá ${fetchUser.username}`)
                .setDescription(
                    `> O tempo do seu cargo comprado acabou 😿
> Mas não fique triste, tenho uma ótima notícia para você!
> Estou te dando um **código promocional de 15% de desconto** para renovação do seu plano 😍`
                )
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Seu Código', value: usuarioInfo.codigo },
                    {
                        name: 'Como faço para resgatar?',
                        value: `Basta ir no canal: <#757707472663216140>, após isso abra um ticket e escreva a seguinte mensagem:

  \`\`\`fix\nQuero renovar meu plano com o código ${usuarioInfo.codigo}\`\`\``,
                        inline: false,
                    },
                    {
                        name: 'Regras',
                        value: `\`\`\`md\n# O código é único e exclusivo seu, ou seja, não pode ser transferido!\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n# Você tem 1 semana, à partir da data de hoje, para resgata-lo\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n# Qualquer dúvida não hesite em perguntar, estamos a sua disposição\`\`\``,
                        inline: false,
                    }
                )
                .setImage('https://cdn.discordapp.com/attachments/719223540783775804/730203351521689660/savage.png');

            try {
                await fetchedUser.send(embedVipExpirado);
            } catch (error) {
                console.log(error);
            }

            if (fechedUserBool == false) return;

            if (usuarioInfo.info.includes('@vip')) {
                let cont = 0;

                for (let x = 0; x < serversInfos.length; x++) {
                    for (let i in fetchedUser._roles) {
                        if (fetchedUser._roles[i] == serversInfos[x].tagVip) {
                            cont = cont + 1;
                        }
                    }
                }
                const serversInfosFound = serversInfos.find((m) => m.name === usuarioInfo.servidor);

                if (cont > 1) {
                    await fetchedUser.roles.remove(serversInfosFound.tagVip);
                    canal.send(`**Vip Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso`);
                } else {
                    fetchedUser.roles.remove([serversInfosFound.tagVip, '753728995849142364']);
                    canal.send(`**Vip Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso`);
                }
            } else {
                const serversInfosFound = serversInfos.find((m) => m.name === usuarioInfo.servidor);

                if (serversInfosFound == undefined)
                    return canal.send(
                        `😫 **| Não achei o servidor o qual o <@${usuarioInfo.id}> expirou o cargo comprado**`
                    );

                let cont = 0;

                for (let x = 0; x < serversInfos.length; x++) {
                    for (let i in fetchedUser._roles) {
                        if (fetchedUser._roles[i] == serversInfos[x].tagDoCargo) {
                            cont = cont + 1;
                        } else if (fetchedUser._roles[i] == serversInfos[x].tagComprado) {
                            cont = cont + 1;
                        }
                    }
                }

                if (cont > 1) {
                    await fetchedUser.roles.remove(serversInfosFound.tagComprado);
                    canal.send(`**Staff Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso`);
                } else {
                    fetchedUser.roles.remove([serversInfosFound.tagComprado, '722814929056563260']);
                    canal.send(`**Staff Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso`);

                    if (fetchedUser.nickname != null) {
                        fetchedUser.setNickname(fetchedUser.nickname.substr(9)).catch((error) => {
                            canal.send(
                                `**<@${message.author.id}> | Não consegui renomear o player, tente fazer isso manualmente!**`
                            );
                            console.log(error);
                        });
                    }
                }
            }
        });
    } else if (message.channel.id === '717331699125714986') {
        if (!message.content.includes('Reloading Infos <a:savage_loading:837104765338910730>')) return;

        await message.channel.bulkDelete(100);
        let once = true;
        let msg1,
            msg2,
            Catch = [];

        setInterval(async function () {
            const servers = [
                (jailbreak = {
                    host: '131.196.196.197',
                    port: '27170',
                }),
                (deathrun = {
                    host: '131.196.196.197',
                    port: '27080',
                }),
                (awp = {
                    host: '131.196.196.197',
                    port: '27090',
                }),
                (retake = {
                    host: '131.196.196.197',
                    port: '27130',
                }),
                (retakepistol = {
                    host: '131.196.196.197',
                    port: '27150',
                }),
                (mix4fun = {
                    host: '131.196.196.197',
                    port: '27190',
                }),
                (surf = {
                    host: '131.196.196.197',
                    port: '27110',
                }),
            ];

            for (let i in servers) {
                query({
                    type: 'csgo',
                    host: servers[i].host,
                    port: servers[i].port,
                })
                    .then((state) => {
                        Catch[i] = {
                            name: state.name,
                            mapa: state.map,
                            players: state.raw.numplayers,
                            playersTotal: state.maxplayers,
                            ip: state.connect,
                        };
                    })
                    .catch((error) => {
                        Catch[i] = { name: 'off', mapa: 'off', players: 0, playersTotal: 0, ip: 'off' };
                    });
            }
            if (Catch == '') return;

            const EmbedImg = new Discord.MessageEmbed()
                .setColor('#5F40C1')
                .setImage('https://cdn.discordapp.com/attachments/719223540783775804/730203351521689660/savage.png');

            let Embed = new Discord.MessageEmbed().setColor('#5F40C1');
            let Embed2 = new Discord.MessageEmbed()
                .setColor('#5F40C1')
                .setTimestamp()
                .setFooter('A lista atualizada a cada 5 minutos');

            let contPlayers = 0,
                contPlayersTotal = 0;

            for (let i in Catch) {
                if (i < 5) {
                    if (Catch[i].playersTotal !== undefined) {
                        contPlayers += Catch[i].players;
                        contPlayersTotal += Catch[i].playersTotal;
                    }
                    Embed = Embed.addFields(
                        {
                            name: `<a:diamante:650792674248359936> **${Catch[i].name}** <a:diamante:650792674248359936>`,
                            value: '\u200B',
                        },
                        { name: '**Mapa**', value: Catch[i].mapa, inline: true },
                        { name: '**Players**', value: `${Catch[i].players}/${Catch[i].playersTotal}`, inline: true },
                        {
                            name: '**Conexao Direta**',
                            value: 'steam://connect/' + Catch[i].ip,
                            inline: true,
                        },
                        { name: `\u200B`, value: '\u200B' }
                    );
                } else if (i >= 5 && i < 10) {
                    if (Catch[i].playersTotal !== undefined) {
                        contPlayers += Catch[i].players;
                        contPlayersTotal += Catch[i].playersTotal;
                    }
                    Embed2 = Embed2.addFields(
                        {
                            name: `<a:diamante:650792674248359936> **${Catch[i].name}** <a:diamante:650792674248359936>`,
                            value: '\u200B',
                        },
                        { name: '**Mapa**', value: Catch[i].mapa, inline: true },
                        { name: '**Players**', value: `${Catch[i].players}/${Catch[i].playersTotal}`, inline: true },
                        {
                            name: '**Conexao Direta**',
                            value: 'steam://connect/' + Catch[i].ip,
                            inline: true,
                        },
                        { name: `\u200B`, value: '\u200B' }
                    );
                }
            }
            
            if (once) {
                once = false;
                await message.channel.send(EmbedImg);
                msg1 = await message.channel.send(Embed);
                msg2 = await message.channel.send(Embed2);
            } else {
                msg1.edit(Embed);
                msg2.edit(Embed2);
            }

            let Embed4 = new Discord.MessageEmbed()
                .setColor('#5F40C1')
                .setTitle('Players Online')
                .setTimestamp()
                .setDescription(`\`\`\`${contPlayers}/${contPlayersTotal}\`\`\``);

            await client.channels.cache.get('825124273655250984').send(Embed4);
        }, 5000);
    }
}

module.exports = {
    checkChannels,
};
