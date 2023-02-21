const { Client, MessageEmbed } = require ("discord.js") // require the discord.js wrapper
const config = require("./config.json");
const client = new Client({
  intents: ["GUILDS","GUILD_MEMBERS","GUILD_MESSAGES"]
})

client.once("ready", () => {
  
 
});

client.once("ready", () => {
  if(config.ROLE_ON_JOIN == true) {
  }
 
});

client.on("guildMemberAdd", async (member) => {
  const guild = member.guild;
  

  let channel = guild.channels.cache.get(config.WELCOME_CHANNEL)
  let welcome = new MessageEmbed()
  .setTitle('New User Has Joined!')
  .setDescription(`Welcome To Our Server ${member.user} we are happy to have you! you are member number ${guild.memberCount}!`)
  .setColor(config.EMBED_COLOR)
  .setThumbnail(member.displayAvatarURL({
    dynamic: true,
  }))
  .setTimestamp()
  .setFooter({text: "Thanks For Joining!"})
  
  channel?.send({
    embeds: [welcome]
    
  })

  if(client.guilds.cache.get(config.SERVER_ID) && config.ROLE_ON_JOIN == true) { //Checking for the correct server
    return member.roles.add(member.guild.roles.cache.get(config.ROLE_ID)); //Issuing a role
}
})


client.login(config.BOT_TOKEN);
