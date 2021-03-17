const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const kanallar = require('./kanallar.json');
const roller = require('./roller.json')
const chalk = require('chalk');
const moment = require('moment');
const mmmonet = require("moment-duration-format")
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const express = require('express');
const ms = require('ms');
const { monthsShort } = require('moment');

var prefix = config.prefix


require('./util/eventLoader.js')(client);


const log = message => {
console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./Events", (err, files) => {
    if(err) return console.error(err);
    files.filter(file => file.endsWith(".js")).forEach(file => {
        let prop = require(`./Events/${file}`);
        if(!prop.configuration) return;
        client.on(prop.configuration.name, prop);
    });
});

fs.readdir('./lorekomutlar/', (err, files) => { 
    if (err) console.error(err);
    log(`${files.length} Komut.`);
    files.forEach(f => {
        let props = require(`./lorekomutlar/${f}`);
        log(`${props.help.name} Yüklendi.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});
client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./lorekomutlar/${command}`)];
            let cmd = require(`./lorekomutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./lorekomutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./lorekomutlar/${command}`)];
            let cmd = require(`./lorekomutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === config.owner) permlvl = 4;
    return permlvl;
}
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;
  if(message.content.toLowerCase() === ""+config.prefix+"link") {
      [message.channel.send(""+ config.Link +"")]
  }
})

client.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;
  if(message.content.toLowerCase() === ""+config.prefix+"tag") {
      [message.channel.send("\`"+ config.tag +"\`")]
  }
})

client.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;
  if(message.content.toLowerCase() === ""+config.prefix+"tag") {
    [message.channel.send("\`"+ config.etikettag +"\`")]
  }
})




client.on("ready", async() => {
    let botvoicechannel = client.channels.cache.get(kanallar.BotVoiceChannel);
    if(botvoicechannel) botvoicechannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı"));
})



    //////////////////////AFK
 
    //////////////////////AFK


    
    client.on('voiceStateUpdate', (oldMember, newMember) => {
        { 
          let giriş = client.channels.cache.get(kanallar.voicegiriş);
          let çıkış = client.channels.cache.get(kanallar.voiceçıkış);
          let odadeğişme = client.channels.cache.get(kanallar.voicetransfer);
          let logKanali = client.channels.cache.get(kanallar.voicelog);
          let susturma = client.channels.cache.get(kanallar.voiceselfmute);
          let sağırlaştırma = client.channels.cache.get(kanallar.voiceselfdeaf);

          if (oldMember.channelID && !oldMember.serverMute && newMember.serverMute) return logKanali.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda yetkili tarafından **susturdu!**`).catch();
          if (!oldMember.channelID && newMember.channelID) return giriş.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanala **katıldı!**`).catch();
          if (oldMember.channelID && !newMember.channelID) return çıkış.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(oldMember.channelID).name}\` adlı sesli kanaldan **ayrıldı!**`).catch();
          if (oldMember.channelID && newMember.channelID && oldMember.channelID != newMember.channelID) return odadeğişme.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi ses kanalını **değiştirdi!** (\`${newMember.guild.channels.cache.get(oldMember.channelID).name}\` => \`${newMember.guild.channels.cache.get(newMember.channelID).name}\`)`).catch();
          if (oldMember.channelID && oldMember.selfMute && !newMember.selfMute) return susturma.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda kendi susturmasını **kaldırdı!**`).catch();
          if (oldMember.channelID && !oldMember.selfMute && newMember.selfMute) return susturma.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda kendini **susturdu!**`).catch();
          if (oldMember.channelID && oldMember.selfDeaf && !newMember.selfDeaf) return sağırlaştırma.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda kendi sağırlaştırmasını **kaldırdı!**`).catch();
          if (oldMember.channelID && !oldMember.selfDeaf && newMember.selfDeaf) return sağırlaştırma.send(`\`${newMember.guild.members.cache.get(newMember.id).displayName}\` üyesi \`${newMember.guild.channels.cache.get(newMember.channelID).name}\` adlı sesli kanalda kendini **sağırlaştırdı!**`).catch();
        };
      });   

