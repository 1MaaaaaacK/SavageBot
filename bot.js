const Discord = require('discord.js');
const client = new Discord.Client();
const { botConfig } = require('./configs/config_privateInfos');
const { webhookVipExpirado, webhookIpServidores } = require('./configs/config_webhook');
const { serversInfos } = require('./configs/config_geral');
/* const { checagem } = require('./handle/check.js');
const { mapUpdate } = require('./handle/map'); */

client.on('ready', () => {
    console.log('Conectado como ' + client.user.tag);
    ('use strict');

    const extIP = require('external-ip');

    let getIP = extIP({
        replace: true,
        services: ['https://ipinfo.io/ip', 'http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
        timeout: 600,
        getIP: 'parallel',
        userAgent: 'Chrome 15.0.874 / Mac OS X 10.8.1',
    });

    getIP((err, ip) => {
        if (err) {
            throw err;
        }
        console.log(ip);
    });

    client.user.setActivity('Savage Servidores');
});

client.on('message', async (message) => {
    if (message.author.bot) return;

    if (message.channel.id === '778411417291980830') {
        if (!message.content.includes('!sugestao')) {
            return (
                message.delete({ timeout: 1000 }),
                message.channel
                    .send(`<@${message.author.id}> **Use o comando !sugestao Sua sugestao**`)
                    .then((m) => m.delete({ timeout: 10000 })),
                client.channels.cache
                    .get('770401787537522738')
                    .send(`O <@${message.author.id}> escreveu no canal sugestao e nao usou o comando certo!!!`)
            );
        }
    }

    if (!message.content.startsWith(botConfig.prefix)) return;

    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0];
    command = command.slice(botConfig.prefix.length);

    let pasta;
    if (command == 'comandos' || command == 'sugestao') {
        pasta = 'geral';
    } else {
        pasta = 'staff';
    }

    try {
        let commandFile = require(`./commands/${pasta}/${command}.js`, ``);

        delete require.cache[require.resolve(`./commands/${pasta}/${command}.js`)];

        return commandFile.run(client, message, args);
    } catch (err) {}
});

client.on('message', async (message) => {
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

            if (usuarioInfo.info.includes('@Vip')) {
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
                        if (fetchedUser._roles[i] == serversInfos[x].tagComprado) {
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
        if (message.webhookID !== webhookIpServidores.id) return;
        message.channel.messages.fetch().then((m) => {
            let msgs = m.map((array) => array.id);
            msgs.shift();
            message.channel.bulkDelete(msgs);
        });
    } else return;
});

/* setInterval(function () { checagem() }, 86400000);
setInterval(function () { mapUpdate() }, 300000);  */

/* client.on('guildMemberUpdate', (oldRole, newRole) => {
    const boostOld = oldRole.roles.cache.find((role) => role.id == '649398805040594946');
    const boostNew = newRole.roles.cache.find((role) => role.id == '649398805040594946');

    if(!boostOld && boostNew){

    }
    if(boostOld && !boostNew){
      
    }
}); */

client.login(botConfig.token);
