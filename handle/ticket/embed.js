const Discord = require('discord.js');

exports.HasAlreadyChannel = function (user, canalAwait) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setDescription(
            `<a:warning_savage:856210165338603531> ${user}, você já possui uma sala, <#${canalAwait.id}> !`
        );
    return embed;
};

exports.TicketStart = function (user) {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setTitle('Savage Servidores')
        .setDescription(
            `Olá ${user},
            
            > Bem vindo ao nosso suporte <a:engrenagem_savage:856206695587250186>
            > 
            > Escolha qual tipo de ticket você quer abrir **(Digite o número no chat)**
            

            <a:savage_1:839189109943042097> Bugs
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_2:839189111172628550>  Denúncia
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_3:839189110165995570>  Banimento
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_4:839189110630776863>  Compra de Cargo
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_5:839189110480306186>  Dúvidas
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
            
            `
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
        .setFooter(
            'Sistema de Ticket Exclusivo da Savage Servidores',
            'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
        );
    return embed;
};

exports.ChannelCreated = function (user, m) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setDescription(`<a:right_savage:856211226300121098> ${user}, sua sala já foi criada, <#${m.id}> !`);
    return embed;
};

exports.TicketServerOptions = function (user) {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setTitle('Savage Servidores')
        .setDescription(
            `${user},
            
            > Escolha para qual servidor você deseja que o ticket seja aberto
            > 
            > **(Digite o número no chat)**
            

            <a:savage_1:839189109943042097> → JailBreak
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_2:839189111172628550> → Deathrun 
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_3:839189110165995570> → AWP
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_4:839189110630776863> → Mix
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_5:839189110480306186> → RetakePistol
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            <a:savage_6:839199778172043275> → Retake
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
            
            <a:savage_7:839199778364457013> → Surf
            ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
           
            `
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
        .setFooter(
            'Sistema de Ticket Exclusivo da Savage Servidores',
            'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
        );
    return embed;
};

exports.TicketTypeChoosed = function (user, type, servidor) {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setTitle(`***Ticket de ${type}***`)
        .setDescription(
            `${user},
            
            **Enquanto a equipe de administração não te responde, nos diga o que você deseja.**

            >  Servidor Escolhido: **${servidor.toUpperCase()}**
            > 
            > Para fechar o Ticket, reaja com <:lock_savage:856224681136226314>
            `
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
        .setFooter(
            'Sistema de Ticket Exclusivo da Savage Servidores',
            'https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png'
        );
    return embed;
};

exports.TicketClosed = function (user) {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setTitle(`***Ticket Fechado***`)
        .setDescription(
            `
            > <:unlock_savage:856225547210326046> ➜ Para Reabrir o Ticket
            > ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            > <:save_savage:856212830969659412> ➜ Para Salvar o Ticket
            > ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

            > <:delete_savage:856222528997556244> ➜ Para Deletar o Ticket
            > ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂
            `
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/823663459145089055/834833230452621322/1619110021129.png')
        .setFooter(`Ticket fechado pelo ${user.username}`);
    return embed;
};

exports.TicketOpened = function (user) {
    const embed = new Discord.MessageEmbed().setColor('36393f').setDescription(`***Ticket aberto pelo ${user}***`);
    return embed;
};

exports.TicketSaved = function (user) {
    const embed = new Discord.MessageEmbed().setColor('36393f').setDescription(`***Ticket salvo pelo ${user}***`);
    return embed;
};

exports.TicketDeleting = function () {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setDescription(`***Deletando Ticket em 5 segundos   <a:savage_loading:837104765338910730>***`);
    return embed;
};

exports.TicketLog = function (user, action, channel) {
    const embed = new Discord.MessageEmbed()
        .setColor('36393f')
        .setAuthor(user.username, user.displayAvatarURL())
        .addFields(
            { name: 'Discord', value: user },
            { name: 'Ação', value: action },
            { name: 'Ticket', value: channel }
        );
    return embed;
};
