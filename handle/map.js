const Discord = require('discord.js');
const { query } = require('gamedig');
const { webhookIpServidores } = require('../configs/config_webhook');
const webhookIpServidoresSend = new Discord.WebhookClient(webhookIpServidores.id, webhookIpServidores.token);

var Catch = [];

async function mapUpdate() {
    const servers = [
        (jailbreak = {
            host: '131.196.196.197',
            port: '27170',
        }),
        (deathrun = {
            host: '131.196.196.197',
            port: '27080',
        }),
        (awp = {
            host: '131.196.196.197',
            port: '27090',
        }),
        (retake = {
            host: '131.196.196.197',
            port: '27130',
        }),
        (retakepistol = {
            host: '131.196.196.197',
            port: '27150',
        }),
        (mix4fun = {
            host: '131.196.196.197',
            port: '27190',
        }),
        (ttt = {
            host: '131.196.196.197',
            port: '27060',
        }),
        (scout = {
            host: '131.196.196.197',
            port: '27250',
        }),
        (mg = {
            host: '131.196.196.197',
            port: '27260',
        }),
    ];

    for (let i in servers) {
        query({
            type: 'csgo',
            host: servers[i].host,
            port: servers[i].port,
        })
            .then((state) => {
                Catch[i] = {
                    name: state.name,
                    mapa: state.map,
                    players: state.raw.numplayers + '/' + state.maxplayers,
                    ip: state.connect,
                };
            })
            .catch((error) => {
                Catch[i] = { mapa: 'off', players: '0/0', ip: 'off' };
            });
    }
    if (Catch == '') return;

    const EmbedImg = new Discord.MessageEmbed()
        .setColor('#5F40C1')
        .setImage('https://cdn.discordapp.com/attachments/719223540783775804/730203351521689660/savage.png');

    const Embed = new Discord.MessageEmbed().setColor('#5F40C1').addFields(
        {
            name: `<a:diamante:650792674248359936> **#1 Savage - JailBreak** <a:diamante:650792674248359936>`,
            value: '\u200B',
        },
        { name: '**Mapa**', value: Catch[0].mapa, inline: true },
        { name: '**Players**', value: Catch[0].players, inline: true },
        {
            name: '**Conexao Direta**',
            value: 'steam://connect/' + Catch[0].ip,
            inline: true,
        },
        { name: `\u200B`, value: '\u200B' },
        {
            name: `<a:diamante:650792674248359936> **#2 Savage - Deathrun** <a:diamante:650792674248359936>`,
            value: '\u200B',
        },
        { name: '**Mapa**', value: Catch[1].mapa, inline: true },
        { name: '**Players**', value: Catch[1].players, inline: true },
        {
            name: '**Conexao Direta**',
            value: 'steam://connect/' + Catch[1].ip,
            inline: true,
        },
        { name: `\u200B`, value: '\u200B' },
        {
            name: `<a:diamante:650792674248359936> **#3 Savage - AWP ONLY** <a:diamante:650792674248359936>`,
            value: '\u200B',
        },
        { name: '**Mapa**', value: Catch[2].mapa, inline: true },
        { name: '**Players**', value: Catch[2].players, inline: true },
        {
            name: '**Conexao Direta**',
            value: 'steam://connect/' + Catch[2].ip,
            inline: true,
        },
        { name: `\u200B`, value: '\u200B' },
        {
            name: `<a:diamante:650792674248359936> **#4 Savage - RETAKE** <a:diamante:650792674248359936>`,
            value: '\u200B',
        },
        { name: '**Mapa**', value: Catch[3].mapa, inline: true },
        { name: '**Players**', value: Catch[3].players, inline: true },
        {
            name: '**Conexao Direta**',
            value: 'steam://connect/' + Catch[3].ip,
            inline: true,
        },
        { name: `\u200B`, value: '\u200B' },
        {
            name: `<a:diamante:650792674248359936> **#5 Savage - Retake Only Pistol** <a:diamante:650792674248359936>`,
            value: '\u200B',
        },
        { name: '**Mapa**', value: Catch[4].mapa, inline: true },
        { name: '**Players**', value: Catch[4].players, inline: true },
        {
            name: '**Conexao Direta**',
            value: 'steam://connect/' + Catch[4].ip,
            inline: true,
        }
    );

    const Embed1 = new Discord.MessageEmbed()
        .setColor('#5F40C1')
        .addFields(
            {
                name: `<a:diamante:650792674248359936> **#6 Savage - MIX 4Fun** <a:diamante:650792674248359936>`,
                value: '\u200B',
            },
            { name: '**Mapa**', value: Catch[5].mapa, inline: true },
            { name: '**Players**', value: Catch[5].players, inline: true },
            {
                name: '**Conexao Direta**',
                value: 'steam://connect/' + Catch[5].ip,
                inline: true,
            },
            { name: `\u200B`, value: '\u200B' },
            {
                name: `<a:diamante:650792674248359936> **#7 Savage - TTT** <a:diamante:650792674248359936>`,
                value: '\u200B',
            },
            { name: '**Mapa**', value: Catch[6].mapa, inline: true },
            { name: '**Players**', value: Catch[6].players, inline: true },
            {
                name: '**Conexao Direta**',
                value: 'steam://connect/' + Catch[6].ip,
                inline: true,
            },
            { name: `\u200B`, value: '\u200B' },
            {
                name: `<a:diamante:650792674248359936> **#8 Savage - ScoutKnives** <a:diamante:650792674248359936>`,
                value: '\u200B',
            },
            { name: '**Mapa**', value: Catch[7].mapa, inline: true },
            { name: '**Players**', value: Catch[7].players, inline: true },
            {
                name: '**Conexao Direta**',
                value: 'steam://connect/' + Catch[7].ip,
                inline: true,
            },
            { name: `\u200B`, value: '\u200B' },
            {
                name: `<a:diamante:650792674248359936> **#9 Savage - MiniGame** <a:diamante:650792674248359936>`,
                value: '\u200B',
            },
            { name: '**Mapa**', value: Catch[8].mapa, inline: true },
            { name: '**Players**', value: Catch[8].players, inline: true },
            {
                name: '**Conexao Direta**',
                value: 'steam://connect/' + Catch[8].ip,
                inline: true,
            },
            { name: `\u200B`, value: '\u200B' }
        )
        .setTimestamp()
        .setFooter('A lista atualizada a cada 5 minutos');
    await webhookIpServidoresSend.send({
        username: 'SavageServidores',
        avatarURL: 'https://cdn.discordapp.com/attachments/751428595536363610/795505830845743124/savage.png',
        embeds: [EmbedImg, Embed, Embed1],
    });
}
module.exports = {
    mapUpdate,
};
