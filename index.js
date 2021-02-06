require('dotenv').config();
'use strict';
var randWords = require('random-words');
const Discord = require('discord.js');
const { Client, Intents } = require("discord.js");
const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
]);
const bot = new Discord.Client({ ws: { intents } });

const TOKEN = process.env.TOKEN;

let sessionOn = false;
let playUser; // Store the user object who is playing
let tries = 0;
let wordToSay = "";

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});
let varam = 12;
bot.on('message', async({ author, channel, content, guild }) => {
    if (!author.bot) {

        if (content.toLocaleLowerCase() == '-start') {
            if (checkGame()) {
                sendDM(guild);
            } else await channel.send("A game is already in progress!!");
        } else if (content === '-tries') {
            tryPingOutside(channel); // await channel.send('pong');
        } else {
            if (sessionOn)
                if (checkMessage(content, channel)) {
                    channel.send("Yayy!!, ${playUser.username} has completed the challenge. The word was ${wordToSay}");
                }
        }
    }
}, );

async function tryPingOutside(channel) {
    await channel.send('pong');
}

function checkMessage(content, channel) {
    if (content.includes(wordsToSay)) {
        return true;
    } else {
        if (!checkGame())
            channel.send("${playUser.username} got wordye'd!");

    }
}

async function sendDM(guild) {
    let allGuild = (await guild.members.fetch()).filter((v) => !v.user.bot);
    let keys = [...allGuild.keys()];
    let randKey = keys[randomNo(keys.length)];
    let dmUser = allGuild.get(randKey);
    playUser = dmUser;
    // dmUser.send("You have been wordye\'d ");
    startNewGame();

}

function randomNo(length) { return Math.floor(Math.random() * length); }

function startNewGame() {
    sessionOn = true;
    wordToSay = randWords();
}

function stopGame() {
    sessionOn = false;
    wordsToSay = "";
}

function checkGame() {
    if (sessionOn) {
        return (tries <= 3); // User has to make it say within 30 messages
    } else return false;
}