const Discord = require('discord.js');
const { serversInfos } = require('../../configs/config_geral');
const { webhookVipExpirado, webhookIpServidores } = require('../../configs/config_webhook');

async function checkChannels(message, client) {
    if (message.channel.id === '795494831291891774') {
        if (message.webhookId !== webhookVipExpirado.id) return;

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
                .send({content: `<@${usuarioInfo.id}>`})
                .then((m) => m.delete());
            let fechedUserBool = true;
            try {
                var fetchUser = await client.users.fetch(usuarioInfo.id);
            } catch (error) {
                return (
                    canal.send({content: 
                        `**Não achei o discord do player <@${usuarioInfo.id}>, mas eu já removi ele do admins_simple.**`
                    }),
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
                    { name: 'Seu Código', value: usuarioInfo.codigo.toString() },
                    {
                        name: 'Como faço para resgatar?',
                        value: `Basta ir no canal: <#855200110685585419>, após isso abra um ticket e escreva a seguinte mensagem:

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
                await fetchedUser.send({embeds: [embedVipExpirado]});
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
                    canal.send({content: `**Vip Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso`});
                } else {
                    fetchedUser.roles.remove([serversInfosFound.tagVip, '753728995849142364']);
                    canal.send({content: `**Vip Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso`});
                }
            } else {
                const serversInfosFound = serversInfos.find((m) => m.name === usuarioInfo.servidor);

                if (serversInfosFound == undefined)
                    return canal.send({content: 
                        `😫 **| Não achei o servidor o qual o <@${usuarioInfo.id}> expirou o cargo comprado**`
                    });

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
                    canal.send({content: `**Staff Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso`});
                } else {
                    fetchedUser.roles.remove([serversInfosFound.tagComprado, '722814929056563260']);
                    canal.send({content: `**Staff Expirado |** Removi a tag do <@${usuarioInfo.id}> com sucesso`});

                    if (fetchedUser.nickname != null) {
                        fetchedUser.setNickname(fetchedUser.nickname.substr(9)).catch((error) => {
                            canal.send({content: 
                                `**<@${message.author.id}> | Não consegui renomear o player, tente fazer isso manualmente!**`
                            });
                            console.log(error);
                        });
                    }
                }
            }
        });
    } else if (message.channel.id === '717331699125714986') {
        if (message.webhookId !== webhookIpServidores.id) return;
        message.channel.messages.fetch().then((m) => {
            let msgs = m.map((array) => array.id);
            msgs.shift();
            message.channel.bulkDelete(msgs);
        });
    }
}

module.exports = {
    checkChannels,
};
