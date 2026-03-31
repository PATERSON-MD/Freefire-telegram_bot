# 🚀 Déploiement du Bot Free Fire sur Replit

Ce guide vous explique comment déployer le bot Telegram Free Fire sur Replit en quelques minutes.

## ✅ Prérequis

- Un compte Replit (gratuit)
- Votre token Telegram Bot : `8440963842:AAFHNKRdLvAu14_yH4tzlrpzTZn5beNrvpM`
- Le code du bot (déjà sur GitHub)

## 🎯 Étapes de déploiement

### Étape 1 : Créer un compte Replit

1. Aller sur [replit.com](https://replit.com)
2. Cliquer sur **"Sign up"**
3. Se connecter avec GitHub (recommandé) ou créer un compte email
4. Confirmer votre email

### Étape 2 : Importer le projet depuis GitHub

1. Une fois connecté à Replit, cliquer sur **"+ Create"** (en haut à gauche)
2. Sélectionner **"Import from GitHub"**
3. Entrer l'URL du dépôt :
   ```
   https://github.com/PATERSON-MD/Freefire-telegram_bot
   ```
4. Cliquer sur **"Import from GitHub"**
5. Replit va télécharger et configurer le projet automatiquement

### Étape 3 : Configurer les variables d'environnement

1. Dans Replit, cliquer sur l'icône **"Secrets"** (🔑) dans la barre latérale gauche
2. Ajouter les variables suivantes :

| Clé | Valeur |
|-----|--------|
| `BOT_TOKEN` | `8440963842:AAFHNKRdLvAu14_yH4tzlrpzTZn5beNrvpM` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

3. Cliquer sur **"Add Secret"** pour chaque variable

### Étape 4 : Installer les dépendances

1. Ouvrir le **"Shell"** (terminal) en bas de l'écran
2. Exécuter :
   ```bash
   npm install
   ```
3. Attendre que l'installation se termine

### Étape 5 : Lancer le bot

1. Cliquer sur le bouton **"Run"** (▶️) en haut de l'écran
2. Ou dans le terminal, exécuter :
   ```bash
   npm start
   ```
3. Vous devriez voir un message : **"✅ Bot Free Fire Telegram démarré avec succès!"**

### Étape 6 : Obtenir l'URL publique

1. Replit génère automatiquement une URL publique
2. L'URL apparaît en haut de la fenêtre (ex: `https://Freefire-telegram-bot.PATERSON-MD.repl.co`)
3. Cette URL est votre **lien du bot** (accessible 24h/24)

## 🎮 Tester le bot

1. Ouvrir Telegram
2. Chercher votre bot par son nom (créé via @BotFather)
3. Envoyer les commandes :
   - `/start` - Message de bienvenue
   - `/help` - Afficher l'aide
   - `/stats 1234567890` - Tester les statistiques
   - `/check 1234567890` - Tester la vérification
   - `/ban 1234567890` - Tester le bannissement

## 🔄 Garder le bot actif 24h/24

### Option 1 : Replit Bouncer (gratuit)

Replit arrête les projets inactifs après 1 heure. Pour les garder actifs :

1. Aller sur [replit-bouncer.glitch.me](https://replit-bouncer.glitch.me)
2. Entrer l'URL de votre Replit
3. Cliquer sur **"Bounce"**
4. Le bot restera actif 24h/24

### Option 2 : Replit Pro (payant)

- Abonnement à Replit Pro ($7/mois)
- Les projets restent actifs sans interruption
- Plus de ressources disponibles

### Option 3 : Uptime Robot (gratuit)

1. Aller sur [uptimerobot.com](https://uptimerobot.com)
2. Créer un compte gratuit
3. Ajouter un moniteur HTTP pour votre URL Replit
4. Vérifier toutes les 5 minutes pour garder le bot actif

## 📊 Monitoring et logs

1. Dans Replit, les logs s'affichent dans le terminal
2. Vous pouvez voir :
   - Les commandes reçues
   - Les erreurs
   - L'état du bot

## 🐛 Dépannage

### Le bot ne démarre pas
- Vérifier que le `BOT_TOKEN` est correct dans les Secrets
- Vérifier que `npm install` s'est bien exécuté
- Consulter les logs dans le terminal

### Le bot s'arrête après 1 heure
- Utiliser Replit Bouncer ou Uptime Robot pour le garder actif
- Ou passer à Replit Pro

### Erreur "Cannot find module"
- Exécuter `npm install` dans le terminal
- Attendre que l'installation se termine

## 📝 Fichiers importants

- `.replit` - Configuration Replit
- `replit.nix` - Dépendances système
- `package.json` - Dépendances Node.js
- `index.js` - Code principal du bot
- `freefire-service.js` - Logique métier

## 🎉 Félicitations !

Votre bot Telegram Free Fire est maintenant **déployé et accessible 24h/24** sur Replit !

Pour toute question ou problème, consultez :
- [Documentation Replit](https://docs.replit.com/)
- [Documentation Telegraf](https://telegraf.js.org/)
- [API Telegram Bot](https://core.telegram.org/bots/api)

---

**Bot créé avec ❤️ pour la communauté Free Fire**
