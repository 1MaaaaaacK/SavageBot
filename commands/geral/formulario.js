const Discord = require('discord.js');
const { formFunction } = require('../../handle/formFunction');
const { connection } = require('../../configs/config_privateInfos');
module.exports.run = async (client, message, args) => {
    message.delete({ timeout: 1000 });

    if (message.channel.id !== '839706805104803860')
        return (
            message.channel
                .send(
                    `😫 **|** ***<@${message.author.id}> Use o canal <#839706805104803860> para fazer o formulário!!***`
                )
                .then((m) => m.delete({ timeout: 5000 })),
            client.channels.cache
                .get('770401787537522738')
                .send(`${message.author} usou o comando !formulario fora do chat formulario!!`)
        );
    const canalFind = () => client.channels.cache.find((m) => m.name === `form→${message.author.id}`);
    let canalAwait = await canalFind();

    if (canalFind()) {
        return (
            message.channel
                .send(`😫 **|** ***<@${message.author.id}> Você já possui uma sala, <#${canalFind().id}>***`)
                .then((m) => m.delete({ timeout: 8000 })),
            formFunction(message, false, canalAwait, client)
        );
    }
    let conn = connection.promise();

     let [result] = await conn.query(`select discord_id from form_respostas_2Etapa where discord_id = '${message.author.id}'`);
     if(result == ''){
         result = false
     }else {
         result = true
     }
    if (result == true) {
        return message.channel
            .send(
                `${message.author} **| Você ja fez o formulário!! Caso voce não tenha feito, entre em contato com a administração**`
            )
            .then((m) => m.delete({ timeout: 10000 }));
    } 
    await message.guild.channels
        .create(`form→${message.author.id}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
            parent: '818261624317149235',
        })
        .then(async (m) => {
            const embed = new Discord.MessageEmbed()
                .setColor('36393f')
                .setTitle('Savage Servidores')
                .setDescription(
                    `Olá ${message.author},
            
            > Ficamos felizes em saber que você quer fazer parte da nossa staff 🥳
            > 
            > Antes de iniciarmos o formulário, sabia que você terá 1 minuto para responder a cada pergunta!
            > 
            > Se você falhar, poderá refazer o formuário!

            \`\`\`Para começar, digite iniciar\`\`\`\n<:blank:773345106525683753>`
                )
                .setThumbnail(
                    'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
                )
                .setFooter(
                    'Sistema de Formuário Exclusivo da Savage Servidores',
                    'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
                );

            await m.send(`${message.author}`);
            await m.send(embed);
        });
    message.channel
        .send(`${message.author} **| Sua sala foi criada! <#${canalFind().id}>**`)
        .then((m) => m.delete({ timeout: 5000 }));
    const filter = (m) => m.content.toLowerCase() === 'iniciar';

    canalAwait = await canalFind();

    await canalAwait
        .awaitMessages(filter, { max: 1, time: 45000, errors: ['time'] })
        .then(() => {
            formFunction(message, true, canalAwait, client);
        })
        .catch(() => {
            return canalAwait.delete();
        });
};

exports.help = {
    name: 'form',
};
