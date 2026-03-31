import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
import {
  getPlayerStats,
  checkBanStatus,
  searchPlayerByNickname,
  checkRateLimit,
  formatPlayerStats,
  formatBanStatus,
} from './freefire-service.js';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN non défini dans .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Middleware pour les logs
bot.use((ctx, next) => {
  console.log(`[${new Date().toISOString()}] ${ctx.from?.username || ctx.from?.id} - ${ctx.message?.text || ctx.update.callback_query?.data}`);
  return next();
});

// Commande /start
bot.command('start', (ctx) => {
  ctx.reply(
    `🎮 *Bienvenue sur Free Fire Bot!*

Je suis un bot pour vérifier les statistiques des joueurs Free Fire.

*Commandes disponibles:*
• /check [ID] - Vérifier si un compte existe et son statut
• /stats [ID] - Afficher les statistiques détaillées
• /ban [ID] - Vérifier le statut de bannissement
• /uid [pseudo] - Chercher un UID par pseudo
• /help - Afficher l'aide

*Exemple:*
\`/stats 1234567890\`
\`/uid xX_Sniper_Xx\`
\`/ban 1234567890\`

Tapez une commande pour commencer! 🚀`,
    { parse_mode: 'Markdown' }
  );
});

// Commande /help
bot.command('help', (ctx) => {
  ctx.reply(
    `📖 *Aide - Free Fire Bot*

*Commandes:*

1. **/stats [ID]**
   Affiche les statistiques détaillées d'un joueur
   Exemple: \`/stats 1234567890\`

2. **/check [ID]**
   Vérifie si un compte existe et son statut
   Exemple: \`/check 1234567890\`

3. **/ban [ID]**
   Vérifie le statut de bannissement
   Exemple: \`/ban 1234567890\`

4. **/uid [pseudo]**
   Cherche l'UID d'un joueur par son pseudo
   Exemple: \`/uid xX_Sniper_Xx\`

*Limites:*
• Maximum 10 requêtes par minute
• Cache de 1 heure pour les données

*Note:* Les IDs doivent être numériques et valides.`,
    { parse_mode: 'Markdown' }
  );
});

