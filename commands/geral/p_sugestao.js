const { WrongChannel, SugestaoLog } = require('./embed');
module.exports = {
    name: 'sugestao',
    description: 'Sugerir algo para o servidor',
    options: [{name: 'sugestao', type: 3, description: 'Sua sugestão', required: true, choices: null}],
    default_permission: true,
    cooldown: 30,
    permissions: [],
    async execute(client, interaction) {

        if (interaction.channelId !== '710291543608655892')
            return (
                interaction.reply({content: 'Você só pode usar esse comando no <#710291543608655892>', ephemeral: true})
                )

         let sugestao = interaction.options.getString('sugestao')
                interaction.reply({content: '<a:right_savage:856211226300121098> **Sugestão enviada com sucesso!**'})
        client.channels.cache
            .get('778411417291980830')
            .send({embeds: [SugestaoLog(interaction, sugestao)]})
            .then(async (message) => {
                await message.react('778432828148023297')
                await message.react('778432818862227526')
            });

        client.channels.cache.get('770401787537522738').send(`${interaction.user} enviou uma sugestão!`); 
    },
};
