require('dotenv').config();
'use strict';
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', async({ author, channel, content, guild }) => {
    let keys = [...guild.members.cache.keys()];
    let randKey = keys[randomNo(keys.length)];
    let dmUser = guild.members.cache.get(randKey);
    console.log(dmUser.user.username);
    dmUser.send("You have been wordye\'d ")
    if (content === 'ping') {
        await channel.send('pong');

    }
}, );


function randomNo(length) { return Math.floor(Math.random() * length); }