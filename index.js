const axios = require('axios');

const WEBHOOK_URL = "https://discord.com/api/webhooks/1551708517780684890/u7YVefChhhN16aIbI0vUIx1lyN6cXRZXCtWl8h2S3R433O14xGmYKWTWWEFZWjROAHtd";
const ROBLOX_SECURITY_COOKIE = "_WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items._|CAEQAhoEEAQYASIcCgRkdWlrEhQxMzU5MjQ4OTkzaNzU5NzI5NTQ3NmlUCgV1bmFtFtZRItLdG90UIJeWZlZmlnODdWIkeg5dWlkEgsxMDY3NTMzNzNsM3IgD.xnPPdbwD787_liHVkxvu3pjV5DLegF8P4wHAcREq_BHEljtkIw7Fr9dH_F5ruzljRqufTYRGU36WBGo8kwZ5sBMIOzLwnBzDxpNQT2wC2tVc06N_23Hqqf740wpGc0kFFX04oKafC6ZPTdvpv1-MBs7sidW3wf5slowRFdHr4LgGET7rX-GOTJmdAUiGy0y3bTnU6gB8e9bDitsq5lipTdD7xlQpw24MxFUcFgSDUMn218kBIS223noJKHdahWicGsaDXxdprlWinX_X1APU2gtnLfg9SRHFQgNWP3oEeEeOXKDmEZFBLHbdSRzsSLQUVLtgaiiM-yXcUhu1mcxxU_Kpv1qR34ZbOAKti3MTGjplI-c6SYQ-0KSuQd0uVJwGdRmPyL3EU4Z9S0gB7exzVkHq0BrmRy4dnlGiqCzuyBZ7EH2sAms-p-wnYAncsWjBt0ZHHqGwyIslbjUc-6pOxerU61h72XhDgfdo0hslgKfwtgAsdKl-mH3kZ-69y2vL0bt_aAxL77qToag1OaV02FXVF8hZtbqgwfKNTkTfN0cq4SzeqKe0Gzplva2X79M_NIOJq-H5Xea6oQvDwQK0LjKgTdP-xh2rVcxUoMyG-QSWd6JTJJuXBi-MA3_kN_68nsOKHIdAInVw7rmtagCyTYxPFii-OANK3OI3_4iQcFezJ9Gp4OMuAqBgJ_jySONa241V0sp030TzSazDGPWeiyWv3EuNKTTY8NA5XN94h_jukdgVMWcc52pZ0TLJ-tNxrmQDQY-YN2c6-G4WzGR-sIXPUS0rPjnirlcvdXW3kEx54F6749fnKil1w7GKWgnNndWn8yeSJz0pMnclOUNSVH6CWP-QI7qrkzZldXgrR7nRyf5n6R10NNpvG_9e7f12zE7VoSUdRwEMYqwgrwEpcA.x0L2nlqOjFBIxORe9E2mu";

const PLACE_ID = 893973440; // Flee the Facility Place ID
const ACCESS_CODE = "2d4e759b86daa346829c63217e903bee";

let lastPlayerCount = -1;

async function checkPrivateServer() {
    try {
        // Pedido à API de servidores do jogo passando o cookie de autenticação para validar os servidores VIP do utilizador
        const response = await axios.get(`https://games.roblox.com/v1/games/${PLACE_ID}/servers/Private?limit=100`, {
            headers: {
                'Cookie': `.ROBLOXSECURITY=${ROBLOX_SECURITY_COOKIE}`,
                'Referer': 'https://www.roblox.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const servers = response.data.data || [];
        // Encontra o servidor privado através do código de acesso
        const myServer = servers.find(s => s.accessCode === ACCESS_CODE || s.id === ACCESS_CODE);
        
        let playerCount = myServer ? myServer.playing : 1; // Se estás lá dentro e a API listar, apanha o número real; caso contrário assume 1 por estares lá

        if (playerCount !== lastPlayerCount) {
            lastPlayerCount = playerCount;
            
            let indicator = "";
            if (playerCount === 0) {
                indicator = "⚪⚪⚪⚪⚪";
            } else if (playerCount > 0 && playerCount < 5) {
                indicator = "🟢".repeat(playerCount) + "⚪".repeat(5 - playerCount);
            } else {
                indicator = "🔴🔴🔴🔴🔴";
                playerCount = 5;
            }

            const messageContent = `**Servidor VIP - Flee the Facility**\n${playerCount} jogadores ${indicator}`;
            
            await axios.post(WEBHOOK_URL, {
                content: messageContent
            });
        }
    } catch (error) {
        console.error("Erro ao consultar o servidor VIP:", error.message);
    }
}

setInterval(checkPrivateServer, 30000);
checkPrivateServer();
console.log("Monitor de servidor VIP privado iniciado!");