client.on('messageDelete', message => {
        const lore = require("quick.db")
        lore.set(`snipe.mesaj.${message.guild.id}`, message.content)
        lore.set(`snipe.id.${message.guild.id}`, message.author.id)
        lore.set(`snipe.kanal.${message.guild.id}`, message.channel.id)
      
      })

client.on('guildBanAdd', async (guild, user) => {
  let modlogs = db.get(`modlogkanaly_${guild.id}`)
  const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir kişi sunucudan yasaklandı")
    .setThumbnail(user.avatarURL({ dynamic:true }))
    .addField(`Yasaklanan kişi`, `\`\`\` ${user.tag} \`\`\` `)
    .setFooter(`Yasaklanma Saati:`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});


client.on('guildBanRemove', async (guild, user) => {
  let modlogs = db.get(`modlogkanaly_${guild.id}`)
   const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir kişinin yasağı kaldırıldı")
     .setThumbnail(user.avatarURL({ dynamic:true }))
     .addField(`Yasağı kaldırılan kişi`, `\`\`\` ${user.tag} \`\`\` `)
     .setFooter(`Yasağının Kaldırıldığı Saat:`)
     .setTimestamp()
     modlogkanal.send(embed)
   }

 });


 client.on('channelCreate', async channel => {
  let modlogs = db.get(`modlogkanaly_${channel.guild.id}`)
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
   const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     if (channel.type === "text") {
       let embed = new Discord.MessageEmbed()
       .setColor("#fffa00")
       .setAuthor("Bir Kanal Oluşturuldu")
       .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
       .addField(`Oluşturulan Kanalın Türü : `, `Yazı`)
       .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
       .setFooter(`Kanal Oluşturulma Saati:`)
       .setTimestamp()
       modlogkanal.send(embed)
     }
       if (channel.type === "voice") {
       
         let embed = new Discord.MessageEmbed()
         .setColor("#fffa00")
         .setAuthor("Bir Kanal Oluşturuldu")
         .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
         .addField(`Oluşturulan Kanalın Türü : `, `Ses`)
         .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
         .setFooter(`Ses Kanal Oluşturulma Saati:`)
         .setTimestamp()
         modlogkanal.send(embed)
 
 
     }
 }});

 client.on('channelDelete', async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first())
let user = client.users.cache.get(entry.executor.id)
let modlogs = db.get(`modlogkanaly_${channel.guild.id}`)
const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
if(!modlogs) return;
if(modlogs) {
if (channel.type === "text") {
let embed = new Discord.MessageEmbed()
.setColor("#fffa00")
.setAuthor("Bir Kanal Silindi")
.addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
.addField(`Silinen Kanalın Türü : `, `Yazı`)
.addField(`Kanalı Silen : `, `<@${user.id}>`)
.setFooter(`Kanal Silinme Saati:`)
.setTimestamp()
modlogkanal.send(embed)
}
  if (channel.type === "voice") {

    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir Kanal Silindi")
    .addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
    .addField(`Silinen Kanalın Türü : `, `Ses`)
    .addField(`Kanalı Silen : `, `<@${user.id}>`)
    .setFooter(`Ses Kanalı Silinme Saati:`)
    .setTimestamp()
    modlogkanal.send(embed)
   }
  }
});

