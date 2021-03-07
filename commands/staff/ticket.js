module.exports.run = async (client, message, args) => {
    if (message.author.id !== '323281577956081665') return;
    message.delete({ timeout: 1000 });

    message.channel.send('Isso é apenas um teste').then(m => m.react('🐒'))

    client.on("messageReactionAdd", function(messageReaction, user){
       if(user.bot || messageReaction.message.channel.id !== '814295769699713047') return;

       messageReaction.message.reactions.cache.forEach(element => {
           element.users.remove()
       });
    });


};
exports.help = {
    name: 'ticket',
};
