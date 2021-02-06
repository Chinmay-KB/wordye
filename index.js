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

let helpString = '> A discord bot inspired from a game played on Impractical Jokers >'
'An example can be found[here](https: //www.youtube.com/watch?v=H7mMp5PXKIk)'
'**RULES **'
'1. Enter `-start` in any channel.'
'2. The bot goes through all the users in a server and sends a DM to any random person.'
'3. The person is given a word in DM.The task for that user is to get someone else to repeat that word, without actually using the word directly'
'4. The player has to complete it before 20 messages are sent in a channel, from the moment `-start` was sent.'
'5. Kindly do not reply to the bot in DM, it breaks everything, under construction.';

let sessionOn = false;
let playUser; // Store the user object who is playing
let tries = 0;
let wordToSay = "";

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});
bot.on('message', async({ author, channel, content, guild }) => {
    if (!author.bot) {

        if (content.toLocaleLowerCase() == '&start') {
            if (!sessionOn) {
                {
                    sendDM(guild);
                }
            } else await channel.send("A game is already in progress!!");
        } else if (content === '&tries') {
            tryPingOutside(channel); // await channel.send('pong');
        } else if (content ===
            "&help") {
            await channel.send(helpString);
        } else if (content === '&reset') {
            stopGame();
            await channel.send("The game is reset")
        } else {
            if (sessionOn)
                checkMessage(content.toLowerCase(), channel, author);
        }
    }
}, );

async function tryPingOutside(channel) {
    await channel.send(tries);
}

function checkMessage(content, channel, author) {
    tries++;
    if (content.includes(wordToSay)) {
        if (!(author.id == playUser.user.id)) {
            channel.send("Yayy!!, <@" +
                playUser.user.id + "> has completed the challenge.The word was ***" + wordToSay + "***");
        } else channel.send("Get rekt <@" +
            playUser.user.id + ">, you CAN NOT use the word on your own or direct other's to use the word directly. The word was ***" + wordToSay + "***");
        stopGame();
    } else {
        if (tries > 10) {
            channel.send("Oops!!, <@" +
                playUser.user.id + "> got rekt.The word was ***" + wordToSay + "***");
            stopGame();
        }

    }
}

async function sendDM(guild) {
    let allGuild = (await guild.members.fetch()).filter((v) => !v.user.bot);
    let keys = [...allGuild.keys()];
    let randKey = keys[randomNo(keys.length)];
    let dmUser = allGuild.get(randKey);
    playUser = dmUser;
    wordToSay = randWords();
    console.log(playUser.user.username);
    dmUser.send("You have been wordye\'d - The word is ***" + wordToSay + "***");
    startNewGame();
}

function randomNo(length) { return Math.floor(Math.random() * length); }

function startNewGame() {
    sessionOn = true;
}

function stopGame() {
    sessionOn = false;
    wordsToSay = "";
    tries = 0;
}