client.on('roleDelete', async role => {
  let modlogs =  db.get(`modlogkanaly_${role.guild.id}`)
   let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first())
   let user = client.users.cache.get(entry.executor.id)
  const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir Rol Silindi")
     .addField(`Silinen Rolün İsmi : `, `${role.name}`)
     .addField(`Rolü Silen : `, `<@${user.id}>`)
     .setFooter(`Rolün Silinme Saati:`)
     .setTimestamp()
     modlogkanal.send(embed)
   }
 });
 
 client.on('emojiDelete', async emoji => {
  let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`)
  let entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
   const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir Emoji Silindi")
     .addField(`Silinen Emojinin İsmi : `, `${emoji.name}`)
     .addField(`Emojiyi Silen : `, `<@${user.id}>`)
     .setFooter(`Emojinin Silinen Saati:`)
     .setTimestamp()
     modlogkanal.send(embed)
   }
 });
  

 client.on('roleCreate', async role => {
  let modlogs =  db.get(`modlogkanaly_${role.guild.id}`)
  let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
    const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
    if(!modlogs) return;
    if(modlogs) {
      let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Rol Oluşturuldu")
      .addField(`Oluşturulan Rolün İsmi : `, `${role.name}`)
      .addField(`Rolü Oluşturan : `, `<@${user.id}>`)
      .setFooter(`Rölün Oluşturulma Saati:`)
      .setTimestamp()
      modlogkanal.send(embed)
    }
  });
  
  
  client.on('emojiCreate', async emoji => {
   let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`)
   let entry = await role.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first())
   let user = client.users.cache.get(entry.executor.id)
    const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
    if(!modlogs) return;
    if(modlogs) {
      let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Emoji Oluşturuldu")
      .addField(`Oluşturulan Emojinin İsmi : `, `${emoji.name}`)
      .addField(`Emoji Silen : `, `<@${user.id}>`)
      .setFooter(`Emoji Oluşturulma Saati:`)
      .setTimestamp()
      modlogkanal.send(embed)
    }
  });

//MESAJ LOG
client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type === "dm") return;
  if (newMessage.content.startsWith(prefix)) return;
  let sc = await db.fetch(`modlogkanaly_${newMessage.guild.id}`);
  let scbul = newMessage.guild.channels.cache.get(sc)
  if(!scbul) {
    
  }
  if (oldMessage.content == newMessage.content) return;
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
    .addField("Kullanıcı", newMessage.author)
    .addField("Eski Mesaj", "```" + oldMessage.content + "```")
    .addField("Yeni Mesaj", "```" + newMessage.content + "```")
    .addField("Kanal Adı", newMessage.channel.name)
    .addField("Mesaj ID", newMessage.id)
    .addField("Kullanıcı ID", newMessage.author.id)
    .setFooter(`Bilgilendirme  • bügün saat ${newMessage.createdAt.getHours() +
        3}:${newMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});

client.on("messageDelete", async deletedMessage => {
  if (deletedMessage.author.bot || deletedMessage.channel.type === "dm") return;
  if (deletedMessage.content.startsWith(prefix)) return;
  let sc = await db.fetch(`modlogkanaly_${deletedMessage.guild.id}`);
  let scbul = deletedMessage.guild.channels.cache.get(sc)
  if(!scbul) {
    
  }
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Silindi`, deletedMessage.author.avatarURL())
    .addField("Kullanıcı", deletedMessage.author)
    .addField("Silinen Mesaj", "```" + deletedMessage.content + "```")
    .addField("Kanal Adı", deletedMessage.channel.name)
    .addField("Mesaj ID", deletedMessage.id)
    .addField("Kullanıcı ID", deletedMessage.author.id)
    .setFooter(`Bilgilendirme  • bügün saat ${deletedMessage.createdAt.getHours() +
        3}:${deletedMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});


////

client.on("userUpdate", async function(oldUser, newUser) {
  const guildID = "820322898400116766"//sunucu
  const roleID = "820337215530860625"//taglırolü
  const tag = "1571"//tag
  const chat = '820329412997545984'// chat
  const log2 = '820379080905588776' // log kanalı

  const guild = client.guilds.cache.get(guildID)
  const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
  const member = guild.members.cache.get(newUser.id)
  const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#ff0000').setTimestamp();
  if (newUser.username !== oldUser.username) {
      if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
          member.roles.remove(roleID)
          client.channels.cache.get(log2).send(embed.setDescription(` ${newUser} isminden \`${tag}\` çıakrtarak ailemizden ayrıldı!`))
      } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
          member.roles.add(roleID)
          client.channels.cache.get(chat).send(`Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir **'Merhaba!'** diyin.(${tag})`)
          client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} ismine \`${tag}\` alarak ailemize katıldı`))
      }
  }
 if (newUser.discriminator !== oldUser.discriminator) {
      if (oldUser.discriminator == "1571" && newUser.discriminator !== "1571") {
          member.roles.remove(roleID)
          client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} etiketinden \`1571\` çıakrtarak ailemizden ayrıldı!`))
      } else if (oldUser.discriminator !== "1571" && newUser.discriminator == "1571") {
          member.roles.add(roleID)
          client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} etiketine \`1571\` alarak ailemize katıldı`))
          client.channels.cache.get(chat).send(`Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir **'Merhaba!'** diyin.(#1945)`)
      }
  }

})