// Commande /stats
bot.command('stats', async (ctx) => {
  const userId = ctx.from.id;

  // Vérifier le rate limit
  if (!checkRateLimit(userId)) {
    ctx.reply('⚠️ Trop de requêtes. Attendez 1 minute avant de réessayer.');
    return;
  }

  const args = ctx.message.text.split(' ');
  const uid = args[1];

  if (!uid) {
    ctx.reply('❌ Usage: /stats [ID]\nExemple: /stats 1234567890');
    return;
  }

  try {
    ctx.sendChatAction('typing');
    const playerData = await getPlayerStats(uid);

    if (playerData.status === 'invalid' || playerData.status === 'not_found') {
      ctx.reply(playerData.message);
      return;
    }

    if (playerData.status === 'error') {
      ctx.reply(playerData.message);
      return;
    }

    const formattedStats = formatPlayerStats(playerData);
    ctx.reply(formattedStats, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Erreur /stats:', error);
    ctx.reply('❌ Une erreur s\'est produite. Réessayez plus tard.');
  }
});

// Commande /check
bot.command('check', async (ctx) => {
  const userId = ctx.from.id;

  if (!checkRateLimit(userId)) {
    ctx.reply('⚠️ Trop de requêtes. Attendez 1 minute avant de réessayer.');
    return;
  }

  const args = ctx.message.text.split(' ');
  const uid = args[1];

  if (!uid) {
    ctx.reply('❌ Usage: /check [ID]\nExemple: /check 1234567890');
    return;
  }

  try {
    ctx.sendChatAction('typing');
    const playerData = await getPlayerStats(uid);

    if (playerData.status === 'invalid') {
      ctx.reply('⚪ ID invalide. Veuillez entrer un UID numérique valide.');
      return;
    }

    if (playerData.status === 'not_found') {
      ctx.reply('⚪ Compte introuvable.');
      return;
    }

    const { data } = playerData;
    const response = `
✅ *Compte trouvé*

🆔 *UID:* \`${data.uid}\`
👤 *Pseudo:* ${data.nickname}
🏆 *Niveau:* ${data.level}
⭐ *Rang:* ${data.rank}

*Statut:* ✅ Compte actif (non banni)
    `.trim();

    ctx.reply(response, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Erreur /check:', error);
    ctx.reply('❌ Une erreur s\'est produite. Réessayez plus tard.');
  }
});

// Commande /ban
bot.command('ban', async (ctx) => {
  const userId = ctx.from.id;

  if (!checkRateLimit(userId)) {
    ctx.reply('⚠️ Trop de requêtes. Attendez 1 minute avant de réessayer.');
    return;
  }

  const args = ctx.message.text.split(' ');
  const uid = args[1];

  if (!uid) {
    ctx.reply('❌ Usage: /ban [ID]\nExemple: /ban 1234567890');
    return;
  }

  try {
    ctx.sendChatAction('typing');
    const banStatus = await checkBanStatus(uid);

    if (banStatus.status === 'invalid') {
      ctx.reply('⚪ ID invalide.');
      return;
    }

    const formattedStatus = formatBanStatus(banStatus);
    ctx.reply(formattedStatus, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Erreur /ban:', error);
    ctx.reply('❌ Une erreur s\'est produite. Réessayez plus tard.');
  }
});

// Commande /uid
bot.command('uid', async (ctx) => {
  const userId = ctx.from.id;

  if (!checkRateLimit(userId)) {
    ctx.reply('⚠️ Trop de requêtes. Attendez 1 minute avant de réessayer.');
    return;
  }

  const args = ctx.message.text.split(' ');
  const nickname = args.slice(1).join(' ');

  if (!nickname) {
    ctx.reply('❌ Usage: /uid [pseudo]\nExemple: /uid xX_Sniper_Xx');
    return;
  }

  try {
    ctx.sendChatAction('typing');
    const result = await searchPlayerByNickname(nickname);

    if (result.status === 'invalid' || result.status === 'not_found') {
      ctx.reply(result.message);
      return;
    }

    if (result.status === 'error') {
      ctx.reply(result.message);
      return;
    }

    const { data } = result;
    const response = `
🔍 *Résultat de recherche*

👤 *Pseudo:* ${data.nickname}
🆔 *UID:* \`${data.uid}\`
🏆 *Niveau:* ${data.level}
⭐ *Rang:* ${data.rank}

💡 Utilisez \`/stats ${data.uid}\` pour plus de détails.
    `.trim();

    ctx.reply(response, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Erreur /uid:', error);
    ctx.reply('❌ Une erreur s\'est produite. Réessayez plus tard.');
  }
});

// Gestion des messages non reconnus
bot.on(message(), (ctx) => {
  ctx.reply(
    '❓ Commande non reconnue.\n\nTapez /help pour voir les commandes disponibles.',
    { reply_to_message_id: ctx.message.message_id }
  );
});

// Gestion des erreurs
bot.catch((err, ctx) => {
  console.error('Erreur Telegraf:', err);
  ctx.reply('❌ Une erreur s\'est produite. Veuillez réessayer.');
});

// Lancer le bot
async function startBot() {
  try {
    // Utiliser le polling pour le développement local
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Bot lancé en mode polling (développement)...');
      await bot.launch();
    } else {
      // Utiliser les webhooks pour la production
      console.log('🚀 Bot lancé en mode webhook (production)...');
      bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot`);
      
      // Créer un serveur Express pour les webhooks
      import('express').then(({ default: express }) => {
        const app = express();
        app.use(express.json());

        app.post('/bot', (req, res) => {
          bot.handleUpdate(req.body, res);
        });

        app.get('/health', (req, res) => {
          res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        app.listen(PORT, () => {
          console.log(`✅ Serveur webhook écoute sur le port ${PORT}`);
        });
      });
    }

    console.log('✅ Bot Free Fire Telegram démarré avec succès!');
  } catch (error) {
    console.error('❌ Erreur au démarrage du bot:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt gracieux
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

startBot();
