const Discord = require('discord.js');

//Adv

function ADVsucesso(message){ 
  const embed = new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setDescription(`✅ <@${message.author.id}> **ADV** aplicada com sucesso !`)
  return embed
}
 
//Ban

function BANsucesso (message, nick, steamid){
  const embed = new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setDescription(`✅ ${message.author} O Player ${nick}, cuja Steamid é ${steamid} foi **banido** com sucesso !`)
    return embed
}

 module.exports = {
    ADVsucesso, BANsucesso
 }