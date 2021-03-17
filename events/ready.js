const Discord = require("discord.js");
const hazır = require("../ready.json");
module.exports = client => {
client.user.setPresence({ activity: {name: hazır.Ready, type: hazır.ReadyType,}, status: hazır.ReadyStatus})
.then(console.log(hazır.BotReady)).catch()
};