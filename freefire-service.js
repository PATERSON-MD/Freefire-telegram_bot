import axios from 'axios';
import NodeCache from 'node-cache';

// Cache avec TTL de 1 heure
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Limite de requêtes : 10 par minute par utilisateur
const userRateLimits = new Map();

const FREEFIRE_API_BASE = 'https://api.ff.garena.com';

/**
 * Vérifie le rate limit pour un utilisateur
 * @param {string} userId - ID utilisateur Telegram
 * @returns {boolean} - true si la requête est autorisée
 */
export function checkRateLimit(userId) {
  const now = Date.now();
  const userLimit = userRateLimits.get(userId) || { requests: [], blocked: false };

  // Nettoyer les requêtes de plus de 1 minute
  userLimit.requests = userLimit.requests.filter(time => now - time < 60000);

  if (userLimit.requests.length >= 10) {
    userLimit.blocked = true;
    return false;
  }

  userLimit.requests.push(now);
  userRateLimits.set(userId, userLimit);
  return true;
}

/**
 * Récupère les statistiques d'un joueur Free Fire
 * @param {string} uid - UID du joueur
 * @returns {Promise<Object>} - Données du joueur
 */
export async function getPlayerStats(uid) {
  // Vérifier le cache
  const cached = cache.get(`player_${uid}`);
  if (cached) {
    return cached;
  }

  try {
    // Validation basique de l'UID
    if (!uid || !/^\d+$/.test(uid) || uid.length > 20) {
      return {
        status: 'invalid',
        message: '❌ ID invalide. Veuillez entrer un UID numérique valide.',
      };
    }

    // Simulation de données (en production, utiliser une vraie API)
    const playerData = await fetchPlayerDataFromAPI(uid);

    if (!playerData) {
      return {
        status: 'not_found',
        message: '⚪ Compte introuvable. Vérifiez l\'ID et réessayez.',
      };
    }

    // Mettre en cache
    cache.set(`player_${uid}`, playerData);
    return playerData;
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error.message);
    return {
      status: 'error',
      message: '❌ Erreur lors de la récupération des données. Réessayez plus tard.',
    };
  }
}

/**
 * Vérifie le statut de bannissement d'un compte
 * @param {string} uid - UID du joueur
 * @returns {Promise<Object>} - Statut de bannissement
 */
export async function checkBanStatus(uid) {
  // Vérifier le cache
  const cached = cache.get(`ban_${uid}`);
  if (cached) {
    return cached;
  }

  try {
    if (!uid || !/^\d+$/.test(uid) || uid.length > 20) {
      return {
        status: 'invalid',
        message: '❌ ID invalide.',
      };
    }

    // Simulation de vérification de bannissement
    const banStatus = await fetchBanStatusFromAPI(uid);

    cache.set(`ban_${uid}`, banStatus);
    return banStatus;
  } catch (error) {
    console.error('Erreur lors de la vérification du bannissement:', error.message);
    return {
      status: 'error',
      message: '❌ Erreur lors de la vérification. Réessayez plus tard.',
    };
  }
}

/**
 * Cherche un UID par pseudo
 * @param {string} nickname - Pseudo du joueur
 * @returns {Promise<Object>} - Données du joueur trouvé
 */
export async function searchPlayerByNickname(nickname) {
  const cached = cache.get(`search_${nickname}`);
  if (cached) {
    return cached;
  }

  try {
    if (!nickname || nickname.length < 2 || nickname.length > 20) {
      return {
        status: 'invalid',
        message: '❌ Pseudo invalide (2-20 caractères).',
      };
    }

    const result = await fetchPlayerByNicknameFromAPI(nickname);

    if (!result) {
      return {
        status: 'not_found',
        message: `⚪ Aucun joueur trouvé avec le pseudo "${nickname}".`,
      };
    }

    cache.set(`search_${nickname}`, result);
    return result;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error.message);
    return {
      status: 'error',
      message: '❌ Erreur lors de la recherche. Réessayez plus tard.',
    };
  }
}

/**
 * Simule la récupération des données d'un joueur depuis l'API
 * En production, cette fonction appellerait une vraie API Free Fire
 */
