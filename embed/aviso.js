const Discord = require('discord.js');


//Adv

function ADVaviso (message, usuarioId){ 
  const embed = new Discord.MessageEmbed()
    .setColor("#ffff00")
    .setDescription(`:warning: <@${message.author.id}> o staff <@${usuarioId}> levou as **3 ADV's** \n\`\`\` Você decide se ele será demotado !\`\`\``)
  return embed
}
 
//Demotar

function DEMOTARsteamID (message, playerLength){ 
  const embed = new Discord.MessageEmbed()
    .setColor("#ffff00")
    .setDescription(`:warning: <@${message.author.id}> Tem certeza que quer fazer isso ? \n\n**Eu achei ${playerLength.length} player com essa SteamID** \n\`\`\`Digite SIM ou NÃO\`\`\``)
  return embed
}

 module.exports = {
    ADVaviso, DEMOTARsteamID
 }
