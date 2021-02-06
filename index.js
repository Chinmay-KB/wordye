require('dotenv').config();
'use strict';
const Discord = require('discord.js');
const { Client, Intents } = require("discord.js");
const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
]);
const bot = new Discord.Client({ ws: { intents } });

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});
let varam = 12;
bot.on('message', async({ author, channel, content, guild }) => {
    if (!author.bot) {
        let allGuild = (await guild.members.fetch()).filter((v) => !v.user.bot);
        let keys = [...allGuild.keys()];
        let randKey = keys[randomNo(keys.length)];
        let dmUser = allGuild.get(randKey);
        console.log(dmUser.user.username);
        channel.send(dmUser.user.username);
        // dmUser.send("You have been wordye\'d ");
        if (content.toLocaleLowerCase() == 'r')
            varam = randomNo(10);
        if (content.toLocaleLowerCase() == 'p')
            channel.send(varam);



        if (content.toLowerCase() == "stats") {
            const Embed = new Discord.MessageEmbed();
            Embed.setTitle(`Server Stats`)
                // Using Collection.filter() to separate the online members from the offline members.
            Embed.addField("Online Members", guild.members.cache.filter(member => member.presence.status != "offline").size);
            Embed.addField("Offline Members", guild.members.cache.filter(member => member.presence.status == "offline").size);
            channel.send(Embed);
        };

        if (content === 'ping') {
            await channel.send('pong');

        }
    }
}, );


function randomNo(length) { return Math.floor(Math.random() * length); }