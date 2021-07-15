const { HasAlreadyChannel, TicketStart, ChannelCreated, TicketServerOptions } = require('./embed');
const { Options } = require('./Options_Ticket');
const { serversInfos } = require('../../configs/config_geral');
exports.TicketCreate = async function (client, reaction, user) {
    const canalAwait = await client.channels.cache.find((m) => m.name === `ticket→${user.id}`);

    if (canalAwait) {
        return reaction.message.channel
            .send(HasAlreadyChannel(user, canalAwait))
            .then((m) => m.delete({ timeout: 8000 }));
    }
    let guild = client.guilds.cache.get('343532544559546368');

    await guild.channels
        .create(`ticket→${user.id}`, {
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
            parent: '729848799421530173',
        })
        .then(async (m) => {
            reaction.message.channel.send(ChannelCreated(user, m)).then((m) => m.delete({ timeout: 5000 }));
            m.send(`${user}`).then((m) => m.delete());
            await m.send(TicketStart(user));

            const filter = (m) =>
                (m.author == user && m.content === '1') ||
                m.content === '2' ||
                m.content === '3' ||
                m.content === '4' ||
                m.content === '5';

            await m
                .awaitMessages(filter, { max: 1, time: 45000, errors: ['time'] })
                .then(async (response) => {
                    await m.bulkDelete(10);
                    await m.send(TicketServerOptions(user));
                    const filter2 = (m) =>
                        (m.author == user && m.content === '1') ||
                        m.content === '2' ||
                        m.content === '3' ||
                        m.content === '4' ||
                        m.content === '5' ||
                        m.content === '6' ||
                        m.content === '7';

                    await m
                        .awaitMessages(filter2, { max: 1, time: 45000, errors: ['time'] })
                        .then(async (response2) => {
                            await m.bulkDelete(10);

                            const ServerFound = serversInfos.find((f) => f.serverNumber == response2.first().content);

                            const ticketOptions = Options[response.first().content];

                            const roles = {
                                servidor: ServerFound.name,
                                roleStaff: ServerFound.tagDoCargo,
                                roleGerente: ServerFound.gerenteRole,
                                roleStaffComprado: ServerFound.tagComprado,
                            };

                            ticketOptions(m, user, roles);
                        })
                        .catch((error) => {
                            return m.delete(), console.log(error);
                        });
                })
                .catch(() => {
                    return m.delete();
                });
        });
};
