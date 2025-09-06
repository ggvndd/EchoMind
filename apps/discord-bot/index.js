// Discord integration for the core bot

const { Client, GatewayIntentBits } = require('discord.js');
const { getResponse } = require('../../packages/bot-engine/lib/bot'); // Path relatif ke core bot
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignore bot sendiri
  if (message.content.startsWith('!chat')) { // Prefix untuk trigger bot, misalnya !chat Hello
    const userInput = message.content.slice(5).trim();
    const response = getResponse(userInput);
    message.reply(response);
  }
});

client.login(process.env.DISCORD_TOKEN);