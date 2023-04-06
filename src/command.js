// const { CLIENT_ID, GUILD_ID } = require('../config.json')
const {REST, Routes, ApplicationCommandManager, ApplicationCommandOptionType} = require('discord.js');
const {CommandInteraction} = require('discord.js');

require("dotenv/config")

const commands = [
  {
    name: 'help',
    description: 'If you need help!',
  },
  {
    name: 'ping',
    description: 'Pong!',
  },
  {
    name: 'clear',
    description: 'Clear message!',
    options: [
      {
        name: 'number',
        description: 'Number messsage to delete',
        type: ApplicationCommandOptionType.Number,
        require: true
      }
    ]
  },

  {
    name: 'clearall',
    description: 'Delete all messages in channel',
  },

  {
    name: 'today',
    description: 'Time and date?',
  },

  {
    name: 'avatar',
    description: 'Your pfp!',
    options: [
      {
	      name: 'mention',
        description: 'Mention someone',
        type: ApplicationCommandOptionType.User,
        require: true,
      }
    ]
  },

  {
    name: 'image-generation',
    description: 'Create image',
    options: [
      {
	      name: 'title',
        description: 'what title do you want?',
        type: ApplicationCommandOptionType.String,
        require: true,
      }
    ]
  },

];


const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Resgistering slash command....');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID.split(',')),

      {body: commands}
    )
    
    console.log('Slash commands were registered successfully')
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }

})();


