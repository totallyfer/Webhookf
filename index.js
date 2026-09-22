const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const express = require('express');

// --- Servidor Web para o Render ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot do Discord com sistema de Cargos e Tickets está online!');
});

app.listen(PORT, () => {
    console.log(`Servidor web a correr na porta ${PORT}`);
});
// ----------------------------------

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers
    ] 
});

const TOKEN = process.env.DISCORD_TOKEN;

// --- Configurações dos Cargos ---
const rolesMap = {
    'cargo_jogar': '1545802190348615722',
    'cargo_sorteio': '1545802191602982945',
    'cargo_noticias': '1545802192810938429',
    'cargo_enquetes': '1545802196183158826',
    'cargo_gamenights': '1545802199060447302',
    'cargo_competitivo': '1545802198129057863'
};
const CHANNEL_CARGOS_ID = "1545802265519071272";

// --- Configurações do Sistema de Tickets ---
const CHANNEL_TICKET_ID = "1545802277690806303"; 
const TICKET_CATEGORY_ID = "1545802221340594316"; 
const STAFF_ROLE_ID = "1545802108522070026"; 

client.once('ready', async () => {
    console.log(`Bot online como ${client.user.tag}!`);

    try {
        // 1. Enviar Painel de Cargos
        const channelCargos = await client.channels.fetch(CHANNEL_CARGOS_ID);
        if (channelCargos) {
            const embedCargos = new EmbedBuilder()
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
                .setImage("https://cdn.discordapp.com/attachments/1545802331465977976/1551778580969689138/245_Sem_Titulo_20260903163413.png?ex=6ab335ec&is=6ab1e46c&hm=7502dc3d2b90d52a2da843f36edc4cbe103ce38cb6873457aab2a2db8830fd18&");

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

            const rowCargos = new ActionRowBuilder().addComponents(selectMenu);
            await channelCargos.send({ embeds: [embedCargos], components: [rowCargos] });
        }

        // 2. Enviar Painel de Tickets (Com Menu de Seleção e Nova Imagem)
        const channelTicket = await client.channels.fetch(CHANNEL_TICKET_ID);
        if (channelTicket) {
            const embedTicket = new EmbedBuilder()
                .setTitle("<:form:1545806408295915571> Suporte De Ticket")
                .setDescription("Olá. Seja bem-vindo ao centro de atendimento da SFC, mais informações abaixo.")
                .setColor(0x0055FF)
                .addFields({
                    name: "<:lupa:1545806404902985808> Suporte Geral",
                    value: "• Sorteios\n• Denúncias\n• Resgatar\n• Problemas\n• Parcerias\n• Dúvidas"
                })
                .setImage("https://cdn.discordapp.com/attachments/1545802331465977976/1551790694253858837/242_Sem_Titulo_20260903145814.png?ex=6ab34134&is=6ab1efb4&hm=c6a90148f98434cfd0fef50c29311e0675bd6650062a448dfd09822a68c2b17c&");

            const selectMenuTicket = new StringSelectMenuBuilder()
                .setCustomId('menu_criar_ticket')
                .setPlaceholder('Abra Um Ticket')
                .addOptions([
                    { label: 'Sorteios', description: 'Atendimento sobre sorteios', value: 'ticket_sorteios', emoji: '🎁' },
                    { label: 'Denúncias', description: 'Fazer uma denúncia', value: 'ticket_denuncias', emoji: '🚨' },
                    { label: 'Resgatar', description: 'Resgatar prémios ou recompensas', value: 'ticket_resgatar', emoji: '🏆' },
                    { label: 'Problemas', description: 'Reportar problemas ou bugs', value: 'ticket_problemas', emoji: '⚠️' },
                    { label: 'Parcerias', description: 'Propostas de parcerias', value: 'ticket_parcerias', emoji: '🤝' },
                    { label: 'Dúvidas', description: 'Tirar dúvidas gerais', value: 'ticket_duvidas', emoji: '❓' }
                ]);

            const rowTicket = new ActionRowBuilder().addComponents(selectMenuTicket);
            await channelTicket.send({ embeds: [embedTicket], components: [rowTicket] });
            console.log("Painéis enviados com sucesso!");
        }

    } catch (error) {
        console.error("Erro ao enviar painéis automáticos:", error);
    }
});

