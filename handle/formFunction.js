const { connection } = require('../configs/config_privateInfos');
const Discord = require('discord.js');
const { formFunction2 } = require('./formFunction2');

async function formFunction(message, bool, canalAwait, client) {
    let result, resultFalseCheck;
    const con = connection.promise();

    let embed = new Discord.MessageEmbed()
        .setTitle('Savage Servidores')
        .setColor('36393f')
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png');

    if (bool == false) {
        [result] = await con.query(
            `select discord_id, MAX(message_id) as message_id from form_respostas where discord_id = "${message.author.id}"`
        );

        //Adicionar função de mandar msg alertando o player e remover o canal

        if (result[0].message_id == null) {
            return (
                await canalAwait
                    .send(
                        `${message.author} **| Como você ainda não começou o form, esse canal será deletado!**\n**Dentro de 15 segundos eu irei excluir essa sala, após isso você poderá abrir outro form!!**`
                    )
                    .then((m) => m.delete({ timeout: 15000 })),
                canalAwait.delete()
            );
        }
        [resultFalseCheck] = await con.query(
            `select * from form_messages where message_id = ${result[0].message_id + 1}`
        );
        canalAwait.send(`${message.author}`);

        if (resultFalseCheck == '') {
            return formResult(true);
        }
    }

    [result] = await con.query(
        `select * from ${
            resultFalseCheck !== undefined
                ? `form_messages where message_id >= '${resultFalseCheck[0].message_id}'`
                : 'form_messages'
        }`
    );

    for (let i in result) {
        await canalAwait.messages.fetch();

        await canalAwait.bulkDelete(100);

        embed = embed.setDescription(`__Pergunta Número ${result[i].message_id}__

                > ***${result[i].message_question}***

                <a:savage_1:839189109943042097> ${result[i].option_1}
                ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

                <a:savage_2:839189111172628550>  ${result[i].option_2}
                ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

                <a:savage_3:839189110165995570>  ${result[i].option_3}
                ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

                <a:savage_4:839189110630776863>  ${result[i].option_4}
                
                
                Você tem 1 minuto para responder a essa pergunta!`);

        canalAwait.send(embed);

        const filter = (m) =>
            (m.author == message.author && m.content === '1') ||
            m.content === '2' ||
            m.content === '3' ||
            m.content === '4';

        await canalAwait
            .awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
            .then(async (collected) => {
                let values = [
                    [
                        `${message.author.id}`,
                        result[i].message_id,
                        result[i].message_right_option == collected.first().content ? 1 : 0,
                    ],
                ];

                try {
                    await con.query(`INSERT INTO form_respostas(discord_id, message_id, message_rightOrNot) VALUES ?`, [
                        values,
                    ]);
                } catch (error) {
                    return (
                        canalAwait.send(
                            `${message.author} **| Não consegui registrar essa resposta, tente responder de novo!\n\`Lembre-se, apenas responda números, como 1, 2, 3 ou 4!!!\`**`
                        ),
                        setTimeout(async function () {
                            con.query(`delete from form_respostas where discord_id = '${message.author.id}'`),
                                canalAwait.delete({ timeout: 5000 }),
                                console.log(error);
                        }, 6000)
                    );
                }
            })

            .catch(() => {
                return (
                    canalAwait.send(`${message.author} **| Você não respondeu a tempo....Deletando Canal**`),
                    setTimeout(async function () {
                        await con.query(`delete from form_respostas where discord_id = '${message.author.id}'`),
                            canalAwait.delete();
                    }, 6000)
                );
            });
    }
    //}

    async function formResult(bool) {
        await canalAwait.bulkDelete(100);
        if (bool) {
            [result] = await con.query(
                `select discord_id, server_choosen, MAX(message_id) as message_id from form_respostas_2Etapa where discord_id = "${message.author.id}" 
                group by message_id order by message_id DESC limit 1;`
            );
            if (result !== '') {
                result = result[0];
                return formFunction2(message, canalAwait, client, result);
            }
        }
        let embed2 = embed.setDescription(`> **Seu formulário foi registrado com sucesso** 😎
            > 
            > **⚠️ Aguarde enquanto eu checo se você passou para a próxima fase**`);

        await canalAwait.send(embed2).then((m) => m.delete({ timeout: 7000 }));
        [result] = await con.query(
            `select count(discord_id) as Total, sum(message_rightOrNot) as Acertadas, avg(message_rightOrNot) as Porcentagem from form_respostas 
            where discord_id = '${message.author.id}'`
        );

        embed2 = new Discord.MessageEmbed()
            .setThumbnail(
                'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
            )
            .setFooter(
                'Sistema de Formuário Exclusivo da Savage Servidores',
                'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
            );

        canalAwait.bulkDelete(100);
        if (result[0].Porcentagem > 0.7) {
            embed2 = embed2.setColor('229D2D');
            embed2 = embed2.setTitle('Aprovado');
            embed2 = embed2.setDescription(`Parabéns ${message.author}

                        > Você foi **aprovado para a segunda etapa do formulário**
                        > Você acertou **${result[0].Acertadas}/${
                result[0].Total
            }** perguntas, com uma eficiência de **${(result[0].Porcentagem * 100).toFixed()}%**
                        > 
                        > A segunda etapa começará dentro de **15 segundos**, aguarde...`);
            await canalAwait.send(embed2).then((m) => m.delete({ timeout: 15000 }));
            formFunction2(message, canalAwait, client);
        } else {
            embed2 = embed2.setColor('B30B0B');
            embed2 = embed2.setTitle('Reprovado');
            embed2 = embed2.setDescription(`Que pena ${message.author}

                        > Você foi reprovado!
                        > Você acertou **${result[0].Acertadas}/${
                result[0].Total
            }** perguntas, com uma eficiência de **${(
                result[0].Porcentagem * 100
            ).toFixed()}%**, sendo que o mínimo para passar era **70%**
                        > Você poderá fazer o formulário novamente daqui 1 semana`);
            canalAwait.send(embed2);
            setTimeout(function () {
                canalAwait.delete();
                connection.query(`DELETE FROM form_respostas WHERE discord_id ='${message.author.id}'`);
            }, 15000);
        }
    }
    formResult();
}

module.exports = {
    formFunction,
};
