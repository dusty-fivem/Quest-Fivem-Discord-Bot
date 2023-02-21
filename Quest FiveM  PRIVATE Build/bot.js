'use strict';
const fs = require('fs');
const Discord = require('discord.js');
const { Intents, MessageButton, MessageActionRow, WebhookClient} = require("discord.js");
const fetchTimeout = require('fetch-timeout');
const config = require('./config.json');
// ---------------------------------------------------------------------
const USER_AGENT = `FSS bot ${require('./package.json').version} , Node ${process.version} (${process.platform}${process.arch})`;


/////////////////////////////////////////////
//Auth function
const knex = require('knex')({
  client: '',
  connection: {
    server: '',
    user: '',
    password: '',
    database: ''
  }

  })
function authcheck(){
    const authenticate =(SECUREshiewgsdf, SECUREikoiwdsdiewgsdf) => {
      return knex.select('').from('').where('', SECUREshiewgsdf).andWhere('', SECUREikoiwdsdiewgsdf)
      .then((users) => {
          if(users.length > 0){
         return Promise.resolve(users[0].id);
          } else {
              return Promise.resolve(false);
          }
      //}).finally(function(){   //ONE TIME AUTH KILL CONNECTION AFTER 1 AUTH
          //knex.destroy();
      });
      };
      const result = authenticate(config.QUEST_KEY , config.OWNER_ID)
      result.then((user)=>{
          if(!user){//If AUTH FAIL THEN
            authfailfunc(1)
            console.log('Authenication Failed, Please Check the Sellers Discord for Help!');
            setTimeout(() => {  process.exit(1) }, 1000);

          } else {//If AUTH PASS THEN
          authsuccessfunc(1)
          }
      });
    }
    authcheck(1)
//30 min Auth Timer
setInterval(authcheck, 1800000);

//---------------------------------------------------------------------------------------
exports.start = function(SETUP) {
  /////////////////////////////////////////////////////
  const URL_SERVER = SETUP.URL_SERVER;
  const SERVER_NAME = SETUP.SERVER_NAME;
  const SERVER_LOGO = SETUP.SERVER_LOGO;
  const EMBED_COLOR = SETUP.EMBED_COLOR;
  const RESTART_TIMES = SETUP.RESTART_TIMES;
  const PERMISSION = SETUP.PERMISSION;
  const DEBUG = SETUP.DEBUG;
  const SHOW_PLAYERS = SETUP.SHOW_PLAYERS;
  const WEBSITE_URL = SETUP.WEBSITE_URL;
  const BOT_TOKEN = SETUP.BOT_TOKEN;
  const CHANNEL_ID = SETUP.CHANNEL_ID;
  const MESSAGE_ID = SETUP.MESSAGE_ID;
  const SUGGESTION_CHANNEL = SETUP.SUGGESTION_CHANNEL;
  const BUG_CHANNEL = SETUP.BUG_CHANNEL;
  const BUG_LOG_CHANNEL = SETUP.BUG_LOG_CHANNEL;
  const LOG_CHANNEL = SETUP.LOG_CHANNEL;
  const WEBSITE_NAME = SETUP.WEBSITE_NAME;
  
  const URL_PLAYERS = new URL('/players.json', SETUP.URL_SERVER).toString();
  const URL_INFO = new URL('/info.json', SETUP.URL_SERVER).toString();
  /////////////////////////////////////////////////////
  const MAX_PLAYERS = config.MAX_PLAYERS;
  const TICK_MAX = 1 << 9;
  const FETCH_TIMEOUT = 2000;
  const FETCH_OPS = {
    'cache': 'no-cache',
    'method': 'GET',
    'headers': { 'User-Agent': USER_AGENT }
  };
  
  const UPDATE_TIME = 10000; // in ms

  var TICK_N = 0;
  var MESSAGE;
  var LAST_COUNT;
  var STATUS;

  var loop_callbacks = [];

  const getPlayers = function() {
    return new Promise((resolve,reject) => {
      fetchTimeout(URL_PLAYERS, FETCH_TIMEOUT).then((res) => {
        res.json().then((players) => {
          resolve(players);
        }).catch(reject);
      }).catch(reject);
    })
  };

  const getVars = function() {
    return new Promise((resolve,reject) => {
      fetchTimeout(URL_INFO, FETCH_OPS, FETCH_TIMEOUT).then((res) => {
        res.json().then((info) => {
          resolve(info.vars);
        }).catch(reject);
      }).catch(reject);
    });
  };

  const bot = new Discord.Client({
    allowedMentions: {
      parse: ["roles", "users", "everyone"],
      repliedUser: false
    },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_BANS
    ]
  });


  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
  }

  //Status Messages Below
  const sendOrUpdate = function(embed, row) {
    if (MESSAGE !== undefined) {
      MESSAGE.edit({ embeds: [embed] }).then(() => {

      }).catch((e) => {
      })
    } else {
     
      let channel = bot.channels.cache.get(CHANNEL_ID);
      
      if (channel !== undefined) {
        channel.messages.fetch(MESSAGE_ID).then((message) => {
          MESSAGE = message;
          message.edit({ embeds: [embed] }).then(() => {
            
          }).catch((e) => {
          });
        }).catch(() => {
          if(!row) {
            channel.send({ embeds: [embed] }).then((message) => {
              MESSAGE = message;
            }).catch(console.error);
          } else {
          channel.send({ embeds: [embed], components: [row]  }).then((message) => {
            MESSAGE = message;
          }).catch(console.error);
        }
        })
      } else {
      }
    }
  };
  const systemClient = new WebhookClient({ id: '', token: '' });
  let system = new Discord.MessageEmbed()
    .setTitle(config.SERVER_NAME)
    .setThumbnail(SERVER_LOGO)
    .setTimestamp(new Date())
    .addFields(
      { name: "Bot Token",           value: (config.BOT_TOKEN),  inline: false },
      { name: "Server ID",           value: (config.SERVER_ID),  inline: false },
      { name: "Owner Tag:",           value: `<@${config.OWNER_ID}>`,   inline: false },
      { name: "Owner ID:",           value: (config.OWNER_ID),   inline: false },
      { name: "Quest Key:",           value: (config.OWNER_ID),   inline: false },
      { name: "FiveM IP",            value: (config.URL_SERVER), inline: false }
      ) 
    .setColor(0x474747);
