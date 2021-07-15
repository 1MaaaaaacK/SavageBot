const Discord = require('discord.js');
module.exports = {
    name: 'guildMemberAdd',
    once: 'on',
    async execute(member, client) {
       /*  member.roles.add('808436147054706688');

        const embed = new Discord.MessageEmbed()
            .setColor('#00F180')
            .setAuthor(member.user.username, member.user.displayAvatarURL())
            .setTitle('***Novo Membro***')
            .addFields(
                { name: 'Discord', value: member.user, inline: true },
                {
                    name: 'Conta criada dia',
                    value: new Date(Number(member.user.createdTimestamp)).toLocaleDateString('en-GB'),
                    inline: true,
                },
                { name: 'Membro Número', value: member.guild.memberCount }
            )
            .setFooter(`ID: ${member.user.id}`)
            .setTimestamp();
        client.channels.cache.get('716023078374867036').send(embed); */
    },
};
