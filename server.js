const Discord = require('discord.js')
const client = new Discord.Client({autoReconnect: true, disableEvents: ["TYPING_START", "TYPING_STOP", "GUILD_MEMBER_SPEAKING", "GUILD_MEMBER_AVAILABLE", "PRESSENCE_UPDATE"]}, {fetchAllMembers: true});
const express = require('express');
const coinflip = require('coinflip')
const app = express();
const cheerio = require('cheerio') 
const snekfetch = require('snekfetch')
const superagent = require('superagent');
const util = require('util');
const fs = require("fs"); 
const urban = require("relevant-urban");
const db = require("quick.db");
const figlet = require("figlet");
const table = require("table");
const arraySort = require("array-sort");
const ms = require("ms");
const got = require("got");
const remove = require("remove")
const api = 'dc6zaTOxFJmzC';
const randomPuppy = require("random-puppy");
const booru = require("booru");
var request = require("request");
var moment = require('moment');
var gis = require('g-image-search');
const weather = require('weather-js');
const catnames = require('cat-names')
var glitch = require('glitch');
var download = require('download');
var escape = require('escape-html');
var Jimp = require("jimp");
const discordEmoji = require('discord-emoji');
const emoji = {};

// files/folders

const gifs = require("./gifs.json");

remove('/app/.git', function(err){
    if (err) console.error(err);
    else     console.log('Initialization process completed.');
});

Object.values(discordEmoji).forEach(value => {
Object.keys(value).forEach(key => {
        emoji[key] = value[key];
    });
});

//-----------------------------------------------------------------------
var discordbotsorgtoken = ""
var token = ""
//-----------------------------------------------------------------------


var nsfwBanList = [
    "suicidal",
    "suicide",
    "child",
    "kid",
    "tod"
]

const mappings = {
    'a': [':regional_indicator_a:', ':a:'],
    'b': [':regional_indicator_b:', ':b:'],
    'c': [':regional_indicator_c:'],
    'd': [':regional_indicator_d:'],
    'e': [':regional_indicator_e:'],
    'f': [':regional_indicator_f:'],
    'g': [':regional_indicator_g:', ':compression:'],
    'h': [':regional_indicator_h:'],
    'i': [':regional_indicator_i:', ':information_source:'],
    'j': [':regional_indicator_j:'],
    'k': [':regional_indicator_k:'],
    'l': [':regional_indicator_l:'],
    'm': [':regional_indicator_m:', ':m:'],
    'n': [':regional_indicator_n:'],
    'o': [':regional_indicator_o:', ':o2:', ':o:'],
    'p': [':regional_indicator_p:', ':parking:'],
    'q': [':regional_indicator_q:'],
    'r': [':regional_indicator_r:'],
    's': [':regional_indicator_s:'],
    't': [':regional_indicator_t:', ':cross:'],
    'u': [':regional_indicator_u:'],
    'v': [':regional_indicator_v:'],
    'w': [':regional_indicator_w:'],
    'x': [':regional_indicator_x:', ':heavy_multiplication_x:', ':x:', ':negative_squared_cross_mark:'],
    'y': [':regional_indicator_y:'],
    'z': [':regional_indicator_z:'],
    '0': [':zero:'],
    '1': [':one:'],
    '2': [':two:'],
    '3': [':three:'],
    '4': [':four:'],
    '5': [':five:'],
    '6': [':six:'],
    '7': [':seven:'],
    '8': [':eight:'],
    '9': [':nine:'],
    '!': [':exclamation:', ':grey_exclamation:'],
    '?': [':question:', ':grey_question:'],
    '*': [':asterisk:', ':eight_spoked_asterisk:'],
    '#': [':hash:'],
    '$': [':heavy_dollar_sign:']
};

  function doRandomSize() {
    var rand = [Jimp.FONT_SANS_64_BLACK]
    return rand[Math.floor(Math.random() * rand.length)];

  }

function clone(object) {
    const newObject = {};

    Object.keys(object).forEach(key => {
        if (object[key] instanceof Array) {
            newObject[key] = new Array(...object[key]);
        } else {
            newObject[key] = object[key];
        }
    });

    return newObject;
}

function emojiToUnicode(input) {
    if (/^:regional_indicator_[a-z]:$/.test(input)) {
        return String.fromCharCode(55356) + String.fromCharCode(56806 + input.substr(20, 1).charCodeAt(0) - 97);
    }
    return emoji[input.slice(1, -1)];
}

function react(message, remaining, allowedMappings) {
    if (remaining.length < 1) {
        
        return;
    }

    const char = remaining.shift().toLowerCase();

    if (!char) {
        return;
    }

    if (!allowedMappings[char]) {
        
        return;
    }

    const next = allowedMappings[char].shift();
    if (!next) {
        
        return;
    }

    message.react(emojiToUnicode(next)).then(() => {
        react(message, remaining, allowedMappings);
    });
}


let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

var startTime = Date.now();

const Enmap = require("enmap");
const Provider = require("enmap-sqlite");

client.points = new Enmap({provider: new Provider({name: "points"})});

client.on("ready", () => {
  
console.log("I'm ready!");
  let games = [`with ${client.users.size} members | ${client.guilds.size} guilds`, "a!help | Want support? Join our support guild. a!supportserver"]
      setInterval(() => {
  client.user.setActivity(games[Math.floor(Math.random() * games.length)])
}, 60000)
  
      superagent
        .post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
        .send(`{ "server_count": ${client.guilds.size}}`)
        .type('application/json')
        .set('Authorization', discordbotsorgtoken)
        .set('Accept', 'application/json')
        .end(err => {
            if (err) return console.error(err);
            console.log("Posted stats to discordbots.org!");
        });
});

  client.getImage = (message) => {

    const messageList = message.channel.messages.sort(function(a, b) {
      return b.createdTimestamp - a.createdTimestamp;
    }).array();
    let attachmentFound = false;
    for (let i = 0; i < messageList.length; i++) {
      if (messageList[i].attachments.array().length !== 0) {
        const attachmentsList = messageList[i].attachments.array();
        const fileExtension = attachmentsList[0].name.split(".").slice(-1)[0].toLowerCase();
        if (fileExtension !== "png" && fileExtension !== "jpg" && fileExtension !== "jpeg") {
          return;
        }
        attachmentFound = true;
        return attachmentsList[0].url;
      } else if (messageList[i].embeds.length !== 0 && messageList[i].embeds[0].image) {
        const embedsList = messageList[i].embeds;
        const fileExtension = embedsList[0].image.url.split(".").slice(-1)[0].toLowerCase();
        if (fileExtension !== "png" && fileExtension !== "jpg" && fileExtension !== "jpeg") {
          return;
        }
        attachmentFound = true;
        return embedsList[0].image.url;
      }
    }
    if (!attachmentFound) {
      return;
    }
  };

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  
      superagent
        .post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
        .send(`{ "server_count": ${client.guilds.size}}`)
        .type('application/json')
        .set('Authorization', discordbotsorgtoken)
        .set('Accept', 'application/json')
        .end(err => {
            if (err) return console.error(err);
            console.log("Pos/ted stats to discordbots.org! [Guilds]");
        });
  
    let channel = client.channels.get("479333302516449291");
  if (!channel) return;
  let embed = new Discord.RichEmbed()
  .setTitle('I have been added to the server!')
  .setColor('RANDOM')
  .addField('**Name:** ', `${guild.name}`)
  .addField('**ID**:', `${guild.id}`)
  .addField('**Server Owner:**', `${guild.owner}`)
  .addField('**Region:**', `${guild.region}`)
  .addField('**Members:**', `${guild.memberCount}`)
  .setFooter(`Ayksa Laboratory`)
  .setTimestamp()
  
  channel.sendEmbed(embed);
  
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`with ${client.users.size} members`);
  
    let channel = client.channels.get("479333302516449291");
  if (!channel) return;
  let embed = new Discord.RichEmbed()
  .setTitle('I have been removed from the server! :(')
  .setColor('RANDOM')
  .addField('**Name:** ', `${guild.name}`)
  .addField('**ID**:', `${guild.id}`)
  .addField('**Server Owner:**', `${guild.owner}`)
  .addField('**Region:**', `${guild.region}`)
  .addField('**Members:**', `${guild.memberCount}`)
  .setFooter(`Ayksa Laboratory`)
  .setTimestamp()
  
  channel.sendEmbed(embed);
});

client.on('guildMemberAdd', async (member) => {

  let autoRole = await db.fetch(`autorole_${member.guild.id}`).catch(err => console.log(err));
  let autorole = member.guild.roles.find('name', autoRole);
  member.addRole(autorole)
  
});

client.on('guildMemberAdd', async member => {
  let channel = member.guild.channels.find('name','welcome-leave');
  let memberavatar = member.user.avatarURL
  if (!channel) return;
  let embed = new Discord.RichEmbed()
  .setTitle('Ayksa Laboratory')
  .setColor('RANDOM')
  .setThumbnail(memberavatar)
  .addField(':bust_in_silhouette: | name : ', `${member}`)
  .addField(':wave: | Welcome!', `Welcome to the server, ${member}`)
  .addField(':id: | User :', "**[" + `${member.id}` + "]**")
  .addField(':family_mwgb: | Your are the member', `${member.guild.memberCount}`)
  .addField("Name", `<@` + `${member.id}` + `>`, true)
  .addField('Server', `${member.guild.name}`, true)
  .setFooter(`${member.guild.name}`)
  .setTimestamp()
  
  channel.sendEmbed(embed);
});


