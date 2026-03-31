# Free Fire Telegram Bot

Un bot Telegram complet pour vérifier les statistiques et le statut des comptes Free Fire.

## 🎮 Fonctionnalités

- **`/stats [ID]`** - Affiche les statistiques détaillées d'un joueur (niveau, rang, K/D, victoires, etc.)
- **`/check [ID]`** - Vérifie si un compte existe et son statut
- **`/ban [ID]`** - Vérifie le statut de bannissement (🔴 Banni, 🟠 Temporaire, 🟢 Actif)
- **`/uid [pseudo]`** - Cherche l'UID d'un joueur par son pseudo
- **`/help`** - Affiche l'aide
- **`/start`** - Message de bienvenue

## 🛡️ Sécurité & Performance

- **Rate Limiting** : Maximum 10 requêtes par minute par utilisateur
- **Cache Redis** : Cache de 1 heure pour les données des joueurs
- **Validation** : Validation stricte des IDs et pseudos
- **Gestion d'erreurs** : Gestion complète des erreurs avec messages clairs

## 🚀 Installation locale

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

1. **Cloner ou télécharger le projet**
   ```bash
   cd freefire-bot-server
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env et ajouter votre BOT_TOKEN
   ```

4. **Démarrer le bot en développement**
   ```bash
   npm run dev
   ```

## 🌐 Déploiement sur Render

### Étape 1 : Créer un dépôt GitHub

1. Créer un nouveau dépôt GitHub public ou privé
2. Pousser le code du bot :
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Free Fire Telegram Bot"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/freefire-telegram-bot.git
   git push -u origin main
   ```

### Étape 2 : Déployer sur Render

1. **Aller sur [render.com](https://render.com)**
2. **Se connecter avec GitHub**
3. **Créer un nouveau service Web** :
   - Sélectionner le dépôt `freefire-telegram-bot`
   - Nom : `freefire-telegram-bot`
   - Environnement : `Node`
   - Build Command : `npm ci`
   - Start Command : `npm start`

4. **Ajouter les variables d'environnement** :
   - `BOT_TOKEN` : Votre token Telegram (obtenu via @BotFather)
   - `NODE_ENV` : `production`
   - `PORT` : `3000`

5. **Déployer** : Cliquer sur "Deploy Service"

### Étape 3 : Configurer le Webhook (optionnel)

Si vous utilisez les webhooks au lieu du polling :

1. Récupérer l'URL du service Render : `https://your-service-name.onrender.com`
2. Ajouter la variable d'environnement `WEBHOOK_URL` sur Render
3. Le bot utilisera automatiquement les webhooks en production

## 📊 Architecture

```
freefire-bot-server/
├── index.js                 # Point d'entrée principal du bot
├── freefire-service.js      # Logique métier (API, cache, rate limiting)
├── package.json             # Dépendances
├── .env                      # Variables d'environnement
├── Dockerfile               # Configuration Docker
├── render.yaml              # Configuration Render
└── README.md                # Ce fichier
```

## 🔧 Dépendances

- **telegraf** : Bibliothèque Telegram pour Node.js
- **axios** : Client HTTP pour les requêtes API
- **dotenv** : Gestion des variables d'environnement
- **node-cache** : Cache en mémoire pour les données

## 📝 Notes

- Le bot utilise le **polling** en développement (mode `development`)
- Le bot utilise les **webhooks** en production (mode `production`)
- Les données sont mises en cache pendant **1 heure**
- Limite de **10 requêtes par minute** par utilisateur
- Les IDs doivent être numériques et valides

## 🐛 Dépannage

### Le bot ne répond pas
- Vérifier que le `BOT_TOKEN` est correct
- Vérifier que le service est en cours d'exécution sur Render
- Consulter les logs sur Render

### Rate limit atteint
- Attendre 1 minute avant de faire une nouvelle requête
- Le cache réduit les requêtes répétées

### Erreur "Compte introuvable"
- Vérifier que l'ID est correct et numérique
- L'ID doit être valide dans Free Fire

## 📞 Support

Pour toute question ou problème, consultez :
- [Documentation Telegraf](https://telegraf.js.org/)
- [API Telegram Bot](https://core.telegram.org/bots/api)
- [Render Documentation](https://render.com/docs)

## 📄 Licence

MIT

---

**Bot créé avec ❤️ pour la communauté Free Fire**
