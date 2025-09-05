// apps/discord-bot/index.js

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { getBotResponse } = require('../../packages/bot-engine/lib/bot');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.DISCORD_TOKEN;
const LOG_FILE = path.join(__dirname, '../../logs/bot.log');
const DATA_DIR = path.join(__dirname, '../../data');

// Pastikan direktori data ada sebelum bot berjalan
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`Bot Discord siap! Logged in sebagai ${client.user.tag}`);
    logMessage(`Bot Discord siap!`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    console.log(`Pesan dari ${message.author.username}: ${message.content}`);
    logMessage(`Pesan dari ${message.author.username}: ${message.content}`);

    const userId = message.author.id;
    const response = getBotResponse(userId, message.content);
    message.reply(response);

    console.log(`Bot menjawab: ${response}`);
    logMessage(`Bot menjawab: ${response}`);
});

function logMessage(message) {
    const timestamp = new Date().toISOString();
    fs.appendFile(LOG_FILE, `[${timestamp}] ${message}\n`, (err) => {
        if (err) console.error('Gagal menulis ke log:', err);
    });
}

client.login(TOKEN);