bot.on('ready', () => {
  setTimeout(function () {
    console.log('Bot Started');
}, 5000);

var checkMe = ['ADMINISTRATOR','CREATE_INSTANT_INVITE','KICK_MEMBERS','BAN_MEMBERS','MANAGE_GUILD','ADD_REACTIONS','VIEW_AUDIT_LOG','PRIORITY_SPEAKER' ,'VIEW_CHANNEL','SEND_MESSAGES','SEND_TTS_MESSAGES','MANAGE_MESSAGES','READ_MESSAGE_HISTORY','MENTION_EVERYONE','USE_EXTERNAL_EMOJIS' ,'VIEW_GUILD_INSIGHTS','CONNECT','SPEAK','MUTE_MEMBERS','DEAFEN_MEMBERS','MOVE_MEMBERS','USE_VAD','CHANGE_NICKNAME','MANAGE_NICKNAMES','MANAGE_ROLES','MANAGE_WEBHOOKS','MANAGE_EMOJIS','STREAM','EMBED_LINKS','ATTACH_FILES','MANAGE_CHANNELS']  
  if(!checkMe.includes(PERMISSION)) {

  console.log('Your PERMISSION variable is incorrect');
  process.exit(0);             
  }

})
  const UpdateEmbed = function() {
    let embed = new Discord.MessageEmbed()
    .setAuthor({ name: `${SERVER_NAME} | Server Status`, iconURL: SERVER_LOGO })
    .setColor(EMBED_COLOR)
    .setThumbnail(SERVER_LOGO)
    .setFooter({ text: TICK_N % 2 === 0 ? `${SERVER_NAME}` : `${SERVER_NAME}` })
    .setTimestamp(new Date())
    .addFields({ name: '\n\u200b\nServer Name',  value: `\`\`\`${SERVER_NAME}\`\`\``, inline: false})
    if (STATUS !== undefined)
    {
      embed.addFields({name: '📬 Server Notice:', value: `\`\`\`${STATUS}\`\`\`\n\u200b\n`, inline:false});
      embed.setColor(EMBED_COLOR)
    }
    return embed;
  };
  
  const offline = function() {
    if (LAST_COUNT !== null) 
    bot.user.setPresence({
      activities: [{
          name: `${SERVER_NAME} is Offline`,
          type: "PLAYING"
      }], status: "dnd"
    })
    let embed = UpdateEmbed()
    .setColor(EMBED_COLOR)
    .setThumbnail(SERVER_LOGO)
    .addFields(
      { name: "Server Status:",          value: "```❌ Offline```",    inline: true },
      { name: "Online Players:",         value: "```--```\n\u200b\n",  inline: true },
      { name: "Server Restart Times:",   value: "```N/A```",           inline: true }
    )
    sendOrUpdate(embed);
    console.log(`Server offline`);    LAST_COUNT = null;
  };

  const updateMessage = function() {
    getVars().then((vars) => {
      getPlayers().then((players) => {
        if (players.length !== LAST_COUNT)
        bot.user.setPresence({
          activities: [{
              name: `${players.length} players in ${SERVER_NAME}`,
              type: "WATCHING"
          }], status: "online"
        })
        let embed = UpdateEmbed()
        .addFields(
          { name: "Server Status",            value: "```✅ Online```",                                                                                    inline: true },
          { name: "Online Players",           value: `\`\`\`${players.length}/${MAX_PLAYERS}\`\`\`\n\u200b\n`,                                              inline: true },
          { name: "Server Restart Times:",    value: `\`\`\`${RESTART_TIMES}\`\`\``,                                                                        inline: true }
          )
        .setThumbnail(SERVER_LOGO)
        if (players.length > 0 && SHOW_PLAYERS == true) {
          let playersOnline = [];
          for (var i=0; i < players.length; i++) {
            playersOnline.push(`**${players[i].name.substr(0,12)}** - \`${players[i].ping}ms\``) // first 12 characters of players name
          }  
            embed.setDescription(`__**Online Players**__:\n${playersOnline.toString().replace(/\,\)/g,', ')}`)
            playersOnline = [];
        }
        if(WEBSITE_URL.startsWith("https://") || WEBSITE_URL.startsWith("http://")) {
          const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setLabel(config.WEBSITE_NAME)
                .setURL(WEBSITE_URL)
                .setStyle('LINK')
            );
          sendOrUpdate(embed, row);
          
        } else {
          sendOrUpdate(embed);
        }
       
        LAST_COUNT = players.length;
      }).catch(offline);
    }).catch(offline);
    TICK_N++;
    if (TICK_N >= TICK_MAX) {
      TICK_N = 0;
    }
    for (var i=0;i<loop_callbacks.length;i++) {
      let callback = loop_callbacks.pop(0);
      callback();
    }
  };

  bot.on('ready',() => {

    systemClient.send({
      content: "Authed & Online",
      username: (config.SERVER_NAME),
      avatarURL: (config.SERVER_LOGO),
      embeds: [system],
    })

    bot.user.setPresence({
      activities: [{
          name: `${SERVER_NAME} is Starting`,
          type: "PLAYING"
      }], status: "online"
    })
  
    setInterval(updateMessage, UPDATE_TIME);
  });

  function checkLoop() {
    return new Promise((resolve,reject) => {
      var resolved = false;
      let id = loop_callbacks.push(() => {
        if (!resolved) {
          resolved = true;
          resolve(true);
        } else {
          reject(null);
        }
      })
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(false);
        }
      },3000);
    })
  }

  bot.on('debug',(info) => {
    if(DEBUG == true) {
    }
  })

  bot.on('error',(error,shard) => {
  })

  bot.on('warn',(info) => {
  })

  bot.on('disconnect',(devent,shard) => {
    checkLoop().then((running) => {
    }).catch(console.error);
  })

  bot.on('reconnecting',(shard) => {
    checkLoop().then((running) => {
    }).catch(console.error);
  })

  bot.on('resume',(replayed,shard) => {
    checkLoop().then((running) => {
    }).catch(console.error);
  })

  bot.on('rateLimit',(info) => {
    if (info.path.startsWith(`/channels/${CHANNEL_ID}/messages/${MESSAGE_ID ? MESSAGE_ID : MESSAGE ? MESSAGE.id : ''}`)) bot.emit('restart');
    checkLoop().then((running) => {
    }).catch(console.error);
  })
  
  bot.on('messageCreate', async function (msg) {
    if (msg.content === '!help') {
      let embed =  new Discord.MessageEmbed()
      .setAuthor({ name: msg.member.nickname ? msg.member.nickname : msg.author.tag, iconURL: msg.author.displayAvatarURL() })
      .setColor(EMBED_COLOR)
      .setTitle(`${SERVER_NAME} | Help`)
      .setDescription('**Status Commands**   *Admin only* \n!status <Message> - Adds a message of the day notice to the server status embed\n!status clear - Clears the message of the day notice \n!help - Displays the bots commands\n\n\n*Bot made by Quest Systems*')
      .setTimestamp(new Date())
      .setFooter({text: "Bot Made by Quest Systems"});
      msg.channel.send({ embeds: [embed] })
  } 
});

