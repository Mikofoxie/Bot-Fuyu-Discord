const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const giphy = require("giphy-api")();
// const fs = require('fs');
const registerCommandSlash = require("./command.js");

// const client = new Discord.Client({ intents: ["GUILD_MESSAGES", "GUILDS"] });
const prefix = "fu!";
const moment = require("moment");
const rpc = require("./status.js");
require("dotenv").config();

const commandTable = {
  "❗ fu!help": "Show command list\n",

  "⌛ fu!ping": "Check ping\n",

  "🔅 fu!today": "Show current date and time\n",

  "♻️ fu!clear [number]": "Delete channel messages (up to 100 messages)\n",

  "✅ fu!all": "Delete all messages in the channel",
};

const now = new Date();
const date = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

const formattedDate = `📅 Ngày: ${date}/${month}/${year} || 🕟 Giờ: ${hours}:${minutes}:${seconds}`;
//-------------------------------------------------------------------------------------

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  registerCommandSlash;

  const welcomeObj = require("./welcome.js");
  client.on("guildMemberAdd", (member) => {
    welcomeObj.execute(member);
  });

  rpc.execute(client);
});

// client.on('guildMemberAdd', member => {
//   const embed = new Discord.MessageEmbed()

//   const mess = `welcome <@${member.id}> to server!`;

//   const channel = member.guild.channels.cache.get(process.env.CHANNEL_ID);
//   console.log(mess);

//   channel.send(mess)
// })

//--------------------------------------------------
client.on(Events.MessageCreate, async (message) => {
  const username = message.author.username;
  const command = message.content.substring(prefix.length).split(" ")[0];

  if (message.content === `<@${client.user.id}>`) {
    message.reply(
      "*Fuyu is staring at you!...* \n What's wrong? If you need help type `fu!help` or use `/help`"
    );
  }

  // Command prefix
  switch (command) {
    case "help":
      const commands = Object.keys(commandTable);
      const helpMessage = commands
        .map((command) => `${command}: ${commandTable[command]}`)
        .join("\n");
      message.channel.send(
        `**Chào bạn ${username}~ **\nThis is the command list:\n\`\`\`${helpMessage} \n\n🔯 Or you can use (/) to display more command 🔯\n\`\`\` \`\`\`fix\n> Note: Messages can only be deleted within 14 days\`\`\` `,
      );
      break;

    case "ping":
      const ping = Math.round(client.ws.ping);
      message.channel.send(`🏓 Pong! Ping của mình là: ${ping}ms.`);
      break;

    case "today":
      message.channel.send(`\`\`\`${formattedDate}\`\`\``);
      break;

    case "clear":
      const amount = parseInt(message.content.split(" ")[1]) + 1;

      if (isNaN(amount)) {
        return message.reply("Enter the number of messages to delete.");
      } else if (amount < 1 || amount > 100) {
        return message.reply("Please enter the number of messages from 1 to 100.");
      }

      message.channel
        .bulkDelete(amount, true)
        .then((deletedMessages) => {
          console.log(`Deleted ${deletedMessages.size} message.`);
          message.channel
            .send(`Deleted ${deletedMessages.size - 1} message.`) // check how many messages the bot has deleted
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((err) => console.log(err));
              }, 2000); // Delete response after 2 seconds
            });
        })
        .catch((err) => {
          console.error(err);
          message.channel.send(
            "An error occurred while deleting messages in this channel!"
          );
        });
      break;

    case "clearall":
      try {
        let deletedMessages = null;
        do {
          deletedMessages = await message.channel.bulkDelete(100, true);
        } while (deletedMessages.size !== 0);
        message.channel
          .send("All messages in this channel have been deleted.")
          .then((msg) => {
            setTimeout(() => {
              msg.delete().catch((err) => console.log(err));
            }, 2000); // Delete response after 2 seconds
          });
      } catch (error) {
        console.error(error);
        message.channel.send(
          "An error occurred while deleting messages in this channel"
        );
      }
      break;
        
    //------------------------
  }
});

//Slash command
client.on("interactionCreate", async (interaction) => {
const username = interaction.user.username;
if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case "help":
      const commands = Object.keys(commandTable);
      const helpMessage = commands
        .map((command) => `${command}: ${commandTable[command]}`)
        .join("\n");
      interaction.reply({
        content: `**Hi ${username}~ **\nThis is the command list:\n\`\`\`${helpMessage} \n\n🔯 Or you can use (/) to display more command 🔯\n\`\`\` \`\`\`fix\n> Note: Messages can only be deleted within 14 days\`\`\` `,
        ephemeral: true,
      });
      break;

    case "ping":
      const ping = Math.round(client.ws.ping);
      interaction.reply(`🏓 Pong! My Ping is: ${ping}ms.`);
      break;

    case "clear":
      const amount = parseInt(interaction.options.get("number").value);
      console.log(`${username}: ` + amount);
      if (isNaN(amount)) {
        return interaction.reply("Enter the number of messages to delete.");
      } else if (amount < 1 || amount > 100) {
        return interaction.reply(
          "Please enter the number of messages from 1 to 100"
          );
        }
        
        interaction.channel.messages
        .fetch({ limit: amount })
        .then(async (messages) => {
          const filteredMessages = messages.filter((m) => !m.pinned);
          if (filteredMessages.size < 1) {
            return interaction
            .reply(`There are no messages to delete in this channel.`)
            .then(() => {
              setTimeout(() => {
                interaction.deleteReply();
              }, 2000);
            });
          }
          
        await interaction.deferReply({ ephemeral: true });
      // await interaction.deferReply();

      interaction.channel
        .bulkDelete(amount, true)
        .then((deletedMessages) => {
          console.log(`Deleted ${deletedMessages.size} message.`);
            interaction
            .editReply(`Deleted ${deletedMessages.size} message.`, {ephemeral: true}) // check how many messages the bot has deleted
            .then(() => {
                setTimeout(() => {
                  interaction.deleteReply();
                }, 2000);    
            });
        })
      })
        .catch((err) => {
          console.error(err);
          interaction.channel.send(
            `An error occurred while deleting messages in this channel! `
            );
          });
      break;

    case "clearall":
      try {
        await interaction.deferReply({ ephemeral: true });
        let deletedMessages = null;
        do {
          deletedMessages = await interaction.channel.bulkDelete(100, true);
        } while (deletedMessages.size !== 0);

        interaction
          .editReply("All messages in this channel have been deleted.", {ephemeral: true})
          .then(() => {
            setTimeout(() => {
              interaction.deleteReply().catch(console.error);
            }, 2000); // Delete response after 2 seconds
          });
      } catch (error) {
        console.error(error);
        await interaction.reply(
          `An error occurred while deleting messages in this channel!`, {ephemeral: true}
        );
      }
      break;

    case "today":
      interaction.reply(`\`\`\`${formattedDate}\`\`\``);
      break;

    case "avatar":
      const avatarObj = require("./avatar.js");
      avatarObj.excute(interaction);
      break;

    case "image-generation":
      const imagegnt = require("./image-generate.js");
      imagegnt.excute(interaction);
      break;
  }
});

client.login(process.env.BOT_TOKEN);

// Hello here's my code I'm Fuyu
