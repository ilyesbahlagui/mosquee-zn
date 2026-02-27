#!/bin/bash

# ════════════════════════════════════════════════════════════
# Script de déploiement - Mosquée Lumière et Piété
# ════════════════════════════════════════════════════════════

set -e  # Arrêter le script si une commande échoue

echo "🚀 Début du déploiement..."

# ─────────────────────────────────────────────────────────────
# 1. DÉPLOIEMENT DU SITE
# ─────────────────────────────────────────────────────────────
echo ""
echo "📦 Déploiement du site..."
cd client/site || exit 1

# Arrêter les conteneurs existants
if ! docker compose down 2>&1; then
    echo "❌ Erreur lors de l'arrêt du site"
    exit 1
fi

# Démarrer les nouveaux conteneurs
if ! docker compose up -d 2>&1; then
    echo "❌ Erreur lors du démarrage du site"
    exit 1
fi

echo "✅ Site déployé avec succès"

# ─────────────────────────────────────────────────────────────
# 2. DÉPLOIEMENT DE LA GESTION
if ! docker compose down 2>&1; then
    echo "❌ Erreur lors de l'arrêt de la gestion"
    exit 1
fi

# Démarrer les nouveaux conteneurs
if ! docker compose up -d 2>&1; then
    echo "❌ Erreur lors du démarrage de la gestion"
    exit 1
fi

# Arrêter les conteneurs existants
docker compose down || { echo "❌ Erreur lors de l'arrêt de la gestion"; exit 1; }

# Démarrer les nouveaux conteneurs
docker compose up -d || { echo "❌ Erreur lors du démarrage de la gestion"; exit 1; }

echo "✅ Gestion déployée avec succès"

# ─────────────────────────────────────────────────────────────
# 3. REDÉMARRAGE DU SERVEUR (PM2)
if ! pm2 restart 1 2>&1; then
    echo "❌ Erreur lors du redémarrage du serveur"
    exit 1
fi

# Vérifier que le processus est bien démarré
sleep 2
if ! pm2 show 1 2>&1 | grep "status" | grep "online" > /dev/null; then
    echo "⚠️  Le serveur n'est pas en ligne"
    pm2 logs 1 --lines 10 --nostream
    exit 1
fi
# Redémarrer le processus PM2 (ID: 1)
pm2 restart 1 || { echo "❌ Erreur lors du redémarrage du serveur"; exit 1; }

# Vérifier que le processus est bien démarré
sleep 2
pm2 show 1 | grep "status" | grep "online" > /dev/null || { echo "⚠️  Le serveur n'est pas en ligne"; exit 1; }

echo "✅ Serveur redémarré avec succès"

# ─────────────────────────────────────────────────────────────
# 4. FIN DU DÉPLOIEMENT
# ─────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════════"
echo "✨ Déploiement terminé avec succès !"
echo "════════════════════════════════════════════════════════════"
echo ""

exit 0
