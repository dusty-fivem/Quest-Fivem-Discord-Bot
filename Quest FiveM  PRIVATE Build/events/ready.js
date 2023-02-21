const config = require('../config.json');

module.exports = {
  name: 'ready',
  execute(client) {
    const oniChan = client.channels.cache.get(client.config.ticketChannel)

    function sendTicketMSG() {
      const embed = new client.discord.MessageEmbed()
        .setColor(config.EMBED_COLOR)
        .setAuthor({ name:'Ticket', iconURL: client.user.avatarURL()})
        .setDescription('Click the button below to open a ticket.')
        .setFooter({ text: (config.SERVER_NAME), iconURL: (config.SERVER_LOGO) })
      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('open-ticket')
          .setLabel('Open a ticket')
          .setEmoji('✉️')
          .setStyle((require('../config.json').buttonstyle)),
        );

      oniChan.send({
        embeds: [embed],
        components: [row]
      })
    }

    oniChan.bulkDelete(100).then(() => {
      sendTicketMSG()
    })
  },
};