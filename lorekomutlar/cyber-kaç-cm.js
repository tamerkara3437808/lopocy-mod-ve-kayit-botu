const Discord = require("discord.js");

exports.run = (client, message, args) => {
  var Random = [
"**0**cm",
"**1**cm <=3",
"**2**cm <==3",
"**3**cm <===3",
"**4**cm <====3",
"**5**cm <=====3",
"**6**cm <======3",
"**7**cm <=======3",
"**8**cm <========3",
"**9**cm <=========3",
"**10**cm <=========3",
"**11**cm <==========3",
"**12**cm <===========3",
"**13**cm <============3",
"**14**cm <=============3",
"**15**cm <==============3",
"**16**cm <===============3",
"**17**cm <================3",
"**18**cm <=================3",
"**19**cm <==================3",
"**20**cm <===================3",
"**21**cm <====================3",
"**22**cm <=====================3",
"**23**cm <======================3",
"**24**cm <=======================3",
"**25**cm <========================3",
"**26**cm <=========================3",
"**27**cm <==========================3",
"**28**cm <===========================3",
"**29**cm <============================3",
"**30**cm <=============================3",
"**31**cm <==============================3",
"**32**cm <===============================3",
"**33**cm <================================3",
"**34**cm <=================================3",
"**35**cm <==================================3",
"**36**cm <===================================3",
"**37**cm <====================================3",
"**38**cm <=====================================3",
"**39**cm <======================================3",
"**40**cm <=======================================3",
"**41**cm <========================================3",
"**42**cm <=========================================3",
"**43**cm <==========================================3",
"**44**cm <===========================================3",
"**45**cm <============================================3",
"**46**cm <=============================================3",
"**47**cm <==============================================3",
"**48**cm <===============================================3",
"**49**cm <================================================3",
"**50**cm <=================================================3",
"**51**cm",
"**52**cm",
"**53**cm",
"**54**cm",
"**55**cm",
"**56**cm",
"**57**cm",
"**58**cm",
"**59**cm",
"**60**cm",
"**61**cm",
"**62**cm",
"**63**cm",
"**64**cm",
"**65**cm",
"**66**cm",
"**67**cm",
"**68**cm",
"**69**cm",
"**70**cm",
"**71**cm",
"**72**cm",
"**73**cm",
"**74**cm",
"**75**cm",
"**76**cm",
"**77**cm",
"**78**cm",
"**79**cm",
"**80**cm :sunglasses: ",
"**81**cm :sunglasses: ",
"**82**cm :sunglasses: ",
"**83**cm :sunglasses: ",
"**84**cm :sunglasses: ",
"**85**cm :sunglasses: ",
"**86**cm :sunglasses: ",
"**87**cm :sunglasses: ",
"**88**cm :sunglasses: ",
"**89**cm :sunglasses: ",
"**90**cm :sunglasses: ",
"**91**cm :sunglasses: ",
"**92**cm :sunglasses: ",
"**93**cm :sunglasses: ",
"**94**cm :sunglasses: ",
"**95**cm :sunglasses: ",
"**96**cm :sunglasses: ",
"**97**cm :sunglasses: ",
"**98**cm :sunglasses: ",
"**99**cm :sunglasses: ",
"**100**cm :sunglasses: ",
  ];
  var gayver = Math.floor(Math.random() * Random.length);
  const gay = new Discord.MessageEmbed()
    .setColor("GREEN")
  .setAuthor(`Malafat Sayar 2077`, message.author.avatarURL())
    .setTimestamp()
    .setDescription(`${message.author} %${Random[gayver]} `)
    .setFooter("50 Den Sonrasının Uzunluğu Yok Kardeşim Cetvel Yetmiyo ")
  message.channel.send(gay).then(message=> message.react("✅"))
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["kaçcm"],
  permLevel: 0
};

exports.help = {
  name: "kaç-cm",
  description: "çet ne dio bu hyper yaa",
  usage: "oa çet kaç cm <==3"
};
  