//////

const kiltifat = [
  'Gözlerindeki saklı cenneti benden başkası fark etsin istemiyorum.',
  'Mavi gözlerin, gökyüzü oldu dünyamın.',
  'Parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.',
  'Huzur kokuyor geçtiğin her yer.',
  'Öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı.',
  'Gözlerinin hareketi bile yeter  benim aklımı başımdan almaya.',
  'Güller bile kıskanır seni gördükleri zaman kendi güzelliklerini.',
   'Hiç yazılmamış bir şiirsin sen, daha önce eşi benzeri olmayan.',
   'Adım şaire çıktı civarda. Kimse senin şiir olduğunun farkında değil henüz.',
   'Etkili gülüş kavramını ben senden öğrendim.',
   'Seni anlatmaya kelimeler bulamıyorum. Nasıl anlatacağımı bilemediğim için seni kimselere anlatamıyorum.',
   'Gözlerinle baharı getirdin garip gönlüme.',
   'Bir gülüşün ile çiçek açıyor bahçemdeki her bir çiçek.',
   'Yuva kokuyor kucağın. Sarılınca seninle yuva kurası geliyor insanın.',
   'Sen bu  dünyadaki bütün şarkıların tek sahibisin. Sana yazılıyor bütün şarkılar ve şiirler. Adın geçiyor bütün namelerde.',
   'Seni yüreğimde taşıyorum ben, sırtımda taşımak ne kelime. Ömrüm boyunca çekmeye hazırım her anlamda senin yükünü.',
   'Hayatıma gelerek hayatımdaki bütün önemli şeylerin önemsiz olmasını sağladın. Artık sensin tek önem verdiğim şu hayatta.',
   'Sen benim bu hayattaki en büyük duamsın.  Gözlerin adeta bir ay parçası. Işık oluyorsun karanlık gecelerime.',
   'Aynı zaman diliminde yaşamak benim için büyük ödüldür.',
  'Biraz Çevrendeki İnsanları Takarmısın ?',
  'İğrenç İnsansın!',
   'Kalbime giden yolu aydınlatıyor gözlerin.  Sadece sen görebilirsin kalbimi. Ve sadece ben hissedebilirim bana karşı olan hislerini.',
   'Onu Bunu Boşver de bize gel 2 bira içelim.',
    'Taş gibi kızsın ama okey taşı… Elden elde gidiyorsun farkında değilsin.',
    'Zara seni çok sevdi...',
    'Mucizelerden bahsediyordum.',
];
client.on("message", async message => {
  if(message.channel.id !== (config.chatkanalı)) return;
  let Knavedev = db.get('chatiltifat');
  await db.add("chatiltifat", 1);
  if(Knavedev >= 60) {
    db.delete("chatiltifat");
    const random = Math.floor(Math.random() * ((kiltifat).length - 1) + 1);
    message.reply(`${(kiltifat)[random]}`);
  };
});



        client.on("userUpdate", async (oldUser, newUser) => {
        if (oldUser.username !== newUser.username) {
        const tag = 'Long'
        const sunucu = "820322898400116766"
        const kanal = '820379080905588776'
        const rol = '820398774622879785'
      
        try {
      
        if (newUser.username.includes(tag) && !client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) {
        await client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setColor("GREEN").setDescription(`${newUser} , \`${tag}\` Tagımızı Aldığı İçin <@&${rol}> Rolü Verildi`));
        await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.add(rol);
        }
        if (!newUser.username.includes(tag) && client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) {
        await client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setColor("RED").setDescription(`${newUser} , \`${tag}\` Tagımızı Çıkardığı İçin <@&${rol}> Rolü Alındı`));
        await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.remove(rol);
        }
      } catch (e) {
      console.log(`Bir hata oluştu! ${e}`)
       }
      }
      });
      
      
        
