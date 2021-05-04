const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('831219575588388915')) return;

    message.delete({ timeout: 1000 });
     let splitarg = args.join(' ').split(' - ');

     let color = String(splitarg[0]),
        title =  String(splitarg[1]),
        description =  String(splitarg[2]),
        image =  String(splitarg[3]),
        footer =  String(splitarg[4]),
        timestamp =  String(splitarg[5])
 

      if (!color || !title || !description)
        return message.channel.send(`${message.author} **| O modo correto de usar o comando é: !embed cor - titulo - descrição - imagem - rodapé - timestamp**
        
        ***OBS: Somente a cor, o titulo e a descrição são obrigatórios!***
        
        ***EXEMPLO COMPLETO***
        
        \`\`\`!embed 115490 - Teste - Aqui voce pode falar o que bem entender! - https://cdn.discordapp.com/attachments/751428595536363610/832988382819778570/savage.png - Aqui eh o que vai no rodape - sim\`\`\`
        ***EXEMPLO Facil***
        \`\`\`!embed 115490 - Seu Titulo - Esse eh um exemplo mais facil de entender\`\`\`
        `)
        .then((m) => m.delete({ timeout: 20000 })); 

        if(title == 'null' && description == 'null' && image == 'null'){
            return message.channel.send(`${message.author} | Voce não pode por o titulo, a descriçao e a imagem como 'null' todos ao mesmo tempo!`)
            .then((m) => m.delete({ timeout: 15000 })); 
        }
   const embed= new Discord.MessageEmbed()
    .setColor(`#${color}`)
  
    if(title !== 'null'){
        embed.setTitle(title)
    }
    if(description !== 'null'){
        embed.setDescription(description)
    }
    if(image.includes('http') || image.includes('https')) {
      
       embed.setImage(image)
    } 
    if(footer !== 'undefined'){
        embed.setFooter(footer)
    }
    if(timestamp.toLowerCase() === 'sim'){
        embed.setTimestamp()
    }
    try {
   message.channel.send(embed)
        
    } catch (error) {
        return message.channel.send(`${message.author} **| Voce escreveu algo errado, o modo certo é: !embed cor - titulo - descrição - imagem - rodapé - timestamp`)
    }
};

exports.help = {
    name: 'embeds',
};
