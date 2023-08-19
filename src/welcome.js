const { EmbedBuilder } = require("@discordjs/builders");
const { GuildMember, DiscordAPIError } = require("discord.js");
const { GuildEmoji } = require("discord.js");
const Discord = require('discord.js');
const Canvas = require("canvas");

async function createWelcomeCanvas() {
  const canvas = Canvas.createCanvas(1024, 520);
  const context = canvas.getContext('2d');
  context.font = '72px sans-serif';
  context.fillStyle = '#ffffff';

  const bg = await Canvas.loadImage("https://i.imgur.com/LkwyEd6.png");
  context.drawImage(bg, 0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.arc(512, 166, 128, 0, Math.PI * 2, true);
  context.stroke();
  context.fill();

  return canvas;
}


require("dotenv").config();

module.exports = {
  name: "guildMemberAdd",
  async execute(member, message, client) {
    
    const { user, guild } = member;
    const welcomeChannel = member.guild.channels.cache.get(
      process.env.CHANNEL_ID
    );
    const channel_notification = member.guild.channels.cache.get(
      process.env.CHANNEL_NOTI
    );
    
    const canvas = await createWelcomeCanvas();
    //Username
    const name = `${member.user.username}`
    const textWidth = canvas.context.measureText(name).width;
    const x = (canvas.width - textWidth) / 2
    canvas.context.fillText(name, x, 412)
    canvas.context.font = '20px Open Sans'

    //Make circle pfp
    canvas.context.beginPath();
    canvas.context.arc(512, 166, 118, 0, Math.PI * 2, true)
    canvas.context.closePath()
    canvas.context.clip()

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }))
    const imgWidth = 240;
    const imgHeight = 240;
    const imgX = 512 - imgWidth / 2
    const imgY = 166 - imgHeight / 2
    canvas.context.drawImage(avatar, imgX, imgY, imgWidth, imgHeight);
    

    const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {
        name: 'welcome.png',
    })
    

    // const createdAt = guild.createdAt;
    // const formattedDate = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;
    // const nitroLevel = guild.premiumTier;

    const guildName = guild.name;
    let emoGuild = /🐾|🌸/g;
    let reGuild = guildName.replace(emoGuild, '')
    reGuild = reGuild.trim();

    
    const imgEmbed = `${guild.iconURL({ dynamic: true })}`;
    const emojiName = "lyawoa";
    const emojiNitro = "Boost"
    const emoji = guild.emojis.cache.find((emoji) => emoji.name === emojiName);
    const nitro = guild.emojis.cache.find((emoji) => emoji.name === emojiNitro);


    const welcomeMessage = 
    `**Welcome**! <@${member.id}>.\n\nCan you chat ` + 
    `in ${channel_notification}\n\nHope you enjoy your stay! ${emoji}`;

    const welcomeEmbed = new EmbedBuilder()
      .setColor(0xce63e9)
      .setTitle(`Welcome to ${reGuild}`)
      .setURL(null)
      .setDescription(welcomeMessage)
      .setImage('attachment://welcome.png')
      .setFooter(
        {
          text: `Member count: ${guild.memberCount}`, 
          iconURL: imgEmbed
        }
      )

    welcomeChannel.send({ embeds: [welcomeEmbed], files: [attachment] });
  },
};