//---------------------------------------------------spotify engel-----------------------------------------------------\\

client.on("guildMemberAdd", member => {
  let sunucuid = "820322898400116766"; 
  var tag = 'Long';
  let rol = "820398774622879785";
if(member.user.username.includes(tag)){
member.roles.add(rol)
  const tagalma = new Discord.MessageEmbed().setColor("0x2f3136").setDescription(`<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı, o doğuştan beri bizden !`).setTimestamp()
     client.channels.cache.get('820379080905588776').send(tagalma)
}
})



 //client.on("guildMemberAdd", member => {  
  // const lorewebhook = new Discord.WebhookClient('820381216762757130', 'oi_W6k2qpQNAR78fMNTRyxDhlUIq2Cy1Pi-tK_xDdG3V6Q-O2ga6tUmlM4CLpCD1inxK')
      
 //   let user = client.users.cache.get(member.id);
   //   require("moment-duration-format");
     //   const kurulus = new Date().getTime() - user.createdAt.getTime();  
  //  const gecen = moment.duration(kurulus).format(`YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`) 
     
  
    //moment.locale("tr");
  //lorewebhook.send(":tada: **long'a hoş geldin** <@" + member + "> \n\n<@&820323637743583253> rolüne sahip yetkililer senin ile ilgilenecektir. \n\n **Hesabın \`"+ gecen +"\` Önce Oluşturulmuş** \n\nSunucu kurallarımız <#820327229195026482> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek. \n\nsunucumuzun \`" + member.guild.memberCount + "\` üyesi olmanı sağladı! İyi eğlenceler. ");
 //   member.setNickname(` İsim | Yaş`);
   /// });

//////
 



//////xp sstm.

client.on("messageDelete", async message => {
  if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
  await db.set(`snipe.${message.guild.id}.${message.channel.id}`, { yazar: message.author.id, yazilmaTarihi: message.createdTimestamp, silinmeTarihi: Date.now(), dosya: message.attachments.first() ? true : false });
  if (message.content) db.set(`snipe.${message.guild.id}.${message.channel.id}.icerik`, message.content);
});




///random gif pp

client.on(`userUpdate`, (oldUser, newUser) => {
  let renk = "4b0101"
  let avatar = newUser.avatarURL({ dynamic: true, format: "png", size: 1024 }).split('?')[0]
  let png = client.channels.cache.get('820377295403221044')/// PP Avatar Kanal İd
  let gif = client.channels.cache.find(ch => ch.id === '820377295403221044')/// Gif Avatar Kanal İd
if(avatar.endsWith('.png') || avatar.endsWith('.jpg') || avatar.endsWith('.webp')) {
  const savagepng= new Discord.MessageEmbed()
  .setImage(avatar)
  .setColor(renk)
  .setFooter(`zara was here`)
  .setDescription(`**Resimi görüntülemek için** [**Buraya Tıkla**](${newUser.avatarURL({ dynamic: true, format: "png", size: 1024 })})`)
  png.send(savagepng)
}
if(avatar.endsWith('.gif')) {
  const savagegif= new Discord.MessageEmbed()
  .setImage(avatar)
  .setColor(renk)
  .setFooter(`zara was here`)
  .setDescription(`**Resimi görüntülemek için** [**Buraya Tıkla**](${newUser.avatarURL({ dynamic: true, format: "png", size: 1024 })})`)
  gif.send(savagegif)
}
}) // SAVAGE SIZI COK SEVIYOOO <3

/////ayarlamalı sözcuk filtr

//client.on('message', async message => { if(message.guild.id === "786477463940497449") {///Sunucu id 
//if(message.channel.id === "816588740888625214"){//// kanal id 
//if(message.content.includes("mavi")){ message.delete() 
//message.member.roles.add(`816589391996387358`)///rolid 
//}else {message.delete()} }else return; }else return; })
//Events Kısmına Atılması Gerekmektedir


    


  /////////----

  
/////
client.login(config.token)