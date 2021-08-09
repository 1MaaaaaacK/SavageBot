const { connection } = require('../../configs/config_privateInfos');
const Discord = require('discord.js');

async function formFunction2(user, channel, client, resultForm1Check) {
    let result, serverescolhido;

    const con = connection.promise();

    async function DeleteRecords() {
        await con.query(`delete from form_respostas where discord_id = '${user.id}'`);
        await con.query(`delete from form_respostas_2Etapa where discord_id = '${user.id}'`);
    }

    let embed = new Discord.MessageEmbed()
        .setTitle('Segunda Etapa - Perguntas Gerais')
        .setColor('36393f')
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png');

    if (resultForm1Check !== undefined) {
        [result] = await con.query(
            `select * from form_messages_2Etapa where message_id > ${resultForm1Check.message_id} AND 
                servidor in (select server_choosen from form_respostas_2Etapa where server_choosen = "${resultForm1Check.server_choosen}")`
        );

        if (resultForm1Check.server_choosen == 'geral') {
            if (result == '') {
                return formFirstPart();
            }
        } else {
            return formSecondPart(result[0]);
        }
    } else {
        [result] = await con.query('select * from form_messages_2Etapa where servidor = "geral"');
    }

    for (let i in result) {
        await channel.bulkDelete(100);

        embed = embed.setDescription(`__Pergunta Número ${result[i].message_id}__

                > ***${result[i].message_question}***
                
                
                Você tem 3 minutos para responder a essa pergunta!`);

        channel.send(embed);

        const filter = (m) => m.author.bot == false && m.author == user;

        await channel
            .awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(async (collected) => {
                let values = [[`${user.id}`, result[i].message_id, collected.first().content, 'geral']];
                try {
                    await con.query(
                        `INSERT INTO form_respostas_2Etapa(discord_id, message_id, awnser, server_choosen) VALUES ?`,
                        [values]
                    );
                } catch (error) {
                    return (
                        channel.send(`${user} **| Houve um erro ao registrar sua resposta....Deletando Canal**`),
                        console.log(error),
                        setTimeout(async function () {
                            await DeleteRecords(), channel.delete();
                        }, 5000)
                    );
                }
            })
            .catch(() => {
                return (
                    channel.send(`${user} **| Você não respondeu a tempo....Deletando Canal**`),
                    setTimeout(async function () {
                        await DeleteRecords(), channel.delete();
                    }, 5000)
                );
            });
    }

    await formFirstPart();

    async function formFirstPart() {
        await channel.bulkDelete(100);
        embed = embed.setDescription(`> **Você quer virar staff de qual servidor?**

        <a:savage_1:839189109943042097> → JailBreak
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        <a:savage_2:839189111172628550> → Deathrun 
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        <a:savage_3:839189110165995570> → AWP
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        <a:savage_4:839189110630776863> → Retake
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        <a:savage_5:839189110480306186> → RetakePistol
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        <a:savage_6:839199778172043275> → Mix
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        <a:savage_7:839199778364457013> → Surf
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        <a:savage_8:839199778516500510> → Arena
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

        **Você tem 50 segundos para responder a essa pergunta!**
        `);
        channel.send(embed);
        const filter = (m) => m.content >= 1 && m.content <= 9 && m.author == user;
        await channel
            .awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(async (collected) => {
                switch (collected.first().content) {
                    case '1':
                        serverescolhido = 'jb';
                        break;
                    case '2':
                        serverescolhido = 'dr';
                        break;
                    case '3':
                        serverescolhido = 'awp';
                        break;
                    case '4':
                        serverescolhido = 'retake';
                        break;
                    case '5':
                        serverescolhido = 'retakepistol';
                        break;
                    case '6':
                        serverescolhido = 'mix';
                        break;
                    case '7':
                        serverescolhido = 'surf';
                        break;
                    case '8':
                        serverescolhido = 'arena';
                        break;
                    default:
                        break;
                }
            })
            .catch((err) => {
                return (
                    channel.send(
                        `${user} **| Voce não respondeu a tempo, abortando formulário <a:loading44:650850501742821395>!!!!\`**`
                    ),
                    setTimeout(async function () {
                        DeleteRecords(), channel.delete();
                    }, 5000)
                );
            });
        formSecondPart(serverescolhido);
    }
    async function formSecondPart(serverescolhido) {
        if (serverescolhido.message_id) {
            [result] = await con.query(
                `select * from form_messages_2Etapa where servidor = "${serverescolhido.servidor}" and message_id >= "${serverescolhido.message_id}"`
            );
        } else {
            [result] = await con.query(`select * from form_messages_2Etapa where servidor = "${serverescolhido}"`);
        }

        embed = embed.setTitle(`Segunda Etapa - Perguntas ${result[0].servidor.toUpperCase()}`);
        for (let i in result) {
            await channel.bulkDelete(10);

            embed = embed.setDescription(`__Pergunta Número ${10 + parseInt(i)}__
        
                        > ***${result[i].message_question}***
                        
                        
                        Você tem 3 minutos para responder a essa pergunta!`);

            await channel.send(embed);

            const filter = (m) => m.author.bot == false && m.author == user;
            await channel
                .awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                .then(async (collected) => {
                    let values = [
                        [
                            `${user.id}`,
                            result[i].message_id,
                            collected.first().content,
                            `${result[i].servidor}`,
                        ],
                    ];
                    try {
                        await con.query(
                            `INSERT INTO form_respostas_2Etapa(discord_id, message_id, awnser, server_choosen) VALUES ?`,
                            [values]
                        );
                    } catch (error) {
                        return (
                            channel.send(`${user} **| Você não respondeu a tempo....Deletando Canal**`),
                            setTimeout(async function () {
                                await DeleteRecords(), channel.delete();
                            }, 5000)
                        );
                    }
                })
                .catch(() => {
                    return (
                        channel.send(`${user} **| Você não respondeu a tempo....Deletando Canal**`),
                        setTimeout(async function () {
                            await DeleteRecords(), channel.delete();
                        }, 5000)
                    );
                });
        }
        await channel.bulkDelete(100);

        let guild = client.guilds.cache.get('792575394271592458');
        const canal = await guild.channels.cache.find(
            (channel) => channel.name == result[0].servidor && channel.parentID == '839343718016614411'
        );

        const logFormDone = new Discord.MessageEmbed()
            .setColor('36393f')
            .setTitle(`***${user.username}***`)
            .setDescription(
                `
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

        **DISCORD_ID:**  ${user.id}
        ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
        `
            )
            .setFooter('Formulário feito')
            .setTimestamp();

        canal.send(logFormDone);

        embed.setTitle(`***Formulário Preenchido com sucesso!***`);
        embed.setDescription(`
                > **Suas respostas foram computadas no meu sistema com sucesso!**
                > **O resultado sairá __dia 1__**
                > **Você será avisado no seu privado sobre o resultado!**`);
        await channel.send(embed);

        setTimeout(function () {
            channel.delete();
            connection.query(`DELETE FROM form_respostas WHERE discord_id ='${user.id}'`);
        }, 15000);
    }
}

module.exports = {
    formFunction2,
};
