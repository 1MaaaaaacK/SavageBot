const Discord = require('discord.js');


//Adv

function ADVtutorial (message){ 
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`:warning: ${message.author}, para utilizar o comando: \n\`\`\`!adv usuário - motivo\`\`\``)
  return embed
  }

 //Ban

function BANtutorial (message){ 
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`:warning: ${message.author}, para banir um membro, basta digitar: \n\`\`\`!banir Nick do acusado - Steamid - Tempo em minutos - Motivo do ban\`\`\``)
  return embed
}

function BANplayerError (message){
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`:warning: ${message.author}, houve um erro ao tentar banir o player !`)
  return embed
}

//Demotar

function DEMOTARtutorial (message){
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`:warning: ${message.author}, para demotar basta digitar: \n\`\`\`!demotar Steamid - Servidor - Motivo\`\`\``)
  return embed  
}

function DEMOTARserverError (message){
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`:warning: ${message.author}, você errou o servidor. \n\n**Esses são os servidores registrados:** \n\`\`\`jb, dr, mix, awp, retake, retakepistol, ttt, scout, mg\`\`\``)
  return embed  
}

function DEMOTARgerenteError (message){
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`:warning: ${message.author}, você não pode ter esse servidor como alvo, pois não é o gerente dele !`)
  return embed  
}

function DEMOTARSteamIDError (message){
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setDescription(`:warning: ${message.author}, não achei ninguém com essa SteamID !`)
  return embed  
}

 module.exports = {
    ADVtutorial, BANtutorial, BANplayerError, DEMOTARtutorial,
    DEMOTARserverError, DEMOTARgerenteError, DEMOTARSteamIDError
 }