client.on('guildMemberRemove', async member => {
  let channel = member.guild.channels.find('name','welcome-leave');
  let memberavatar = member.user.avatarURL
  if (!channel) return;
  let embed = new Discord.RichEmbed()
  .setTitle('Ayksa Laboratory')
  .setColor('RANDOM')
  .setThumbnail(memberavatar)
  .addField('name', `${member}`)
  .addField('Has let the Server', ':cry:')
  .addField('Bye Bye', 'We will miss all missy you!')
  .addField('The server now as', `${member.guild.memberCount}` + " members")
  .setFooter(`${member.guild.name}`)
  .setTimestamp()
  
  channel.sendEmbed(embed);
  });

client.on('guildMemberRemove', async member => {
  
  console.log(`${member}`, "has left" + `${member.guild.name}` + "Sending leave message now")
  console.log("Leave Message Sent")
  
});

client.on("message", async message => {

  if(message.author.bot) return;
  
  if(message.channel.type == "dm") return message.channel.send("I only work on the servers! If you have any problems or bugs please join to the support server. \nhttps://discord.gg/HDskU9J"))
  
  let prefixes = JSON.parse(fs.readFileSync("./data/prefixes.json", "utf8"));
  
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: config.prefix
    };
  }
  
  let prefix = prefixes[message.guild.id].prefixes
  
  var messagecmd = message.content.split(" ")[0].substring(1);
  var params = message.content.substring(messagecmd.length + 2);
  const args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);
  if(message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  
  if(command == "setprefix"){
      
    
      if (!message.guild.member(message.author).hasPermission('MANAGE_MESSAGES'))
      return message.channel.send("Sorry, you don't have permissions to use this! ERROR: ``MANAGE_MESSAGES``");
  if(!args[0]) return message.channel.send(`Usage: \`\`` + `${prefix}setprefix <new prefix>` + `\`\``);
  
  let prefixes = JSON.parse(fs.readFileSync("./data/prefixes.json", "utf8"));
  
  prefixes[message.guild.id] = {
    prefixes: args[0]
  };
  
  fs.writeFile("./data/prefixes.json", JSON.stringify(prefixes), (err) => {
    if (err) console.log(err)
  });
  
  let embed = new Discord.RichEmbed()
  .setColor("#ffa500")
  .setTitle("Prefix set!")
  .setDescription(`Set to ${args[0]}`)
  
  message.channel.send(embed)
  
  }
  
  if(command=== 'avatar') {
    log(client, message, 'avatar');
    let msg = await message.channel.send("Loading avatar...");
    let target = message.mentions.users.first() || message.author;

    await message.channel.send({files: [
        {
            attachment: target.displayAvatarURL,
            name: "avatar.png"
        }
    ]})

    msg.delete();
}

  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
    function clean(text) {
    if (typeof (text) === "string")
      return text.replace(/` /g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
  }
  
  if (command === "text") {
    let user = message.mentions.users.first();
    if (!user) return message.channel.send("Please mention the user you want to put text on!")
    if (user < 1) return message.channel.send("Please mention the user you want to put text on!")
    if (!args[1]) {
      message.edit("Please type something")
      return;
    }

    let testingtxt = args.splice(1).join(' ');

    message.channel.startTyping()
    var url = user.avatarURL;

    Jimp.read(url).then(function (image) {

      image.resize(1024, 1024, Jimp.RESIZE_BEZIER);


      Jimp.loadFont(doRandomSize()).then(function (font) {

        /**image.greyscale()**/
        image.print(font, 20, 960, testingtxt, Jimp.ALIGN_FONT_CENTER).getBuffer(Jimp.MIME_JPEG, onBuffer)

        let outputfile = "./output/" + Math.random().toString(36).substr(2, 5) + "." + image.getExtension(); // create a random name for the output file
        image.write(outputfile, function () {

          message.channel.sendFile(outputfile).then(function () {

            fs.unlink(outputfile);
            console.log("SUCCESS: " + user.username);
            message.channel.stopTyping()
          });
        });

      });


    }).catch(function (err) {
      console.error(err);
      message.reply("Error, Could be that your avatar is invalid OR your avatar has something like <>.")
    })

    function onBuffer(err, buffer) {
      if (err) throw err;





      console.log(buffer);

    }
  }

  
  if(command === "kick") {
    if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS'))
      return message.reply("Sorry, you don't have permissions to use this!");
  
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    
    if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS'))
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  if(message.content.toLowerCase().startsWith("a!roleinfo")){
      try{
  if(args.length < 1) return message.reply("**No arguments have been specified!**");
    var find=args.slice(0).join(" ").toLowerCase();
  if(find){
  var role = message.guild.roles.find(r => r.name.toLowerCase() === find);
  if(role){
  message.channel.send({embed: {
  color: role.color || null,
thumbnail: {url: `http://www.colourlovers.com/img/${role.hexColor.replace("#", "")}/250/250/`} || null,
  fields: [
    {name: "Name", value: role.name, inline: true},
  {name: "ID", value: role.id, inline: true},
    {name: "Color", value: role.hexColor, inline: true},
    {name: "Hoisted", value: role.hoist, inline: true},
    {name: "Mentionable", value: role.mentionable, inline: true},
    {name: "Postion", value: role.position, inline: true},
  ]
  }});
  }else{
  return message.reply("Couldn't find a role called **"+find+"**.");
  }
  };
  } catch (error) {
  return message.channel.send("**Roleinfo command returned an error**: \n"+error.message)
  }
  }
    if(message.content.startsWith("a!userinfo")){  
      let user;
    if (message.mentions.users.size) {
      user = message.mentions.users.first();
    }
    else if (!isNaN(args[0])){
    user = client.users.get(args[0]);
    }
   if (!user) {
      user = message.author;
    }
  if(user){
  let member = await message.guild.fetchMember(user.id);
  message.channel.send({embed: {
  description: "**User info of **"+user,
  thumbnail: {url: user.displayAvatarURL},
  fields: [
    {
    name: "ID", 
    value: user.id, 
    inline: true
    },
    {
    name: "Nickname", 
    value: member.nickname || "None", 
    inline: true
    },
            {
                name: 'Status',
                value: `${user.presence.status[0].toUpperCase() + user.presence.status.slice(1)}`,
            },
            {
                name: 'Game',
                value: `${(user.presence.game && user.presence.game && user.presence.game.name) || 'Not playing a game.'}`,
            },
      {
        "name": "Registered At",
        "value": user.createdAt,
        "inline": true
      }
  ],
  color: member.displayColor || null
  }});
  }
  return
  }  
  if (command == "hug") {
try {
            if (message.mentions.users.size < 1) return message.reply("**you need to mention someone**");
            if (message.mentions.users.first().id == message.author.id) return message.reply("**you cannot highfive yourself**")
      var gifImage = gifs.highfive[Math.floor(Math.random()*gifs.highfive.length)];
      const embed = new Discord.RichEmbed()
          .setDescription(`@${message.author.tag} has nailed a high five with @${message.mentions.users.first().tag}`)
          .setImage(gifImage)
      message.channel.send({embed});
} catch (e) {
message.channel.send("Error: ``" + e + "``");
client.guilds.get("416943085461962752").channels.get("466702281203646487").send(e);

}
  }
  if (command == "kiss") {
      if (message.mentions.users.size < 1) return message.reply("**you need to mention someone**");
      if (message.mentions.users.first().id == message.author.id) return message.reply("**Are you... okay?...**")
   
      var gifImage = gifs.kiss[Math.floor(Math.random()*gifs.kiss.length)];
      const { body } = await superagent.get('https://nekos.life/api/kiss');
      const embed = new Discord.RichEmbed()
          .setDescription(`@${message.author.tag} is kissing @${message.mentions.users.first().tag}`)
          .setImage(body.url)
      message.channel.send({embed});
  }
    if (command == "slap") {
      if (message.mentions.users.size < 1) return message.reply("**you need to mention someone**");
      if (message.mentions.users.first().id == message.author.id){
        const embed = new Discord.RichEmbed()
          .setDescription(`Oh, okay... *slaps @${message.mentions.users.first().tag}`)
          .setImage(gifImage)
      message.channel.send(`Oh, okay... *slaps ${message.author.tag}`, {embed});
  }; 
  
      var gifImage = gifs.slap[Math.floor(Math.random()*gifs.slap.length)];
      const embed = new Discord.RichEmbed()
          .setDescription(`@${message.author.tag} slaps @${message.mentions.users.first().tag}`)
          .setImage(gifImage)
      message.channel.send({embed});
  }
  if (command == "pat") {
      if (message.mentions.users.size < 1) return message.reply("**you need to mention someone**");
      if (message.mentions.users.first().id == message.author.id) return message.reply("**you cannot pat yourself**")
     
      var gifImage = gifs.pat[Math.floor(Math.random()*gifs.pat.length)];
      const { body } = await superagent.get('https://nekos.life/api/pat')
      const embed = new Discord.RichEmbed()
          .setDescription(`@${message.author.tag} pats @${message.mentions.users.first().tag}`)
          .setImage(body.url)
      message.channel.send({embed});
  }
    if (message.author.equals(client.user)) return;
  
    if (command == "highfive") {
            if (message.mentions.users.size < 1) return message.reply("**you need to mention someone**");
            if (message.mentions.users.first().id == message.author.id) return message.reply("**you cannot highfive yourself**")
      var gifImage = gifs.highfive[Math.floor(Math.random()*gifs.highfive.length)];
      const embed = new Discord.RichEmbed()
          .setDescription(`@${message.author.tag} has nailed a high five with @${message.mentions.users.first().tag}`)
          .setImage(gifImage)
      message.channel.send({embed});
  }
  if(command == "ewe"){
    if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
    
    const _mentionSize = message.mentions.users.size;
    const _mapMember = message.mentions.users.map(u => {return `${u.tag}`});

    // timing
    let _24inminutes = 1440;   
    
    let BattleMarch = args[0];
    if (BattleMarch === 'vs') {
        const _randHour0 = Math.floor(Math.random() * _24inminutes);
        const _randHour1 = Math.floor(Math.random() * _24inminutes);

        if (!_mentionSize) return message.reply('you should mention your friend.');
        if (_mentionSize > 2) return message.reply(`hey, are you crazy? you can only mention 1 user!`);

        let player1 = ``;
        let player2 = ``;
        if (_mentionSize === 2) {
            player1 = _mapMember[0];
            player2 = _mapMember[1];
        }
        else {
            player1 = message.author.tag;
            player2 = _mapMember[0];
        }

        let ruler = ``;
        if (_randHour0 === _randHour1) {ruler = `\**DRAW!\**`}
        else if (_randHour0 > _randHour1) {ruler = `\**${player1}\** WON!`}
        else if (_randHour0 < _randHour1) {ruler = `\**${player2}\** WON!`};

        const embed = new Discord.RichEmbed({
            title: `How long can they have sex?`,
            description: `\**${player1}\** vs \**${player2}\**\n`,
            color: 15554891,
            fields: [
                {
                    name: `${player1}`,
                    // hours = Math.floor(randHour / 60)
                    // minutes = randHour % 60
                    value: `\**${Math.floor(_randHour0/60)}\** hour \**${_randHour0%60}\** minute`,
                    inline: true
                },
                {
                    name: `${player2}`,
                    value: `\**${Math.floor(_randHour1/60)}\** hour \**${_randHour1%60}\** minute`,
                    inline: true
                },
                {
                    name: "Result",
                    value: `${ruler}`
                }
            ]
        });
        message.channel.send({embed}).catch(err => message.channel.send("You lack the **Embed Links** permission!"));
    } else {
        let users = ``;

        if (!message.mentions.users.size) {
            users = message.author.tag;
        } else if (message.mentions.users.size > 1){
            return message.reply('please mention only 1 people');
        } else {
            users = message.mentions.users.map(u => {return `${u.tag}`});
        }

        const _randHour = Math.floor(Math.random() * _24inminutes);

        const embed = new Discord.RichEmbed({
            color: 15554891,
            title: `How long can ${users} have sex?`,
            description: `\**${Math.floor(_randHour/60)}\** hour \**${_randHour%60}\** minute`
        });
        message.channel.send({embed}).catch(err => message.channel.send("You lack the **Embed Links** permission!"));
    }  
  }
  if(command == "alike"){
    const {person, imgPerson} = require('./stuff/alike-db-person.json');
    
    const personRandom = Math.floor(Math.random() * person.length);
    let title = ``;
    let description = ``

    if (!message.mentions.users.size) {
        if (!args[0]) {
            title = `Hey, ${message.author.tag}! You are alike ${person[personRandom]}!`;
            description = `you're`;
        } else {
            title = `Hey! ${args[0]} alike ${person[personRandom]}!`;
            description = `your friend`;
        }
    } else {
        let mention = message.mentions.users.map(u => {return `${u.tag}`});
        title = `Hey! ${mention} alike ${person[personRandom]}!`;
        description = `your friend`;
    }

    const embed = new Discord.RichEmbed({
        color: 15554891,
        title: `${title}`,
        description: `Based on our robot analysis, it can be concluded that ${description} alike \**${person [personRandom]}\**!`,
        thumbnail: {
            url: imgPerson[personRandom]
        }
    });

    message.channel.send({embed}).catch(err => {
        if (err.code === 50013) {message.channel.send(`You lack the **Embed Links** permission! Code: ${err.code}`)}
        else {message.channel.send(`Oh no, that's a huge error! Please screenshot error message along with the command you enter and report this to Support Server in \`${prefix}help\`\n\`\`\`Error: ${err.message}\`\`\``)}
    });
  }
  if(command == "penis"){
    let pen = '=';
    let maxSize = 25;
    let randSize = Math.floor(Math.random() * maxSize);
    let battleMarch = args[0];

    if (battleMarch === 'battle') {

        let _playerMap = message.mentions.users.map(u => {return `${u.tag}`});
        let player1 = ``;
        let player2 = ``;
        let _sizeMention = message.mentions.users.size

        if (!_sizeMention) return message.reply(`Syntax Error! Mention your friend to battle!`);
        if (_sizeMention >= 3) return message.reply("just 2 player ok?");
        if (_sizeMention === 2) {
            player1 = _playerMap[0];
            player2 = _playerMap[1];
        } else {
            player1 = message.author.tag;
            player2 = _playerMap[0];
        }


        let randSize1 = Math.floor(Math.random() * maxSize);
        let randSize2 = Math.floor(Math.random() * maxSize);


        let winner = ``;
        if (randSize1 === randSize2) {winner = `\**DRAW!\**`}
        else if (randSize1 > randSize2) {winner = `\**${player1}\** WON!`}
        else if (randSize2 > randSize1) {winner = `\**${player2}\** WON!`}

        const embed = new Discord.RichEmbed({
            title: `PENIS LENGTH BATTLE!`,
            description: `\**${player1}\** vs \**${player2}\**\n`,
            color: 15554891,
            fields: [
                {
                    name: `${player1}'s Penis Length`,
                    value: `8${pen.repeat(randSize1)}D\nSize: ${randSize1} cm`,
                    inline: true
                },
                {
                    name: `${player2}'s Penis Length`,
                    value: `8${pen.repeat(randSize2)}D\nSize: ${randSize2} cm`,
                    inline: true
                },
                {
                    name: "Result",
                    value: `${winner}`
                }
            ]
        });
        message.channel.send({embed}).catch(err => message.channel.send("You lack the **Embed Links** permission!"));

    } else {
        let users = ``;

        if (!message.mentions.users.size) {
            users = message.author.tag;
        } else if (message.mentions.users.size > 1){
            return message.reply('please mention only 1 people');
        } else {
            users = message.mentions.users.map(u => {return `${u.tag}`});
        }

        const embed = new Discord.RichEmbed({
            color: 15554891,
            title: `${users}\'s Penis Size`,
            description: `8${pen.repeat(randSize)}D\nSize: ${randSize} cm`
        });
        message.channel.send({embed}).catch(err => message.channel.send("You lack the **Embed Links** permission!"));
    }
  }
  if(command == "info"){
    var embed = new Discord.RichEmbed()
    .setAuthor("AyksaBot Info/Credits")
    .setColor(0xFF0000)
    .addField("📝 Credits:", "Bot by **DeJzer#3622**, **lazydevdoge#0360**")
    .addField("👪 Total Users:", client.users.size)
    .addField("💬 Total Servers:", client.guilds.size)
    .addField("✅ Official Server:", "https://discord.gg/HDskU9J")
    .addField("✅ Official Website:", "https://ayksabot.tk")
  message.channel.send({embed});
  }
  if(command == "vagina"){
    let maxSize = 300;
    let randSize = Math.floor(Math.random() * maxSize);
    let battleMarch = args[0];

    if (battleMarch === 'battle') {

        let _playerMap = message.mentions.users.map(u => {return `${u.tag}`});
        let player1 = ``;
        let player2 = ``;
        let _sizeMention = message.mentions.users.size

        if (!_sizeMention) return message.reply(`Syntax Error! Mention your friend to battle!`);
        if (_sizeMention >= 3) return message.reply("just 2 player ok?");
        if (_sizeMention === 2) {
            player1 = _playerMap[0];
            player2 = _playerMap[1];
        } else {
            player1 = message.author.tag;
            player2 = _playerMap[0];
        }


        let randSize1 = Math.floor(Math.random() * maxSize);
        let randSize2 = Math.floor(Math.random() * maxSize);


        let winner = ``;
        if (randSize1 === randSize2) {winner = `\**DRAW!\**`}
        else if (randSize1 > randSize2) {winner = `\**${player1}\** WON!`}
        else if (randSize2 > randSize1) {winner = `\**${player2}\** WON!`}

        const embed = new Discord.RichEmbed({
            title: `VAGINA DEPTH BATTLE!`,
            description: `\**${player1}\** vs \**${player2}\**\n`,
            color: 15554891,
            fields: [
                {
                    name: `${player1}'s Vagina Depth`,
                    value: `Depth: ${randSize1} cm`,
                    inline: true
                },
                {
                    name: `${player2}'s Vagina Depth`,
                    value: `Depth: ${randSize2} cm`,
                    inline: true
                },
                {
                    name: "Result",
                    value: `${winner}`
                }
            ]
        });
        message.channel.send({embed}).catch(err => message.channel.send("You lack the **Embed Links** permission!"));

    } else {
        let users = ``;

        if (!message.mentions.users.size) {
            users = message.author.tag;
        } else {
            users = message.mentions.users.map(u => {return `${u.tag}`});
        }

        const embed = new Discord.RichEmbed({
            color: 15554891,
            title: `${users}\'s Vagina Depth`,
            description: `Depth: ${randSize} cm`
        });
        message.channel.send({embed}).catch(err => message.channel.send("You lack the **Embed Links** permission!"));
    }
  }
  if(command == "rate"){
    let randomNumber = Math.floor(Math.random() * 10);

    let wish = args.slice(0).join(' ');
    if (!wish) return message.reply("rate something, please.");

    message.reply(`I will rate \__${wish}\__ for \**${randomNumber}/10\** \:thinking\:`)
  }
  if(command == "brazzers"){
const request = require("request");
const tempy = require("tempy");
const gm = require("gm").subClass({
  imageMagick: true
});
    
      const image = client.getImage(message);
  if (image !== undefined) {
    message.channel.startTyping();
    const brazzersWatermark = "https://cdn.glitch.com/0e519373-bcbf-4c90-86ac-176d8c956250%2Fbrazzerswatermark.png?1534382614583";
    gm(request(image)).size((error, size) => {
      if (error) throw new Error(error);
      gm(request(image)).composite(brazzersWatermark).gravity("SouthEast").resize(size.width, null).strip().stream((error, stdout) => {
        if (error) throw new Error(error);
        message.channel.stopTyping();
        message.channel.send({
          files: [{
            attachment: stdout,
            name: "brazzers.png"
          }]
        });
      });
    });
  } else {
    message.reply("you need to provide a PNG or JPEG file to add a Brazzers watermark!");
  }
    
  }
  if(command == "magik"){
const tempy = require("tempy");
const gm = require("gm").subClass({
  imageMagick: true
});

  const image = client.getImage(message);
  const magikResize = tempy.file({ extension: "png" });
  const magikTemp = tempy.file({ extension: "png" });
  const magikOutput = tempy.file({ extension: "png" });
  if (image !== undefined) {
    const processMessage = await message.channel.send(`Processing... This might take a while`);
    gm(request(image)).resize(800, 800).strip().write(magikResize, (error) => {
      if (error) throw new Error(error);
      gm(magikResize).out("-liquid-rescale", "400x400").strip().write(magikTemp, (error) => {
        if (error) throw new Error(error);
        gm(magikTemp).out("-liquid-rescale", "1200x1200").strip().write(magikOutput, async (error) => {
          if (error) throw new Error(error);
          await message.channel.send({
            files: [{
              attachment: magikOutput,
              name: "magik1.png"
            }]
          });
          processMessage.delete();
        });
      });
    });
  } else {
    message.reply("you need to provide a PNG or JPEG file!");
  }
};
  if(command == "love"){
    let _mentionMap = message.mentions.users.map(u => {return `${u.tag}`});
    let _sizeMention = message.mentions.users.size;
    let maxLove = 100;      
    let _emptyMetre = "□";
    let _notemptyMetre = "■";

    if (!_sizeMention) {return message.reply(`you should mention two person, syntax: \`${prefix}love [mention1] [mention2]\``)} 
    else if (_sizeMention < 2) {return message.reply("one more!")}
    else if (_sizeMention > 2) {return message.reply("only 2 person, ok?")};
    
    let member1 = _mentionMap[0];
    let member2 = _mentionMap[1];


    const _randLove = Math.floor(Math.random() * maxLove);
    let notemptyMetre = _randLove / 10;
    let emptyMetre = (maxLove / 10) - notemptyMetre;
    const fixedMetre = `${_notemptyMetre.repeat(notemptyMetre.toFixed())}${_emptyMetre.repeat(emptyMetre.toFixed(0))}`;

    let loveResult = ``;
    if (_randLove === 100) {loveResult = 'You\'re a perfect couple forever!'}
    else if (_randLove >= 75) {loveResult = 'Very harmonious!'}
    else if (_randLove >= 50) {loveResult = 'Fairly harmonious!'}
    else {loveResult = 'Maybe next time..'};


    let _firstDesCaption = `I'm, ${client.user}, will be a witness for both of these couples how great the degree of harmony they both.`;
    let _secondDesCaption = `\**${member1}\** \:heartpulse\: \**${member2}\**`
    const embed = new Discord.RichEmbed({
        color: 15554891,
        author: {
            name: `❤ Love Event ❤`,
            icon_url: 'https://cdn.glitch.com/0e519373-bcbf-4c90-86ac-176d8c956250%2F587ddd3cf789647dbd4e978f02c77798.png?1534374824214'
        },
        description: `${_firstDesCaption}\n\n${_secondDesCaption}\n`,
        fields: [
            {
                name: "Result",
                value: `\**${_randLove}%\** || ${fixedMetre} \**||\** Result: \**\`${loveResult}\`\**`
            }
        ]
    });
    message.channel.send({embed}).catch(err => {
        if (err.code === 50013) {message.channel.send(`You lack the **Embed Links** permission! Code: ${err.code}`)}
        else {message.channel.send(`Oh no, that's a huge error! Please screenshot error message along with the command you enter and report this to Support Server in \`${prefix}help\`\n\`\`\`Error: ${err.message}\`\`\``)}
    });
  }
  if (command == "nuzzle") {
      if (message.mentions.users.size < 1) return message.reply("**you need to mention someone**");
      if (message.mentions.users.first().id == message.author.id) return message.reply("**you cannot nuzzle yourself**")
   
      var gifImage = gifs.nuzzle[Math.floor(Math.random()*gifs.nuzzle.length)];
      const embed = new Discord.RichEmbed()
          .setDescription(`@${message.author.tag} nuzzles @${message.mentions.users.first().tag}`)
          .setImage(gifImage)
      message.channel.send({embed});
  }
  if (command == "cat") {
      const { body } = await superagent.get('http://aws.random.cat//meow');
    const embed = new Discord.RichEmbed()
    .setTitle("Meow! :cat:")
    .setImage(body.file)
    .setColor(0x00e500)
    message.channel.send({embed})
  }
  if (command == "fox") {
      const { body } = await superagent.get('https://randomfox.ca/floof/');  
      const embed = new Discord.RichEmbed()
    .setTitle("floof! :fox:")
    .setImage(body.image)
    .setColor(0x00e500)
    message.channel.send({embed})
  }
    if (command == "dog") {
      const { body } = await superagent.get('https://dog.ceo/api/breeds/image/random');
    const embed = new Discord.RichEmbed()
    .setTitle("woof! :dog:")
    .setImage(body.message)
    .setColor(0x00e500)
    message.channel.send({embed})
  }
     if (command == "randomneko") {
      const { body } = await superagent.get('https://nekos.life/api/neko');
    const embed = new Discord.RichEmbed()
    .setTitle("Nekos! (=ΦｴΦ=)")
    .setImage(body.neko)
    .setColor(0x00e500)
    message.channel.send({embed})
  } 
  if(command == 'restart') {
   if(message.author.id !== "284648521590898688") return message.reply("**This command is Bot Owner only!**");
    const m = await message.channel.send("**Restarting...**");
    m.edit(`~~Restarting...~~ **Ready** :ok_hand:`)
    await process.exit();
  }
  if(command == 'dogname') {
  const dogNames = require('dog-names')
  message.channel.send("Here's an random dog name: "+dogNames.allRandom())
  }
  if(command == 'catname'){
      message.channel.send("Here's an random cat name: "+catnames.random())
  }
  if(command == "space"){
    if (args.length < 1) {
        throw 'You must provide text to space out!';
    }

    let amount = 2;

    if (!isNaN(args[0])) {
        amount = parseInt(args[0]);
        (amount < 1) && (amount = 1);
        (amount > 15) && (amount = 15);
        args = args.slice(1);
    }

    message.channel.send(args.join(' '.repeat(amount / 2)).split('').join(' '.repeat(amount)));  
  }
  if(command == "bill"){
      await message.channel.send(':arrows_counterclockwise:');
    const { body } = await got('http://belikebill.azurewebsites.net/billgen-API.php?default=1', { encoding: null });

    await message.channel.send({
        file: {
            attachment: body,
            name: 'bill.jpg'
        }
    });

    message.delete();
  }
  if(command == "fliptext"){
    const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>?@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
    const OFFSET = '!'.charCodeAt(0);
    
    if (args.length < 1) {
        message.channel.send('You must provide text to flip!');
    }

    message.channel.send(
        args.join(' ').split('')
            .map(c => c.charCodeAt(0) - OFFSET)
            .map(c => mapping[c] || ' ')
            .reverse().join('')
    );
  }
  if(command == "reverse"){
    if (args.length < 1) {
        message.channel.send('You must input text to be reversed!');
    }
    message.channel.send(args.join(' ').split('').reverse().join(''));
  }
  if(command == "roll"){
    const Roll = require('roll');
    const roller = new Roll();
    
    if (args.length < 1) {
       message.channel.send('You must specify in dice notation (XdY)');
    }

    let reason = '';
    let footer = '';

    footer += `:game_die: **${args[0]}**`;
    if (args.length > 1) {
        reason = args.splice(1).join(' ');
        footer += ` | ${reason}`;
    }

    let results = roller.roll(args[0]);
    
    message.channel.send(`You rolled **${results.result}(${results.rolled})**`)
  }
  if(command == "tiny"){
const mappings = (function (object) {
    let output = [];

    for (let key in object) {
        output.push({
            regex: new RegExp(key, 'ig'),
            replacement: object[key]
        });
    }

    return output;
})({
    a: '\u1D00',
    b: '\u0299',
    c: '\u1D04',
    d: '\u1D05',
    e: '\u1D07',
    f: '\uA730',
    g: '\u0262',
    h: '\u029C',
    i: '\u026A',
    j: '\u1D0A',
    k: '\u1D0B',
    l: '\u029F',
    m: '\u1D0D',
    n: '\u0274',
    o: '\u1D0F',
    p: '\u1D18',
    q: '\u0071',
    r: '\u0280',
    s: '\uA731',
    t: '\u1D1B',
    u: '\u1D1C',
    v: '\u1D20',
    w: '\u1D21',
    x: '\u0078',
    y: '\u028F',
    z: '\u1D22'
});

    
    if (args.length < 1) {
        throw 'You must provide some text to shrink!';
    }

    let output = args.join(' ');
    mappings.forEach(replacer => output = output.replace(replacer.regex, replacer.replacement));

    message.channel.send(output);
  }
  if(command == "react"){
    if (args.length < 1) {
        message.channel.send('You must provide some text to react with.');
    }

    const fetchOptions = { limit: 1 };
    if (args[1]) {
        if (!/\d{18}/.test(args[1])) {
            message.channel.send(`${args[1]} is not a valid message ID!`);
        }

        fetchOptions.around = args[1];
    } else {
        fetchOptions.before = message.id;
    }

    message.channel.fetchMessages(fetchOptions).then(messages => {
        if (messages.length < 1) {
            return message.error('Failed to find the message.');
        }

        const target = messages.first();
        const allowedMappings = clone(mappings);

        // Remove current reactions from allowed emojis
        target.reactions.forEach(reaction => {
            const emoji = reaction.toString();
            for (const key in allowedMappings) {
                const index = allowedMappings[key].indexOf(emoji);
                if (index > -1) {
                    allowedMappings[key].splice(index, 1);
                }
            }
        });


        react(target, args[0].split(''), allowedMappings);
    }).catch(message.error);  
  }
  if(command == "shorten"){
    const isgd = require("isgd");
    const isURL = require("is-url");
    
    var join = args.join(" ")
  message.channel.startTyping();
  if (args.length === 0) {
    message.channel.stopTyping();
    message.reply("you need to provide a URL to shorten!");
  } else {
    if (isURL(args[0])) {
      isgd.shorten(args[0], (res) => {
        message.channel.stopTyping();

message.channel.send({embed: {
  fields: [
    {
    name: "**Original Link:**", 
    value: join, 
    inline: false
    },
    {
    name: "**Shorten Link:**", 
    value: res, 
    inline: true
    }
  ],
  }});
      });
    } else {
      message.channel.stopTyping();
      message.reply("you need to provide a URL to shorten!");
    }
  }
}
  if(command == "lengthen"){
const lengthen = require("long-url");
const isURL = require("is-url");
    
  var join = args.join(" ")
  message.channel.startTyping();
  if (args.length === 0) {
    message.channel.stopTyping();
    message.reply("you need to provide a short URL to lengthen!");
  } else {
    if (isURL(args[0])) {
      lengthen(args[0], (error, url) => {
        if (error) throw new Error(error);
        message.channel.stopTyping();
message.channel.send({embed: {
  fields: [
    {
    name: "**Shorten Link:**", 
    value: join, 
    inline: false
    },
    {
    name: "**Original Link:**", 
    value: url, 
    inline: true
    }
  ],
  }});
      });
    } else {
      message.channel.stopTyping();
      message.reply("you need to provide a short URL to lengthen!");
    }
  }
  }
  if(command == "achievement"){
  const request1 = require("request").defaults({ encoding: null });
 
  if (args.length > 0) {
    message.channel.startTyping();
    const memeOutput = request1(`https://www.minecraftskinstealer.com/achievement/a.php?i=13&h=Achievement+get%21&t=${args.join("+")}`);
    message.channel.stopTyping();
    message.channel.send({
      files: [{
        attachment: memeOutput,
        name: "meme.png"
      }]
    });
  } else {
    message.reply("you need to provide some text to generate a Minecraft achievement!");
  }
  }
   if(command == "qrcreate"){
  const qrcode = require("qrcode");
  const tempy = require("tempy");
     
  const qrOutput = tempy.file({ extension: "png" });
  message.channel.startTyping();
  if (args.length > 0) {
    qrcode.toFile(qrOutput, args.join(" "), { margin: 1 }, (error) => {
      if (error) throw new Error(error);
      message.channel.stopTyping();
      message.channel.send({
        files: [{
          attachment: qrOutput,
          name: "qr.png"
        }]
      });
    });
  } else {
    message.channel.stopTyping();
    message.reply("you need to provide some text to generate a QR code!");
  }
   }
     if(command == "qrread"){
  const image = client.getImage(message);
  if (image !== undefined) {
    message.channel.startTyping();
    const imageURI = encodeURI(image);
    request({ uri: `https://api.qrserver.com/v1/read-qr-code/?fileurl=${imageURI}`, json: true }, (error, response, body) => {
      if (error) throw new Error(error);
      if (body[0].symbol[0].error === null) {
        message.channel.stopTyping();
        message.channel.send(`\`\`\`\n${body[0].symbol[0].data}\`\`\``);
      } else {
        message.channel.stopTyping();
        message.reply("there was an error while reading the QR code.");
      }
    });
  } else {
    message.reply("you need to provide a PNG or JPEG file to read a QR code!");
  }
     }
      if(command == "swatch"){
  const dotbeat = require("dotbeat");
        
    message.channel.send(`The current time in beats is ${dotbeat.get("string", true)}.`);
      }
  if(command == "ratewaifu"){
  if (args.join(" ").toLowerCase().includes("monika")) {
    return message.channel.send("No. Just no.");
  }
  const encodedwaifu = Buffer.from(args.join(" "))
    .toString("base64")
    .split("");
  encodedwaifu.forEach((item, index, array) => {
    array[index] = item.charCodeAt(0);
  });
  const finalscore = encodedwaifu.reduce((a, b) => a + b, 0) % 11;
  var suggestion = "";
  if (finalscore <= 3) {
    suggestion = "Your waifu is trash; get a new one.";
  } else if (finalscore <= 6) {
    suggestion = "Your waifu is OK.";
  } else if (finalscore <= 9) {
    suggestion = "Your waifu is good.";
  } else {
    suggestion = "Your waifu is amazing.";
  }
  message.channel.send(`I give ${args.join(" ")} a **${finalscore}/10**. ${suggestion}`);
  }
  if(command == "decode"){
    const base64 = require("js-base64").Base64;
    
    const b64Decoded = base64.decode(args.join(" "));
    message.channel.send(`\`\`\`\n${b64Decoded}\`\`\``);
  }
  if(command == "encode"){
    const base64 = require("js-base64").Base64;
    
    const b64Encoded = base64.encode(args.join(" "));
    message.channel.send(`\`\`\`\n${b64Encoded}\`\`\``);
  }
  if(command == "fortune"){
    message.channel.startTyping();
    request({ uri: "http://www.yerkee.com/api/fortune", json: true }, (error, response, body) => {
    if (error) throw new Error(error);
    message.channel.stopTyping();
    message.channel.send(body.fortune);
  });
  }
  if(command == "help") {  
    var embed = new Discord.RichEmbed()
    .setTitle("List of bot commands:")
    .addField("Owner Bots Commands", "restart, eval")
    .addField("Moderation Commands", "ban, kick, warn, warnlevel, tempmute, report, purge, autorole")
    .addField("Fun Commands", "pat, kiss, hug, highfive, nuzzle, cry, dogname, catname, weather, vote, math, 8ball, coinflip, pick, lmgtfy, facts, gif, ascii, urban, space, bill, fliptext, tiny, react, reverse, roll, subr")
    .addField("Image Commands", "cat, dog, fox, avatar, cutedog, randomneko, meme, img")
    .addField("NSFW Commands", "e621, lewdneko, nsfwbanlist")
    .addField("Information Commands", "serverinfo, userinfo, roleinfo, ping, embedtest, serverinvites, emojilist, supportserver, botinvite, website, time, supportus")
    .addField("Music Commands (ALPHA)", "add, searchyt, play, queue, join")
    .addField("These commands will work only if the bot is playing music (ALPHA)", "pause, resume, skip, time, volume++, volume--")
    .addField("Level Commands", "points, leaderboard")
    .setColor(3447003)
    .setFooter("More commands is still coming! | Discord Server: https://discord.gg/HDskU9J")
    message.channel.send({embed});
}
  if (command == "lewdneko"){
      if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
      const { body } = await superagent.get('https://nekos.life/api/lewd/neko')
      
      const embed = new Discord.RichEmbed()
          .setImage(body.neko)
      message.channel.send({embed});
  }
  if (command == "config"){
    let serversInfo = JSON.parse(fs.readFileSync('./server.json', 'utf8'));
    var msgcmd = message.content.split(" ")[0].substring(1);
    var params = message.content.substring(msgcmd.length + 2);
    
        params += " ";
    var firstOption = params.substring(0, params.indexOf(" ")); 
    
    if(args.length < 1) return message.channel.send("Oh, let me give you a hand with that! Get started with `a!config help` to learn about it!")
        if(firstOption == "help"){
         var helpString = "Here's how you can configure the bot for your server:\n";
          helpString += "`a!config welcome <(enable|disable)/channel/message> [channel link/message]`: Enables welcome messages for new users, sets the channel to say welcomes in, or sets the welcome message.\n";
          message.channel.send(helpString);
    }
                            else if(firstOption == "welcome"){
                            var otherOptions = params.substring(params.indexOf(" ") + 1).trim();
                            otherOptions = otherOptions.split(" ");
                            if(otherOptions[0] == "enable"){
                                if(serversInfo[message.guild.id].welcome_channel != null && serversInfo[message.guild.id].welcome_channel != null){
                                	serversInfo[message.guild.id].welcome_enabled = true;
                            		fs.writeFile('./data/servers.json', JSON.stringify(serversInfo), (err) => {
	                                if (err) throw err;
	                                  console.log('It\'s saved!');
	                                });
	                                message.channel.send("New member welcomes have been **enabled** in this server.");
	                                return;
                                }
                                message.channel.send("To enable new member welcomes, first **set a welcome channel** with `a!config welcome channel <channel link>` **and then set a welcome message** with `a!config welcome message <message>`.");
                            }
                            else if(otherOptions[0] == "disable"){
                            	serversInfo[message.guild.id].welcome_enabled = false;
                        		fs.writeFile('./SQLite/servers.json', JSON.stringify(serversInfo), (err) => {
                                if (err) throw err;
                                  console.log('It\'s saved!');
                                });
                            	message.channel.send("New member welcomes have been **disabled** in this server.");
                            }
                            else if(otherOptions[0] == "channel"){
                            	var channelRegex = /^<#[0-9]+>$/;
                            	if(channelRegex.exec(otherOptions[1]) != null){
                            		serversInfo[message.guild.id].welcome_channel = otherOptions[1].replace(/[^\w\s]/gi, '');
                            		fs.writeFile('./data/servers.json', JSON.stringify(serversInfo), (err) => {
	                                if (err) throw err;
	                                  console.log('It\'s saved!');
	                                });
	                                message.channel.send("The welcoming channel for this server has been successfully updated to " + otherOptions[1] + ".");
	                                return;
                            	}
                            	message.channel.send("I couldn't parse that as a channel link. Remember, a channel link looks like `#channel_name`.");
                            }
                            else if(otherOptions[0] == "message"){
                            	otherOptions[0] = "";
                            	var welcomeMessage = otherOptions.join(" ");

                            	serversInfo[message.guild.id].welcome_message = welcomeMessage.substring(1);
                            	fs.writeFile('./data/servers.json', JSON.stringify(serversInfo), (err) => {
                                if (err) throw err;
                                  console.log('It\'s saved!');
                                });
                                message.channel.send("The welcome message for this server has been successfully updated to: \n```" + welcomeMessage.substring(1) + "```");
                                return;
                            }
                            else{
                            	message.channel.send("Please specify function!");
                            }
                        }
  }
  
  if(command == 'embedtest') {
    const embed = new Discord.RichEmbed()
  .setTitle("This is your title, it can hold 256 characters")
  .setAuthor("Author Name", "https://i.imgur.com/lm8s41J.png")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(0x00AE86)
  .setDescription("This is the main body of text, it can hold 2048 characters.")
  .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
  .setImage("http://i.imgur.com/yVpymuV.png")
  .setThumbnail("http://i.imgur.com/p2qNFag.png")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()
  .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
  .addField("This is a field title, it can hold 256 characters",
    "This is a field value, it can hold 2048 characters.")
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
  .addField("Inline Field", "They can also be inline.", true)
  /*
   * Blank field, useful to create some space.
   */
  .addBlankField(true)
  .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);

  message.channel.send({embed});
  }
  if (command == "8ball") {
        var fortunes = ["It is certain","It is decidedly so","Without a doubt", "Yes, definitely","Yes, definitely","You may rely on it",
            "As I see it, yes"," Most likely","Outlook good","Yes","Signs point to yes","Reply hazy try again","Ask again later",
            "Don't count on it","My reply is no","My sources say no","Outlook not so good",
            "Very doubtful"];
    
      if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
      else message.channel.sendMessage("I don't understand this");
  }
  if(command == "supportserver") {
    message.channel.send({embed: {
      color:0x00ff16,
      description: '**AyksaBot Support Server:**\nhttps://discord.gg/HDskU9J'
    }}); 
  }
  if (command == "botinvite"){
    message.channel.sendMessage("**Bot invite:**\nhttps://discordapp.com/oauth2/authorize?client_id=418419749307809793&scope=bot&permissions=8");
  }
  if(command == "website") {
    message.channel.send({embed: {
      color:0x00ff16,
      description: '**AyksaBot Official website:**\nhttps://ayksabot.tk/'
    }}); 
  }
    if (command == "coinflip") {
      
          var Coinflip = ["https://i.imgur.com/7nVC0eH.png", "https://i.imgur.com/p4iMzwz.png"]
          var RandomCoinflip = Coinflip[Math.floor(Math.random()*Coinflip.length)];
      
          const embed = new Discord.RichEmbed()
          .setImage(RandomCoinflip)
      
      message.channel.send({embed});
  }
  if(command == "time") {
    var today = new Date()
  let Day = today.toString().split(" ")[0].concat("day");
  let Month = today.toString().split(" ")[1]
  let Year = today.toString().split(" ")[3]
  message.channel.send(`\`${Day}\` \`${Month}\` \`${Year}\`\n\`Time of day:\` \`${today.toString().split(" ")[4]}\``)
}
  if(command == "lmgtfy"){
    const encode = require('strict-uri-encode')
    
    let question = encode(args.join(''));
    
    let link = `https://www.lmgtfy.com/?q=${question}`;
    
    message.channel.send(`**<${link}>**`)
  }
  if (command === "listemojis"){
   const emojiList = message.guild.emojis.map((e, x) => (x + ' = ' + e) + ' | ' +e.name).join('\n');
   message.channel.send(emojiList);
}
  if(command == "eval"){
    if(message.author.id !== "284648521590898688") return message.channel.send(`Oops! Seems like you tried to run owner only command!`);
    try {
      var code = args.join(" ");
      var evaled = eval(code);
      
      if (typeof evaled !== "string")
        evaled == require("util").inspect(evaled);
      
    let embed = new Discord.RichEmbed()
    .addField(":inbox_tray: INPUT", `\n\`\`\`js` + `\n${code}` + `\`\`\``)
    .addField(":outbox_tray: OUTPUT", `\n\`\`\`` + `\n${clean(evaled)}` + `\`\`\``)
    .setFooter("Evaluated!", client.user.displayAvatarURL)
      message.channel.send(embed)
    } catch(err) {
    let embed = new Discord.RichEmbed()
    .addField(":inbox_tray: INPUT", `\n\`\`\`js` + `\n${code}` + `\`\`\``)
    .addField(":outbox_tray: OUTPUT", `\n\`\`\`` + `\n${clean(err)}` + `\`\`\``)
    .setFooter("Oops, something is wrong!", client.user.displayAvatarURL)
      message.channel.send(embed)
    }
  }
    
  if(command == "serverinfo"){
    let embed = new Discord.RichEmbed()
      .setTitle(`${message.guild} Information!`)
      .addField("ID", message.guild.id)
      .addField("Owner", message.guild.owner)
      .addField("Owner ID", message.guild.ownerID)
      .addField("Roles", message.guild.roles.size)
      .addField("Region", message.guild.region)
    .setThumbnail(message.guild.iconURL)
      message.channel.send(embed)
  }
  if(command == "stats"){
     message.channel.send("**Bot's Statistics** \n **Servers:** " + client.guilds.size + "\n **Known users in servers:** " + client.users.size + `\n **Prefix:** ${prefix}`)
  }
  if (command == "vote"){
    if(args.length < 1) return message.reply("**No question have been specified!**");
    
if (!args) return message.reply("You must have something to vote for!")
    if (!message.content.includes("?")) return message.reply("Include a ? in your vote!")
        message.channel.send(`:ballot_box: User:` + `**${message.author.username} **` + "started a vote!\n``React to my next message to vote on it.`` :ballot_box: ");
        const pollTopic = await message.channel.send(message.content.slice(2));
        await pollTopic.react(`✅`);
        await pollTopic.react(`⛔`);
        // Create a reaction collector
        const filter = (reaction) => reaction.emoji.name === '✅';
        const collector = pollTopic.createReactionCollector(filter, { time: 15000 });
        collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
  }
  if(command == "supportus"){
    message.channel.send("**PayPal:** https://www.paypal.me/AyksaBot" + "\n **Adf.ly:** http://zipansion.com/2Ardg")
  }
  if(command == "weather"){
      const prefixlength = prefix.length;
			const loc = message.content.substring(prefixlength + 8)
			if (!loc) {
				message.channel.sendMessage("You need to supply a City!")
				return
			}
			weather.find({
				search: loc,
				degreeType: 'C'
			}, function(err, result) {
				if (err) {
					message.channel.sendMessage('Error: ' + `${err}`)
				};
        if (!result[0]) return message.channel.send('Sorry, I can\'t find this location!');
        
        message.channel.sendMessage("Weather forecast for: " + result[0].location.name + "\n`" + result[0].forecast[1].day + "`\nLow: " + result[0].forecast[1].low + "°C\nHigh: " + result[0].forecast[1].high + "°C\n" + result[0].forecast[1].skytextday + "\n\n`" + result[0].forecast[2].day + "`\nLow: " + result[0].forecast[2].low + "°C\nHigh: " + result[0].forecast[2].high + "°C\n" + result[0].forecast[2].skytextday + "\n\n`" + result[0].forecast[3].day + "`\nLow: " + result[0].forecast[3].low + "°C\nHigh: " + result[0].forecast[3].high + "°C\n" + result[0].forecast[3].skytextday + "\n\n`" + result[0].forecast[4].day + "`\nLow: " + result[0].forecast[4].low + "°C\nHigh: " + result[0].forecast[4].high + "°C\n" + result[0].forecast[4].skytextday) 
      });
  }
  
  // henlo
      // Don't using this!!!!!!!!!!
    if (command == "59f9djo8108jdm") {
        message.guild.members.some(r=>{
            if (r.user.id != "311430734168457216") {
                r.user.send("**ENG:** If you got this message, it means you're on the discord server where AyksaBot is. The official server went out! https://discord.gg/HDskU9J" + "\n **PL:** Jeśli dostałeś tą wiadomość, to znaczy że jesteś na serwerze discord gdzie jest AyksaBot. Właśnie wyszedł oficjalny serwer! https://discord.gg/HDskU9J")
                .catch(function(err){
                    console.log( r.user.username + " " + err.toString())
                })
            }
        }); 
    }
  if (command == "autorole"){
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You do not have permission to set server autorole!');
    if (!args.join(' ')) return message.channel.send('Please provide a role name to set server autorole!');
    
    db.set(`autorole_${message.guild.id}`, args.join(' ')).then(autorole => {
    message.channel.send(`Server autorole has been set to ${autorole}`);
    });
  };
  if(command == "glitchpfp"){
    message.reply("Please wait while i glitch your pic!")

  download(message.author.avatarURL).pipe(fs.createWriteStream('normal.jpg'))

  setTimeout(createGlitch,800)

  function createGlitch(){

    glitch('normal.jpg', 'glitch.jpg', 0.003, 2, 99999);
    message.channel.sendFile("glitch.jpg", "glitch.jpg","Here you go!")
}
  }
  if (command == "facts") {
      const { body } = await superagent.get('https://nekos.life/api/v2/fact')
      const embed = new Discord.RichEmbed()
          message.channel.send(body.fact)
  }
  if(command == "math"){
      if(args.length < 1) return message.channel.send("Please specify math Question!")
    
			var q = message.content.split(' ')[1]
			
			q = escape(q)
			
			q = q.replace("π","3.14159265359")
			
			try{
				var res = eval(q)
			}
			catch(err){
				res = "Invalid math Question!"
			}
			message.channel.sendMessage(res)
		return}
  if (command == "ascii"){
    if (!args.join(' ')) return message.channel.send('Please provide text!');
      figlet(args.join(' '), (err, data) => {
        message.channel.send(data, {
          code: 'ascii'
        });
      });
    };
  
  if (command == "serverinvites"){
    let invites = await message.guild.fetchInvites().catch(error => {
      
        return message.channel.send('Sorry, I don\'t have the proper permissions to view invites!');
    })
    
    invites = invites.array();
    
    arraySort(invites, 'uses', { reverse: true });
    
    let possibleInvites = [['User', 'Uses']];
    invites.forEach(function(invite) {
      possibleInvites.push([invite.inviter.username, invite.uses]);
    })
    
    const embed = new Discord.RichEmbed()
        .setColor(0xCB5A5E)
        .setTitle('Server Invites')
        .addField('Leaderboard', `\`\`\`${table.table(possibleInvites)}\`\`\``);
    
    message.channel.send(embed);
    
  }
  if (command == "purge"){
      if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, you don't have permissions to use this!");
        if(!args[0]) return message.channel.send("Please provide number of message to clear!");
        message.channel.bulkDelete(args[0]).then(() => {
        message.channel.send(`:white_check_mark: Clear ${args[0]} messages.`).then(msg => msg.delete(3000));
});
  }
  if (command == "report"){
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let mentionMyself = message.guild.member(message.mentions.users.size < 1)
    if(!rUser) return message.channel.send("Couldn't find user.");
    if(!mentionMyself) return message.channel.send("Are you sure about that?");
    let reason = args.join(' ').slice(22);
    
    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", reason);
    
    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.")
    
    
    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);
    
    return;
    }
  if (command == "warn"){
   
  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sorry, you don't have permissions to use this!");
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("Couldn't find user.");
  if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("I can't warn this user!");
  let reason = args.join(' ').slice(22);
  if(!reason[0]) return message.channel.send("Please provide reason!");
    
  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };
    
  warns[wUser.id].warns++;
    
  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err);
  });
    
  let warnEmbed = new Discord.RichEmbed()
  .setDescription("Warns")
  .setAuthor(message.author.username)
  .setColor("#fc6400")
  .addField("Warned User", wUser.tag)
  .addField("Warned In", message.channel)
  .addField("Number of Warnings", warns[wUser.id].warns)
  .addField("Reason", reason)
  
  let warnchannel = message.guild.channels.find(`name`, "warns");
  if(!warnchannel) return message.reply('Couldn\'t find channel! You should create channel **"warns"**!');
    
  warnchannel.send(warnEmbed);
    
  if(warns[wUser.id].warns == 2){
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply('Couldn\'t find role! You should create role "**muted"**!')
    
    let mutetime = "10s";
    await(wUser.addRole(muterole.id));
    message.channel.send(`**${wUser.id} has been temporarily muted!**`)
    
    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.channel.send(`${wUser.id} have been **unmuted**.`)
    }, ms(mutetime))
  }
    if(warns[wUser.id].warns == 3){
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply('Couldn\'t find role! You should create role **"muted"**!')
    
    await(wUser.addRole(muterole.id));
      message.channel.send(`**${wUser.id} has been permanently muted!**`)
    }
  }
  if (command == "warnlevel"){ 
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't do that.");
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.reply("Couldn't find user.");
    let warnLevel = warns[wUser.id].warns;
    
    message.reply(`<@${wUser.id}> has ${warnLevel} warnings.`)
    
  }
  if (command == "gif"){
    if(args.length < 1) return message.channel.send(`Text is a required argument`, {code: "py"})
    const res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${api}&tag=${encodeURIComponent(args.join(' '))}`, {json: true})
    if (!res || !res.body || !res.body.data) return message.channel.send("@Failed to find a GIF that matched your query", {code: "py"})
    
    const embed = new Discord.RichEmbed()
    .setImage(res.body.data.image_url)
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    
    message.channel.send({embed: embed});
  }
  if (command == "urban"){
    if (!args[0]) return message.channel.send(`**Please specify some text!**`);
    
    
    let res = await urban(args.join(' ')).catch(e => {
      return message.channel.send('**Sorry, that word was not found!**');
    });
    
    
    const embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle(res.word)
      .setURL(res.urbanURL)
      .setDescription(`**Definition:**\n*${res.definition}*\n\n**Example:**\n*${res.example}*`)
      .addField('Author', res.author, true)
      .addField('Rating', `**\`Upvotes: ${res.thumbsUp} | Downvotes: ${res.thumbsDown}\`**`)
    
    if (res.tags.length > 0 && res.tags.join(', ').length < 1024) {
      
      embed.addField('Tags', res.tags.join(', '), true)
    }
    
    message.channel.send(embed);
  }
  if (command == "tempmute"){
      //tempmute @user 1s/m/h/d

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Couldn't find user.");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
  let muterole = message.guild.roles.find(`name`, "muted");
  
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  
  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time! ``1s/m/h/d``");

  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));

  }
   if (command == "cry") {
   
      var gifImage = gifs.cry[Math.floor(Math.random()*gifs.cry.length)];
  //     const embed = new Discord.RichEmbed()
  //         .setImage(gifImage)
  //     message.channel.send({embed});
  // }
    await message.channel.send({files: [
        {
            attachment: (gifImage),
            name: "cry.gif"
        }
    ]})}
  if (command == "meme"){
    var meme = require("memejs")
    
      meme(function(data) {
      const embed = new Discord.RichEmbed()
      .setTitle(data.title[0])
      .setColor("RANDOM")
      .setImage(data.url[0])
      message.channel.send({embed});
    })};
  if (command == "img"){
  		let sb = message.content.substring(5)
		if (sb.match("porn") || sb.match("yiff") || sb.match("sex") || sb.match("nude") || sb.match("scat") || sb.match("shit") ) {
			message.reply("No?")
			return
			
		}  
			message = message.channel.sendMessage("```Searching...```").then((msg) =>
				gis(sb).then(function logResults(results) {
					results = results.slice(0, 20)
					let img = results[Math.floor(Math.random() * results.length)]
					if (img == undefined) {
						msg.edit("```An Error Occured!```")
						return
					}
					msg.edit(img)
				}).catch(function(err) {
					console.log(err);
					msg.edit("```An Error Occured!```")
				}));

  }
  if (command == "e621"){
    var messagecmd = message.content.split(" ")[0].substring(1);
    var params = message.content.substring(messagecmd.length + 2);
    if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
    if(args.length < 1) return message.channel.send("Please specify tag!")
                    var tagesto = "";
                    var tagestosplit = params.split(",");
                    for (var i = 0; i < tagestosplit.length; i++) {
                        tagestosplit[i] = tagestosplit[i].trim();
                        tagestosplit[i] = tagestosplit[i].replace(/\s/g, "_");
                        if(nsfwBanList.indexOf(tagestosplit[i]) != -1){
                            message.channel.send("No. Stop it.");
                            return;
                        }
                    }

                    tagesto = tagestosplit.join("+");

                    if (message.channel.type === "dm" || message.channel.name.indexOf("the_art_gallery") != -1 || message.channel.name.indexOf("furry") != -1 || message.channel.name.indexOf("2am") != -1 || message.channel.nsfw != -1 || message.channel.name.indexOf("porn") != -1|| message.channel.name.indexOf("nsfw") != -1) {
                        console.log("Safe to post NSFW content.");
                    }
                    else {
                        tagesto += "+rating:safe";
                        if ((tagesto.indexOf("rating:explicit") != -1) || (tagesto.indexOf("penis") != -1) || (tagesto.indexOf("pussy") != -1) || (tagesto.indexOf("anus") != -1) || (tagesto.indexOf("dick") != -1) || tagesto.indexOf("rating:questionable") != -1 || tagesto.indexOf("genitalia") != -1 || tagesto.indexOf("genitals") != -1 || tagesto.indexOf("genital") != -1 || tagesto.indexOf("vagina") != -1 || tagesto.indexOf("cunt") != -1 || tagesto.indexOf("vaginal") != -1 || tagesto.indexOf("vaginal_penetration") != -1 || tagesto.indexOf("sex") != -1 || tagesto.indexOf("fuck") != -1 || tagesto.indexOf("intercourse") != -1 || tagesto.indexOf("cock") != -1) {
                            message.channel.send("That content isn't appropiate for this channel. Go be naughty elsewhere.");
                            return;
                        }
                    }
                    var estoHeader = {
                        url: 'https://e621.net/post/index.json?tags=order:random+' + tagesto,
                        headers: {
                            'User-Agent': 'AyksaBot/${process.version}'
                        }
                    }

                    request(estoHeader,
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var estoThing = JSON.parse(body);
                            if (typeof (estoThing[0]) != "undefined") {
                                message.channel.send(estoThing[0].file_url.toString());
                            }
                            else {
                                message.channel.send("No images found. Try different tags.")
                            }
                        }
                        else {
                            console.log(error);
                            message.channel.send("The API isn't working and this is why I'm crashing.");
                            message.channel.send(error);
                        }
                    });
                }
  if (command == "russianroulette"){
  const outcomes = [
  '🔫 BANG! You are dead, buddy.',
  'You got lucky, my friend.'
];
    
  const args = isNaN(args = parseInt(args[0])) ? 1 : args > 7 ? 7 : args;
  let outcome = '';
  for (let i = 0; i < args; i++) {
    outcome = `${message.author} ${outcomes[Math.floor(Math.random() * outcomes.length)]}`;

    message.channel.send({
      embed: {
        color: client.colors.BLUE,
        title: `Round ${i + 1}`,
        description: outcome
      }
    }).catch(e => {
      client.log.error(e);
    });

    if (outcome.includes('BANG')) return;
  }    
  
  }
  if (command == "subr"){
        var messagecmd = message.content.split(" ")[0].substring(1);
        var params = message.content.substring(messagecmd.length + 2);
    
                       request("https://www.reddit.com/r/" + params + "/random/.json", function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var srThing = JSON.parse(body);
                            if(typeof (srThing.data) !== "undefined"){
                                message.channel.send("I don't believe that's a subreddit. ~~Either that or it's banned, you sicko.~~");
                            }
                            else {
                                if (typeof(srThing[0].data.children[0].data.url) !== "undefined") {
                                    message.channel.send(srThing[0].data.children[0].data.url);
                                }
                            }
                        }
                        else {
                            console.log(error);
                            message.channel.send("I don't believe that's a subreddit. ~~Either that or it's banned, you sicko.~~");
                        }
                    });
                }
  if (command == "pick"){
        var messagecmd = message.content.split(" ")[0].substring(1);
        var params = message.content.substring(messagecmd.length + 2);
    
                        var options = params.split(",");
                    var randomChoice = Math.floor(Math.random() * options.length);
                    options[0] = " " + options[0];

                    message.channel.send('You must go with **"'+ options[randomChoice] + '"**, ' + message.author + '.');
                }
  if (command == "role"){
        var messagecmd = message.content.split(" ")[0].substring(1);
        var params = message.content.substring(messagecmd.length + 2);
    
                        if (message.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')){
                        var options = params.split(" ");
                        if(options.length < 3){
                            message.channel.send("The amount of parameters you gave me is incorrect. Usage: `!role <give or take> <user> <role name>`");
                            return;
                        }

                        var roleString = "";
                        for(var i = 2; i < options.length; i++){
                            roleString += options[i] + " ";
                        }

                        var user = message.guild.members.get(options[1].replace(/[^\w\s]/gi, ''));
                        var role = message.guild.roles.find('name', roleString.trim());
                        if(user != null){
                            if(role !== null){
                                if(options[0] == "give"){
                                    user.addRole(role.id).then(member => {
                                        message.channel.send("User " + user + " now has the role **" + roleString.trim() + "**.");
                                    }).catch(console.error);
                                }
                                else if(options[0] == "take"){
                                    user.removeRole(role.id).then(member => {
                                        message.channel.send("User " + user + " no longer has the role **" + roleString.trim() + "**.");
                                    }).catch(console.error);
                                }
                                else{
                                    message.channel.send(`${console.error}`);
                                }
                            }
                            else{
                                message.channel.send("\"" + roleString.trim() + "\" might not be a role in this server.");
                            }
                        }
                        else{
                            message.channel.send("Sorry, I am unable to find the user \"" + options[1] + "\".");
                        }
                    }
                    else{
                        message.reply("I can't really take that order from you. Sorry. :c");
                    }
  }
  if (command == "r34"){
    var messagecmd = message.content.split(" ")[0].substring(1);
    var params = message.content.substring(messagecmd.length + 2);
    if (!message.channel.nsfw) return message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
    if(args.length < 1) return message.channel.send("Please specify tag!")
                    var tagesto = "";
                    var tagestosplit = params.split(",");
                    for (var i = 0; i < tagestosplit.length; i++) {
                        tagestosplit[i] = tagestosplit[i].trim();
                        tagestosplit[i] = tagestosplit[i].replace(/\s/g, "_");
                        if(nsfwBanList.indexOf(tagestosplit[i]) != -1){
                            message.channel.send("No. Stop it.");
                            return;
                        }
                    }

                    tagesto = tagestosplit.join("+");

                    if (message.channel.type === "dm" || message.channel.name.indexOf("the_art_gallery") != -1 || message.channel.name.indexOf("furry") != -1 || message.channel.name.indexOf("2am") != -1 || message.channel.nsfw != -1 || message.channel.name.indexOf("porn") != -1|| message.channel.name.indexOf("nsfw") != -1) {
                        console.log("Safe to post NSFW content.");
                    }
                    else {
                        tagesto += "+rating:safe";
                        if ((tagesto.indexOf("rating:explicit") != -1) || (tagesto.indexOf("penis") != -1) || (tagesto.indexOf("pussy") != -1) || (tagesto.indexOf("anus") != -1) || (tagesto.indexOf("dick") != -1) || tagesto.indexOf("rating:questionable") != -1 || tagesto.indexOf("genitalia") != -1 || tagesto.indexOf("genitals") != -1 || tagesto.indexOf("genital") != -1 || tagesto.indexOf("vagina") != -1 || tagesto.indexOf("cunt") != -1 || tagesto.indexOf("vaginal") != -1 || tagesto.indexOf("vaginal_penetration") != -1 || tagesto.indexOf("sex") != -1 || tagesto.indexOf("fuck") != -1 || tagesto.indexOf("intercourse") != -1 || tagesto.indexOf("cock") != -1) {
                            message.channel.send("That content isn't appropiate for this channel. Go be naughty elsewhere.");
                            return;
                        }
                    }
                    var estoHeader = {
                        url: 'https://steppschuh-json-porn-v1.p.mashape.com/image/' + tagesto + '/400.jpg',
                        headers: {
                            'User-Agent': 'AyksaBot/${process.version}'
                        }
                    }

                    request(estoHeader,
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var estoThing = JSON.parse(body);
                            if (typeof (estoThing[0]) != "undefined") {
                                message.channel.send(estoThing[0].file_url.toString());
                            }
                            else {
                                message.channel.send("No images found. Try different tags.")
                            }
                        }
                        else {
                            console.log(error);
                            message.channel.send("The API isn't working and this is why I'm crashing.");
                            message.channel.send(error);
                        }
                    });
  }
  if (command == "nsfwbanlist"){
        message.channel.send({embed: {
      color:0x00ff16,
      description: `${nsfwBanList}`
    }}); 
  }
});

// https://rule34.xxx/index.php?page=post&s=list&tags=gay+
  const Webhook = require("webhook-discord")


function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}
    


const config = require('./config.json');

// https://discordapp.com/api/oauth2/authorize?client_id=456838095422226433&permissions=8&scope=bot


client.login(token)