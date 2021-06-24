const { functionCargos } = require('../handle/roles');
const { TicketCreate } = require('../handle/ticket/Create_Ticket');
const { Reactions } = require('../handle/ticket/Reactions_Ticket');
module.exports = {
    name: 'messageReactionAdd',
    once: 'on',
    async execute(reaction, user, client) {
        if (reaction.partial) {
            await reaction.fetch();
        }
        if (user.bot == true || reaction.message.author.bot == false) return;
        if (reaction.message.channel.id === '808452907245895722') {
            let reactionFunction = true;
            let membro = client.guilds.cache
                .get('343532544559546368')
                .members.cache.find((member) => member.id === user.id);

            const setCargos = functionCargos[reaction._emoji.name];

            setCargos(membro, reactionFunction);
        } else if (reaction.message.channel.id === '855200110685585419') {
            if (reaction._emoji.id == '856226635694342164')
                return TicketCreate(client, reaction, user), reaction.users.remove(user.id);
        } else if (reaction.message.channel.name.includes('ticket→')) {
            const setEmoji = await Reactions[reaction._emoji.id];
            if (setEmoji === undefined) return;
            await setEmoji(reaction, user, client);
        }
    },
};
