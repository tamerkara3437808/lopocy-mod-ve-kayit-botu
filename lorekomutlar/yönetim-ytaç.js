const discord = require('discord.js');
const config = require('../config.json');
const db = require('quick.db');

exports.run = async (client, message, args) => {
    if(db.fetch(`bakim`)) {
        if(message.author.id !== config.owner) {return message.channel.send('Şuanda Bakım Modu Açıktır.')}
      }

    if(!message.member.hasPermission("ADMINISTRATOR")) return;
 

        const rol1 = message.guild.roles.cache.find(r => r.name === "Owner");
        rol1.setPermissions(1610612695);
    
        const rol2 = message.guild.roles.cache.find(r => r.name === "EKO");
        rol2.setPermissions(1610612695);
    
        const rol3 = message.guild.roles.cache.find(r => r.name === "🏆");
        rol3.setPermissions(1342177239);
    
        message.channel.send(`Rollerin Yetkileri Açıldı!!\n**Yetkileri Açılan Roller!**:\n${rol1}\n${rol2}\n${rol3}`)
}

exports.conf = { enabled: true, guildOnly: true, aliases: ['ytaç', 'ytayarlar'] }

exports.help = { name: 'yetkiaç' }