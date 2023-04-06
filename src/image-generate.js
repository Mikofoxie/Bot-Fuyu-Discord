const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events } = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');


    const configuration = new Configuration({
        apiKey: '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'    
    })

    const openai = new OpenAIApi(configuration);


    module.exports = {
        name: "image-generator",
        async excute(interaction){
            const { user, guild } = interaction;
            await interaction.deferReply();

            const prompt = interaction.options.getString('title');

            try{
                const response = await openai.createImage({
                    prompt: `${prompt}`,
                    n: 1,
                    size: `1024x1024`,
                });
                const image = response.data.data[0].url;
            

                const embed = new EmbedBuilder()
                .setColor(0xce63e9)
                .setTitle(`Đây là ảnh của bạn về: \`\`\`${prompt}\`\`\``)
                .setImage(image)
                .setFooter({text: `Image Generator by ${guild.name}`, iconURL: `${guild.iconURL({ dynamic: true })}`})
             
                await interaction.editReply( {embeds: [embed]} )
            } 
            catch (e) {
                console.error(e);
                await interaction.editReply({ content: `Có lỗi xảy ra khi tạo hình ảnh đó cho bạn hoặc từ ngữ không hợp lệ` });
                }
        }
    }