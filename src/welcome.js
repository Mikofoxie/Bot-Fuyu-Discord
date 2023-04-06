const { EmbedBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");
const { GuildEmoji } = require("discord.js");

require("dotenv").config();

module.exports = {
  name: "guildMemberAdd",
  execute(member, message, client) {
    const { user, guild } = member;
    const welcomeChannel = member.guild.channels.cache.get(
      process.env.CHANNEL_ID
    );
    const channel_notification = member.guild.channels.cache.get(
      process.env.CHANNEL_NOTI
    );

    const createdAt = guild.createdAt;
    const formattedDate = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;
    const nitroLevel = guild.premiumTier;

    const guildName = guild.name;
    const imgEmbed = `${guild.iconURL({ dynamic: true })}`;
    const emojiName = "chino_poporon";
    const emojiNitro = "Boost"
    const emoji = guild.emojis.cache.find((emoji) => emoji.name === emojiName);
    const nitro = guild.emojis.cache.find((emoji) => emoji.name === emojiNitro);


    const welcomeMessage = `**Welcome <@${member.id}>**, đã tham gia ${guildName} ${emoji}\n\nHãy giới thiệu bản thân và giao lưu vui vẻ với mọi người, đừng quên cập nhật các thông báo ở kênh ${channel_notification} thường xuyên nhé! \n`;

    const welcomeEmbed = new EmbedBuilder()
      .setColor(0xce63e9)
      .setTitle(`Welcome to ${guildName}`)
      .setURL(null)
      .setAuthor({
        name: `🔶 ${member.displayName} đã gia nhập 🔶`,
        iconURL: `${member.displayAvatarURL({ dynamic: true })}`,
      })
      .setDescription(welcomeMessage)
      .setThumbnail(imgEmbed)
      .setFields(
        { 
          name: "Server Created 🛠️", 
          value: formattedDate,
          inline: true, 
        },
        {
          name: "Total Members 👥",
          value: `${guild.memberCount}`,
          inline: true,
        },
        { 
          name: `Server Boosts ${nitro}`,
          value: `Level ${nitroLevel}`,
          inline: true, 
        },
      )
        .setTimestamp()
        .setFooter(
        {
          text: `From ${guildName}`, 
          iconURL: imgEmbed,
        },
        )

    welcomeChannel.send({ embeds: [welcomeEmbed] });
  },
};
