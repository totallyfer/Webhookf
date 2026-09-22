const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers
    ] 
});

const TOKEN = process.env.DISCORD_TOKEN;

// IDs reais dos cargos do teu servidor
const rolesMap = {
    'cargo_jogar': '1545802190348615722',
    'cargo_sorteio': '1545802191602982945',
    'cargo_noticias': '1545802192810938429',
    'cargo_enquetes': '1545802196183158826',
    'cargo_gamenights': '1545802199060447302',
    'cargo_competitivo': '1545802198129057863'
};

const CHANNEL_ID = "1545802265519071272";

client.once('ready', async () => {
    console.log(`Bot online como ${client.user.tag}!`);

    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle("🔔 Notificações")
                .setDescription(
                    "• Selecione as notificações que deseja receber no servidor. Você poderá escolher quais tipos de conteúdo deseja acompanhar e receber avisos quando houver novidades.\n\n" +
                    "🎮 **@Not Jogar** • Receba notificação quando alguém estiver procurando jogadores para jogar.\n\n" +
                    "🎁 **@Not Sorteio** • Receba avisos sempre que um novo sorteio for iniciado.\n\n" +
                    "📢 **@Not Notícias** • Receba comunicados, novidades e informações importantes do servidor.\n\n" +
                    "📊 **@Not Enquetes** • Receba notificações quando novas enquetes estiverem disponíveis para votação.\n\n" +
                    "⚔️ **@Not Competitivo** • Receba notificações sobre partidas, desafios e atividades competitivas do servidor.\n\n" +
                    "✨ **@Not Gamenights** • Receba avisos sobre GameNights, partidas, atividades em grupo e recompensas disponíveis para os participantes."
                )
                .setColor(0xFFD700)
                .setImage("https://iili.io/nuasu8N.png"); // Podes colocar o link direto de uma imagem bonita aqui se quiseres

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('menu_cargos')
                .setPlaceholder('Clique aqui para escolher os cargos...')
                .setMinValues(0)
                .setMaxValues(6)
                .addOptions([
                    { label: 'Not Jogar', description: 'Avisos de quem procura jogadores', value: 'cargo_jogar', emoji: '🎮' },
                    { label: 'Not Sorteio', description: 'Avisos de novos sorteios', value: 'cargo_sorteio', emoji: '🎁' },
                    { label: 'Not Notícias', description: 'Comunicados e novidades do servidor', value: 'cargo_noticias', emoji: '📢' },
                    { label: 'Not Enquetes', description: 'Avisos de novas enquetes', value: 'cargo_enquetes', emoji: '📊' },
                    { label: 'Not Gamenights', description: 'Avisos de eventos e Gamenights', value: 'cargo_gamenights', emoji: '✨' },
                    { label: 'Not Competitivo', description: 'Avisos de partidas competitivas', value: 'cargo_competitivo', emoji: '⚔️' }
                ]);

            const row = new ActionRowBuilder().addComponents(selectMenu);
            
            await channel.send({ embeds: [embed], components: [row] });
            console.log("Painel detalhado de cargos enviado com sucesso!");
        }
    } catch (error) {
        console.error("Erro ao enviar o painel automático:", error);
    }
});

// Evento para gerir a seleção dos cargos no menu
client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'menu_cargos') return;

    const member = interaction.member;
    const selectedValues = interaction.values;

    let added = [];
    let removed = [];

    for (const [menuKey, roleId] of Object.entries(rolesMap)) {
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) continue;

        const hasRole = member.roles.cache.has(roleId);
        const isSelected = selectedValues.includes(menuKey);

        if (isSelected && !hasRole) {
            await member.roles.add(roleId);
            added.push(role.name);
        } else if (!isSelected && hasRole) {
            await member.roles.remove(roleId);
            removed.push(role.name);
        }
    }

    let resposta = "Preferências de cargos atualizadas!\n";
    if (added.length > 0) resposta += `✅ Adicionados: ${added.join(', ')}\n`;
    if (removed.length > 0) resposta += `❌ Removidos: ${removed.join(', ')}\n`;
    if (added.length === 0 && removed.length === 0) resposta = "Nenhuma alteração nos cargos.";

    await interaction.reply({ content: resposta, ephemeral: true });
});

client.login(TOKEN);