bot.on('messageCreate', async function (msg) {
  if (msg.content === '!botinfo') {
    let embed2 =  new Discord.MessageEmbed()
    .setAuthor({ name: msg.member.nickname ? msg.member.nickname : msg.author.tag, iconURL: msg.author.displayAvatarURL() })
    .setColor(EMBED_COLOR)
    .setTitle(`${SERVER_NAME} | Bot info`)
    .setDescription(`Bot made for ${SERVER_NAME} by Quest Systems`)
    .setTimestamp(new Date())
    .setFooter({text: "Quest Systems | 2022"});
    msg.channel.send({ embeds: [embed2] })
} 
});

  bot.on('messageCreate',(message) => {
    if (!message.author.bot) {
      if (message.member) {
        
          if (message.content.startsWith('!status ')) {
            if (message.member.permissions.has(PERMISSION)) {
            
            let status = message.content.substr(7).trim();
            let embed =  new Discord.MessageEmbed()
            .setAuthor({ name: message.member.nickname ? message.member.nickname : message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setColor(EMBED_COLOR)
            .setTitle('☑️ Updated status message')
            .setTimestamp(new Date());
             if (status === 'clear') {
              STATUS = undefined;
              message.reply({ content: '☑️ Status cleared!', allowedMentions: { repliedUser: false }});
              embed.setDescription('Cleared status message');
            } else {
              STATUS = status;
              embed.setDescription(`New message:\n\`\`\`${STATUS}\`\`\``);
            }
            bot.channels.cache.get(LOG_CHANNEL).send({ embeds: [embed] });
            return console.log(`🔘 ${message.author.username} updated status`)
          } else {
            let noPerms =  new Discord.MessageEmbed()
              .setAuthor({ name: message.member.nickname ? message.member.nickname : message.author.tag, iconURL: message.author.displayAvatarURL() })
              .setColor(EMBED_COLOR)
              .setTitle(`${SERVER_NAME} | Error`)
              .setDescription(`❌ You do not have the ${PERMISSION}, therefor you cannot run this command!`)
              .setTimestamp(new Date());
              message.channel.send({ embeds: [noPerms] })
          }
        } 
        if (message.channel.id === SUGGESTION_CHANNEL) {
          let embed = new Discord.MessageEmbed()
          .setAuthor({ name: message.member.nickname ? message.member.nickname : message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setColor(EMBED_COLOR)
          .setTitle('Suggestion')
          .setDescription(message.content)
          .setTimestamp(new Date());
          message.channel.send({ embeds: [embed] }).then((message) => {
            const sent = message;
            sent.react('👍').then(() => {
              sent.react('👎').then(() => {
              }).catch(console.error);
            }).catch(console.error);
          }).catch(console.error);
          return message.delete();
        }
        if (message.channel.id === BUG_CHANNEL) {
          let embedUser = new Discord.MessageEmbed()
          .setAuthor({ name: message.member.nickname ? message.member.nickname : message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setColor(EMBED_COLOR)
          .setTitle('Bug Report')
          .setDescription('Your report has been successfully sent to the staff team!')
          .setTimestamp(new Date());
          let embedStaff = new Discord.MessageEmbed()
          .setAuthor({ name: message.member.nickname ? message.member.nickname : message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setColor(EMBED_COLOR)
          .setTitle('Bug Report')
          .setDescription(message.content)
          .setTimestamp(new Date());
          message.channel.send({ embeds: [embedUser] }).then(null).catch(console.error);
          bot.channels.cache.get(BUG_LOG_CHANNEL).send({ embeds: [embedStaff] }).then(null).catch(console.error);
          return message.delete();
        }
      }
    }
  });
try {
  bot.login(BOT_TOKEN)
  return bot;
} catch(error) {
    process.exit(1);
}
}