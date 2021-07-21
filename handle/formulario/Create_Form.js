const { formFunction } = require('./formFunction');
const { connection } = require('../../configs/config_privateInfos');
const { HasAlreadyChannel, HasAlreadyDoneForm, FormStart, ChannelCreated } = require('./embed');
exports.FormCreate = async function (client, reaction, user) {
    const canalFind = () => client.channels.cache.find((m) => m.name === `form→${user.id}`);

    if (canalFind()) {
        return (
            reaction.message.channel
                .send(HasAlreadyChannel(user, canalFind()))
                .then((m) => m.delete({ timeout: 8000 })),
            formFunction(user, false, canalFind(), client)
        );
    }
    let conn = connection.promise();

    let [result] = await conn.query(`select discord_id from form_respostas_2Etapa where discord_id = '${user.id}'`);
    if (result == '') {
        result = false;
    } else {
        result = true;
    }
    if (result == true) {
        return reaction.message.channel.send(HasAlreadyDoneForm(user)).then((m) => m.delete({ timeout: 10000 }));
    }

    const guild = client.guilds.cache.get('343532544559546368');

    await guild.channels
        .create(`form→${user.id}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
            parent: '865016939126849567',
        })
        .then(async (channel) => {
            await channel.send(`${user}`);
            let firstMessage = await channel.send(FormStart(user));
            await firstMessage.react('<a:right_savage:856211226300121098>');

            reaction.message.channel.send(ChannelCreated(user, channel)).then((m) => m.delete({ timeout: 5000 }));

            const filter = (reaction) => {
                return reaction._emoji.id == '856211226300121098';
            };

            await firstMessage
                .awaitReactions(filter, { max: 1, time: 45000, errors: ['time'] })
                .then(() => {
                    formFunction(user, true, channel, client);
                })
                .catch(() => {
                    return channel.delete();
                });
        });
};
