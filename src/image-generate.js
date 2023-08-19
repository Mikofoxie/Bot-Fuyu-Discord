const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events } = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');

require("dotenv").config();

    const configuration = new Configuration({
        apiKey: process.env.KEY_API
    })

    const openai = new OpenAIApi(configuration);


    module.exports = {
        name: "image-generator",
        async excute(interaction){
            const { user, guild } = interaction;

            // await interaction.deferReply();
            await interaction.reply({ content: 
            `🔗 Loading images for you! This may take up to 1 minute`});

            const prompt = interaction.options.getString('prompt');
            

            try{
                const response = await openai.createImage({
                    prompt: `${prompt}`,
                    n: 1,
                    size: `1024x1024`,
                });
                const image = response.data.data[0].url;
            
                const resetButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("🔄 Reset")
                    .setCustomId(`reset_image_${interaction.id}`)
                );

                const embed = new EmbedBuilder()
                .setColor(0xce63e9)
                .setTitle(`This is your image about: ${prompt}`)
                .setImage(image)
                .setFooter({text: `Image Generator by ${guild.name}`, iconURL: `${guild.iconURL({ dynamic: true })}`, components: [resetButton]})
                
                await interaction.editReply( {content: `Done ✨`, embeds: [embed], components: [resetButton]} )

                const collector = interaction.channel.createMessageComponentCollector({
                    filter: (i) => i.customId === `reset_image_${interaction.id}`,
                })

            collector.on('collect', async (buttonInteraction) => {
                // Gửi lại ảnh khi button reset được click
                buttonInteraction.deferUpdate();
                await interaction.editReply({ content: `🕙 Reloading images for you! This may take up to 1 minute` });

                let resetResponse = await openai.createImage({
                    prompt: `${prompt}`,
                    n: 1,
                    size: `1024x1024`,
                });
                let resetImage = resetResponse.data.data[0].url;

                let resetEmbed = new EmbedBuilder()
                    .setColor(0xce63e9)
                    .setTitle(`This is your image about: ${prompt}`)
                    .setImage(resetImage)
                    .setFooter({ text: `Image Generator by ${guild.name}`, iconURL: `${guild.iconURL({ dynamic: true })}` });

                await interaction.editReply({ content: `Done ✨`, embeds: [resetEmbed], components: [resetButton] });
            });
            collector.on('end', () => collector.stop('Collector ended'));
            } catch (e) {
            console.error(e);
            await interaction.editReply({ content: `An error or invalid wording occurred` });
        }
    },
};
