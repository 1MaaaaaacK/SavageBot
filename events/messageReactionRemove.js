const { functionCargos } = require('../handle/extras/roles');
module.exports = {
    name: 'messageReactionRemove',
    once: 'on',
    async execute(reaction, user, client) {
     /*    if (reaction.partial) {
            await reaction.fetch();
        }
        if (user.bot == true || reaction.message.channel.id !== '808452907245895722') return;

        let reactionFunction = false;
        let membro = client.guilds.cache
            .get('343532544559546368')
            .members.cache.find((member) => member.id === user.id);

        const setCargos = functionCargos[reaction._emoji.name];

        setCargos(membro, reactionFunction); */
    },
};
