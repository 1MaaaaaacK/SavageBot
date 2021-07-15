const { TicketClosed, TicketOpened, TicketDeleting, TicketSaved, TicketLog } = require('./embed');
const { Save } = require('./Save_Ticket');
const Reactions = {
    '856224681136226314'(reaction, user, client) {
        //lock
        reaction.message.reactions.removeAll();
        reaction.message.channel.send(TicketClosed(user)).then(async (m) => {
            await m.react('<:unlock_savage:856225547210326046>');
            await m.react('<:save_savage:856212830969659412>');
            await m.react('<:delete_savage:856222528997556244>');
        });
        reaction.message.channel.updateOverwrite(reaction.message.channel.name.replace('ticket→', ''), {
            VIEW_CHANNEL: false,
        });
        reaction.message.channel.setName(`fechado→${user.id}`);
        client.channels.cache.get('757709253766283294').send(TicketLog(user, 'Fechado', reaction.message.channel.name));
    },
    '856225547210326046'(reaction, user, client) {
        //unlock
        let userFind = reaction.message.guild.members.cache.find((m) => m.id == user.id);

        if (userFind._roles.filter((m) => m == '722814929056563260' || m == '603318536798077030') == '') return;
        reaction.message.channel.updateOverwrite(reaction.message.channel.name.replace('ticket→', ''), {
            VIEW_CHANNEL: true,
        });
        reaction.message.reactions.removeAll();
        reaction.message.channel.send(TicketOpened(user)).then((m) => m.react('<:lock_savage:856224681136226314>'));
        reaction.message.channel.setName(`ticket→${user.id}`);
        client.channels.cache.get('757709253766283294').send(TicketLog(user, 'Aberto', reaction.message.channel.name));
    },
    '856212830969659412'(reaction, user, client) {
        //save
        let userFind = reaction.message.guild.members.cache.find((m) => m.id == user.id);

        if (userFind._roles.filter((m) => m == '711022747081506826' || m == '603318536798077030') == '') return;
        try {
            reaction.message.reactions.cache.get('856225547210326046').remove();
            reaction.message.reactions.cache.get('856212830969659412').remove();
        } catch (error) {}

        Save(user, reaction.message, client);
        reaction.message.channel.send(TicketSaved(user));
        client.channels.cache.get('757709253766283294').send(TicketLog(user, 'Salvo', reaction.message.channel.name));
    },
    '856222528997556244'(reaction, user, client) {
        //delete
        if (user.id !== '323281577956081665') return; //Mack
        reaction.message.channel.send(TicketDeleting(user));
        reaction.message.channel.setName(`deletando→${user.id}`);
        setTimeout(() => {
            reaction.message.channel.delete();
        }, 5000);
        client.channels.cache
            .get('757709253766283294')
            .send(TicketLog(user, 'Deletado', reaction.message.channel.name));
    },
};

module.exports = {
    Reactions,
};
