const Discord = require('discord.js');
module.exports = {
    name: 'guildMemberRemove',
    once: 'on',
    async execute(member) {
        let data = Date.now();
        console.log(data);
        console.log(member.joinedTimestamp)
        console.log(data - member.joinedTimestamp)

        function HourFormat(duration) {
            let hrs = ~~(duration / 3600);
            let mins = ~~((duration % 3600) / 60);
            let secs = ~~(duration / 1000);
            //return mins == 0 ? `${hrs} horas` : `${hrs} horas e ${mins} minutos`;
        }
        /* data = data - member.guild.joinedTimestamp;
        data = new Date(data).toLocaleDateString('en-GB');
        console.log(data) */
    },
};
