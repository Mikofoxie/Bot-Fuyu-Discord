const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const giphy = require("giphy-api")();
// const fs = require('fs');
const registerCommandSlash = require("./command.js");

// const client = new Discord.Client({ intents: ["GUILD_MESSAGES", "GUILDS"] });
const prefix = "ta!";
const moment = require("moment");
const rpc = require("./status.js");
require("dotenv").config();

const commandTable = {
  "❗ ta!help": "Hiển thị danh sách lệnh\n",

  "⌛ ta!ping": "Kiểm tra ping\n",

  "🔅 ta!today": "Hiển thị ngày giờ hiện tại\n",

  "♻️ ta!clear [number]": "Xoá tin nhắn trong kênh (tối đa 100 tin nhắn)\n",

  "✅ ta!all": "Xoá tất cả tin nhắn trong kênh",
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
      "Tairitsu đang chơi game!.. Nhưng có chuyện gì vậy? Nếu bạn cần giúp đỡ hãy nhập `ta!help` hoặc sử dụng `/help`"
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
        `**Chào bạn ${username}~ **\nĐây là danh sách các lệnh:\n\`\`\`${helpMessage} \n\n🔯 Hoặc bạn có thể sử dụng (/) để hiển thị thêm command 🔯\n\`\`\` \`\`\`fix\n> Lưu ý: Tin nhắn chỉ có thể xoá trong vòng 14 ngày\`\`\` `,
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
        return message.reply("Điền số lượng tin nhắn cần xóa.");
      } else if (amount < 1 || amount > 100) {
        return message.reply("Vui lòng nhập số lượng tin nhắn từ 1 đến 100.");
      }

      message.channel
        .bulkDelete(amount, true)
        .then((deletedMessages) => {
          console.log(`Đã xoá ${deletedMessages.size} tin nhắn.`);
          message.channel
            .send(`Đã xoá ${deletedMessages.size - 1} tin nhắn.`) // check how many messages the bot has deleted
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((err) => console.log(err));
              }, 2000); // Delete response after 2 seconds
            });
        })
        .catch((err) => {
          console.error(err);
          message.channel.send(
            "Đã có lỗi xảy ra khi xoá tin nhắn trong kênh này!"
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
          .send("Đã xoá toàn bộ tin nhắn trong kênh này.")
          .then((msg) => {
            setTimeout(() => {
              msg.delete().catch((err) => console.log(err));
            }, 2000); // Delete response after 2 seconds
          });
      } catch (error) {
        console.error(error);
        message.channel.send(
          "Đã có lỗi xảy ra khi xoá tin nhắn trong kênh này!"
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
        content: `**Chào bạn ${username}~ **\nĐây là danh sách các lệnh:\n\`\`\`${helpMessage} \n\n🔯 Hoặc bạn có thể sử dụng (/) để hiển thị thêm command 🔯\n\`\`\` \`\`\`fix\n> Lưu ý: Tin nhắn chỉ có thể xoá trong vòng 14 ngày\`\`\` `,
        ephemeral: true,
      });
      break;

    case "ping":
      const ping = Math.round(client.ws.ping);
      interaction.reply(`🏓 Pong! Ping của mình là: ${ping}ms.`);
      break;

    case "clear":
      const amount = parseInt(interaction.options.get("number").value);
      console.log(`${username}: ` + amount);
      if (isNaN(amount)) {
        return interaction.reply("Điền số lượng tin nhắn cần xóa.");
      } else if (amount < 1 || amount > 100) {
        return interaction.reply(
          "Vui lòng nhập số lượng tin nhắn từ 1 đến 100."
          );
        }
        
        interaction.channel.messages
        .fetch({ limit: amount })
        .then(async (messages) => {
          const filteredMessages = messages.filter((m) => !m.pinned);
          if (filteredMessages.size < 1) {
            return interaction
            .reply(`Không có tin nhắn để xóa trong kênh này.`)
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
          console.log(`Đã xoá ${deletedMessages.size} tin nhắn.`);
            interaction
            .editReply(`Đã xoá ${deletedMessages.size} tin nhắn.`, {ephemeral: true}) // check how many messages the bot has deleted
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
            `Đã có lỗi xảy ra khi xoá tin nhắn trong kênh này! `
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
          .editReply("Đã xoá toàn bộ tin nhắn trong kênh này.", {ephemeral: true})
          .then(() => {
            setTimeout(() => {
              interaction.deleteReply().catch(console.error);
            }, 2000); // Delete response after 2 seconds
          });
      } catch (error) {
        console.error(error);
        await interaction.reply(
          `Đã có lỗi xảy ra khi xoá tin nhắn trong kênh này!`, {ephemeral: true}
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