async function fetchPlayerDataFromAPI(uid) {
  // Simulation avec des données aléatoires
  const mockPlayers = {
    '1234567890': {
      uid: '1234567890',
      nickname: 'xX_Sniper_Xx',
      level: 85,
      rank: 'Héroïque',
      rankPercentage: 0.5,
      wins: 1247,
      kills: 8932,
      kdRatio: 2.84,
      headshotPercentage: 32,
      avgSurvival: 12.5,
      guildName: 'Les Légendes',
      guildLevel: 10,
      linkedAccounts: ['Facebook', 'Google'],
      lastUpdated: new Date().toISOString(),
    },
    '9876543210': {
      uid: '9876543210',
      nickname: 'ProPlayer_Elite',
      level: 92,
      rank: 'Légendaire',
      rankPercentage: 0.1,
      wins: 2156,
      kills: 15234,
      kdRatio: 3.45,
      headshotPercentage: 38,
      avgSurvival: 14.2,
      guildName: 'Apex Legends',
      guildLevel: 12,
      linkedAccounts: ['Facebook', 'Google', 'VK'],
      lastUpdated: new Date().toISOString(),
    },
  };

  // Retourner les données mockées ou générer des données aléatoires
  if (mockPlayers[uid]) {
    return {
      status: 'active',
      data: mockPlayers[uid],
    };
  }

  // Générer des données aléatoires pour les autres UIDs
  return {
    status: 'active',
    data: {
      uid,
      nickname: `Player_${uid.slice(-4)}`,
      level: Math.floor(Math.random() * 100) + 1,
      rank: ['Bronze', 'Argent', 'Or', 'Platine', 'Diamant', 'Héroïque', 'Légendaire'][Math.floor(Math.random() * 7)],
      rankPercentage: Math.random() * 100,
      wins: Math.floor(Math.random() * 3000),
      kills: Math.floor(Math.random() * 20000),
      kdRatio: (Math.random() * 5).toFixed(2),
      headshotPercentage: Math.floor(Math.random() * 50),
      avgSurvival: (Math.random() * 20).toFixed(1),
      guildName: 'Guilde Aléatoire',
      guildLevel: Math.floor(Math.random() * 15) + 1,
      linkedAccounts: ['Facebook', 'Google'],
      lastUpdated: new Date().toISOString(),
    },
  };
}

/**
 * Simule la vérification du statut de bannissement
 */
async function fetchBanStatusFromAPI(uid) {
  const banStatuses = [
    { status: 'active', message: '✅ Compte actif (non banni)' },
    { status: 'banned_permanent', message: '🔴 Banni définitivement' },
    { status: 'banned_temporary', message: '🟠 Banni temporairement (7 jours restants)' },
  ];

  const randomStatus = banStatuses[Math.floor(Math.random() * banStatuses.length)];
  return randomStatus;
}

/**
 * Simule la recherche d'un joueur par pseudo
 */
async function fetchPlayerByNicknameFromAPI(nickname) {
  // Simulation : retourner des résultats mockés
  const mockResults = {
    'xX_Sniper_Xx': {
      uid: '1234567890',
      nickname: 'xX_Sniper_Xx',
      level: 85,
      rank: 'Héroïque',
    },
    'ProPlayer_Elite': {
      uid: '9876543210',
      nickname: 'ProPlayer_Elite',
      level: 92,
      rank: 'Légendaire',
    },
  };

  if (mockResults[nickname]) {
    return {
      status: 'found',
      data: mockResults[nickname],
    };
  }

  // Pour les autres pseudos, retourner null
  return null;
}

/**
 * Formate les statistiques d'un joueur pour l'affichage Telegram
 */
export function formatPlayerStats(playerData) {
  const { data } = playerData;

  return `
🎮 *Free Fire - Statistiques du Joueur*

🆔 *UID:* \`${data.uid}\`
👤 *Pseudo:* ${data.nickname}
🏆 *Niveau:* ${data.level}
⭐ *Rang:* ${data.rank} (Top ${data.rankPercentage.toFixed(1)}%)

📊 *Statistiques:*
• Victoires: ${data.wins.toLocaleString()}
• Kills: ${data.kills.toLocaleString()}
• K/D Ratio: ${data.kdRatio}
• Headshot %: ${data.headshotPercentage}%
• Survie moyenne: ${data.avgSurvival} min

🛡️ *Guilde:* ${data.guildName} (Niveau ${data.guildLevel})
🔗 *Comptes liés:* ${data.linkedAccounts.join(', ')}

📅 *Mise à jour:* ${new Date(data.lastUpdated).toLocaleDateString('fr-FR')}
  `.trim();
}

/**
 * Formate le statut de bannissement pour l'affichage Telegram
 */
export function formatBanStatus(banStatus) {
  return `
🛡️ *Vérification de Bannissement*

${banStatus.message}
  `.trim();
}
