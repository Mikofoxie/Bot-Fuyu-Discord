const { EmbedBuilder } = require("@discordjs/builders");
const { User, Guild } = require("discord.js");
const { GuildMember } = require("discord.js");
require("dotenv").config();

module.exports ={
    name: "avatarEmbedinteraction",
    excute(interaction) {
        const { user, guild } = interaction;
        // const avatarURLinter = interaction.author.displayAvatarURL({ dynamic: true });
        const avatarMention = interaction.options.getUser('mention')
        const guildAvatarURL = guild.iconURL({ dynamic: true });
        const guildName = guild.name;
        const member = interaction.member;
        const usernamePerson = member.user.username;
        const userAvatarURLPerson = member.user.avatarURL({size: 4096, format: 'png', dynamic: true });
        // const usernameinter = avatarMention.username;
        // const userAvatarURLinter = avatarMention.displayAvatarURL({size: 4096, format: 'png', dynamic: true });
        let usernameinter, userAvatarURLinter;
        if (avatarMention) {
            usernameinter = avatarMention.username;
            userAvatarURLinter = avatarMention.displayAvatarURL({size: 4096, format: 'png', dynamic: true });
        } else {
            usernameinter = usernamePerson;
            userAvatarURLinter = userAvatarURLPerson;
        }
        const avatarEmbedinteraction = new EmbedBuilder()
        .setColor(0xce63e9)
        .setAuthor({name: `${usernameinter}'s pfp`})
        .setImage(`${userAvatarURLinter}`)
        .setFooter({text: `${guildName}`, iconURL: guildAvatarURL})

        interaction.reply({embeds: [avatarEmbedinteraction]})
    },
}
