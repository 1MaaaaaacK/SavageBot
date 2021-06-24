const { formFunction } = require('./events/formFunction');
const { connection } = require('../../configs/config_privateInfos');
const { WrongChannel, HasAlreadyChannel, HasAlreadyDoneForm, FormStart, ChannelCreated } = require('./embed');
module.exports = {
    name: 'formulario',
    description: 'Realizar formulário para virar staff',
    usage: '',
    cooldown: 30,
    permissions: false, 
    args: 0,
    async execute(client, message, args) {
        if (message.channel.id !== '839706805104803860')
            return (
                message.channel.send(WrongChannel(message)).then((m) => m.delete({ timeout: 5000 }).catch(() => {})),
                client.channels.cache
                    .get('770401787537522738')
                    .send(`${message.author} usou o comando !formulario fora do chat formulario!!`)
            );
        const canalFind = () => client.channels.cache.find((m) => m.name === `form→${message.author.id}`);
        let canalAwait = await canalFind();

        if (canalAwait) {
            return (
                message.channel
                    .send(HasAlreadyChannel(message, canalAwait))
                    .then((m) => m.delete({ timeout: 8000 }).catch(() => {})),
                formFunction(message, false, canalAwait, client)
            );
        }
        let conn = connection.promise();

        let [result] = await conn.query(
            `select discord_id from form_respostas_2Etapa where discord_id = '${message.author.id}'`
        );
        if (result == '') {
            result = false;
        } else {
            result = true;
        }
        if (result == true) {
            return message.channel
                .send(HasAlreadyDoneForm(message))
                .then((m) => m.delete({ timeout: 10000 }).catch(() => {}));
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
                parent: '841003382521069590',
            })
            .then(async (m) => {
                await m.send(`${message.author}`);
                await m.send(FormStart(message));
            });
        canalAwait = await canalFind();

        message.channel
            .send(ChannelCreated(message, canalAwait))
            .then((m) => m.delete({ timeout: 5000 }).catch(() => {}));
        const filter = (m) => m.content.toLowerCase() === 'iniciar';

        await canalAwait
            .awaitMessages(filter, { max: 1, time: 45000, errors: ['time'] })
            .then(() => {
                formFunction(message, true, canalAwait, client);
            })
            .catch(() => {
                return canalAwait.delete().catch(() => {});
            });
    },
};