// Eventos de Interação
client.on('interactionCreate', async interaction => {
    // 1. Menu de Cargos
    if (interaction.isStringSelectMenu() && interaction.customId === 'menu_cargos') {
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
        return;
    }

    // 2. Menu de Seleção para Criar Ticket
    if (interaction.isStringSelectMenu() && interaction.customId === 'menu_criar_ticket') {
        await interaction.deferReply({ ephemeral: true });
        const tipoTicket = interaction.values[0];

        try {
            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${tipoTicket.replace('ticket_', '')}-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: TICKET_CATEGORY_ID,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                    {
                        id: STAFF_ROLE_ID,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                ],
            });

            const embedPrivate = new EmbedBuilder()
                .setTitle(`🎫 Atendimento: ${tipoTicket.replace('ticket_', '').toUpperCase()}`)
                .setDescription(`Olá ${interaction.user}, o seu ticket de **${tipoTicket.replace('ticket_', '')}** foi aberto.\nA nossa staff irá atender-te em breve.`)
                .setColor(0x00FF00);

            // Botões de Controlo do Ticket
            const btnClaim = new ButtonBuilder().setCustomId('reivindicar_ticket').setLabel('Reivindicar').setStyle(ButtonStyle.Primary).setEmoji('🙋‍♂️');
            const btnClose = new ButtonBuilder().setCustomId('fechar_ticket').setLabel('Fechar').setStyle(ButtonStyle.Secondary).setEmoji('🔒');
            const btnTranscript = new ButtonBuilder().setCustomId('transcricao_ticket').setLabel('Transcrição').setStyle(ButtonStyle.Success).setEmoji('📜');
            const btnDelete = new ButtonBuilder().setCustomId('deletar_ticket').setLabel('Deletar').setStyle(ButtonStyle.Danger).setEmoji('🗑️');

            const rowControls = new ActionRowBuilder().addComponents(btnClaim, btnClose, btnTranscript, btnDelete);

            await ticketChannel.send({ content: `<@&${STAFF_ROLE_ID}> | ${interaction.user}`, embeds: [embedPrivate], components: [rowControls] });

            await interaction.editReply({ content: `O teu ticket foi criado com sucesso aqui: ${ticketChannel}!` });
        } catch (error) {
            console.error("Erro ao criar ticket:", error);
            await interaction.editReply({ content: 'Ocorreu um erro ao criar o teu ticket. Tenta novamente.' });
        }
        return;
    }

    // 3. Botões de Gestão dentro do Canal do Ticket
    if (interaction.isButton()) {
        const customId = interaction.customId;
        const isStaff = interaction.member.roles.cache.has(STAFF_ROLE_ID);
        const restrictedActions = ['reivindicar_ticket', 'transcricao_ticket', 'deletar_ticket'];

        if (restrictedActions.includes(customId) && !isStaff) {
            return await interaction.reply({ content: '❌ Apenas membros da **Staff** podem utilizar esta opção!', ephemeral: true });
        }

        // Reivindicar
        if (customId === 'reivindicar_ticket') {
            await interaction.reply({ content: `✅ Este ticket foi reivindicado por ${interaction.user}!` });
            return;
        }

        // Fechar (Remove acesso do utilizador comum)
        if (customId === 'fechar_ticket') {
            await interaction.reply({ content: '🔒 Ticket fechado. Apenas a staff mantém acesso para análise.' });
            try {
                await interaction.channel.permissionOverwrites.set([
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: STAFF_ROLE_ID,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    }
                ]);
            } catch (err) {
                console.error("Erro ao fechar permissões:", err);
            }
            return;
        }

        // Transcrição
        if (customId === 'transcricao_ticket') {
            await interaction.deferReply();
            try {
                const messages = await interaction.channel.messages.fetch({ limit: 100 });
                const log = messages.reverse().map(m => `[${m.createdAt.toLocaleString()}] ${m.author.tag}: ${m.content}`).join('\n');
                
                const buffer = Buffer.from(log, 'utf-8');
                const attachment = new AttachmentBuilder(buffer, { name: `transcricao-${interaction.channel.name}.txt` });

                await interaction.editReply({ content: '📜 Transcrição do ticket gerada com sucesso:', files: [attachment] });
            } catch (error) {
                console.error("Erro ao gerar transcrição:", error);
                await interaction.editReply({ content: 'Erro ao gerar o ficheiro de transcrição.' });
            }
            return;
        }

        // Deletar
        if (customId === 'deletar_ticket') {
            await interaction.reply({ content: '🗑️ O canal será apagado em 5 segundos...' });
            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                } catch (err) {
                    console.error("Erro ao apagar canal de ticket:", err);
                }
            }, 5000);
            return;
        }
    }
});

client.login(TOKEN);

