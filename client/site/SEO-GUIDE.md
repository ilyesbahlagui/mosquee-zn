# 📚 Guide SEO & Mots-Clés — Mosquée Lumière et Piété Nîmes

Ce document explique comment **optimiser le référencement du site** et **mettre à jour les mots-clés** au fil de l'évolution du projet.

---

## 🎯 Éléments SEO à mettre à jour régulièrement

### 1️⃣ **Titre de la page** (`<title>`)
📍 **Fichier :** `index.html` (ligne ~16)

```html
<title>Mosquée Lumière et Piété Nîmes | Projet Parking Ramadan 2026</title>
```

**Recommandations :**
- **50-60 caractères maximum**
- Inclure le nom de la mosquée + ville + projet/événement actuel
- Exemples selon contexte :
  - `Mosquée Lumière et Piété Nîmes | Horaires Prière & Dons`
  - `Mosquée Nîmes | Collecte Ramadan 2026 - Projet Parking`
  - `Mosquée Lumière et Piété | Lieu de Culte à Nîmes (30000)`

---

### 2️⃣ **Description** (`<meta name="description">`)
📍 **Fichier :** `index.html` (ligne ~22)

```html
<meta name="description" content="Soutenez l'acquisition du parking de la Mosquée Lumière et Piété à Nîmes. Projet Ramadan 2026 : 1500 m² à financer. Dons en ligne sécurisés, horaires de prière, actualités.">
```

**Recommandations :**
- **150-160 caractères maximum**
- Décrire l'objectif actuel (projet, événement, services)
- Intégrer naturellement vos **mots-clés principaux**
- Exemples :
  - `Mosquée Lumière et Piété à Nîmes. Horaires de prière quotidiennes, événements Ramadan, Aïd, Salat Janaza. Soutenez nos projets de la communauté musulmane nimoise.`

---

### 3️⃣ **Mots-clés** (`<meta name="keywords">`)
📍 **Fichier :** `index.html` (ligne ~27)

```html
<meta name="keywords" content="mosquée nîmes, mosquée lumière et piété, mosquée 30000, don mosquée, parking mosquée, horaire prière nîmes, ramadan nîmes, projet mosquée, salat janaza nîmes, lieu de culte nîmes, islam nîmes">
```

**Recommandations :**
- Liste de **10-15 mots-clés** séparés par des virgules
- Mélanger :
  - **Mots-clés génériques** : `mosquée nîmes`, `islam nîmes`, `lieu de culte`
  - **Mots-clés locaux** : `mosquée 30000`, `prière gard`
  - **Mots-clés longue traîne** : `horaire prière mosquée nîmes`, `don mosquée en ligne`
  - **Événements/projets** : `ramadan nîmes`, `collecte mosquée`, `parking mosquée`

#### 🔄 Exemples de mots-clés selon la période :

**Pendant Ramadan :**
```
ramadan nîmes, horaire iftar nimes, tarawih mosquée nîmes, collecte ramadan, don ramadan, mosquée nîmes ramadan 2026
```

**Pendant Aïd :**
```
aid nîmes, prière aid mosquée nîmes, horaire aid 2026 nîmes, fête aid gard
```

**Projet parking / collecte :**
```
don mosquée nîmes, financer mosquée, projet parking mosquée, achat terrain mosquée, soutenir mosquée nîmes
```

---

### 4️⃣ **Open Graph** (partage réseaux sociaux)
📍 **Fichier :** `index.html` (lignes ~49-58)

**À mettre à jour :**
- `og:title` : titre court et accrocheur
- `og:description` : description concise du projet actuel
- `og:image` : **image d'aperçu** (1200x630px recommandé)
- `og:url` : URL de la page (avec votre vrai nom de domaine)

**Exemple d'image OG à créer :**
- Dimensions : **1200 x 630 px**
- Contenu : Logo + texte clé (ex: "Projet Parking Ramadan 2026 - Soutenez-nous")
- Format : JPG ou PNG
- Emplacement : `assets/images/og-image.jpg`

---

### 5️⃣ **Schema.org (données structurées)**
📍 **Fichier :** `index.html` (lignes ~141-211)

**À mettre à jour régulièrement :**

#### 📍 Coordonnées :
```json
"address": {
  "streetAddress": "Rue de la cavalerie",  // ⚠️ Adresse réelle
  "postalCode": "30000"
},
"telephone": "+33466676869",  // ⚠️ Numéro réel
"email": "contact@mosquee-nimes.fr"  // ⚠️ Email réel
```

#### 🌐 Réseaux sociaux :
```json
"sameAs": [
  "https://www.facebook.com/mosquee-nimes",      // ⚠️ Vos vrais liens
  "https://www.instagram.com/mosquee_nimes",
  "https://www.snapchat.com/add/mosquee_nimes"
]
```

#### 📅 Événements :
Changer selon le projet actuel :
```json
"event": {
  "name": "Projet Parking Ramadan 2026",  // ⚠️ Nom de l'événement
  "description": "Collecte de fonds pour l'acquisition d'un parking de 1500 m²",
  "startDate": "2026-02-01",  // ⚠️ Date de début
  "endDate": "2026-04-30"     // ⚠️ Date de fin
}
```

---

## 📝 Fichiers SEO supplémentaires

### 🗺️ **sitemap.xml**
📍 **Fichier :** `sitemap.xml`

**À mettre à jour :**
- Remplacer `https://mosquee-lumiere-piete-nimes.fr/` par votre **vrai nom de domaine**
- Mettre à jour les dates `<lastmod>` quand vous modifiez une section
- Ajouter de nouvelles pages si le site évolue

**Soumission du sitemap :**
1. Google Search Console : https://search.google.com/search-console
2. Bing Webmaster Tools : https://www.bing.com/webmasters

---

### 🤖 **robots.txt**
📍 **Fichier :** `robots.txt`

Indique aux moteurs de recherche quelles pages explorer.
- Mettre à jour l'URL du sitemap avec votre vrai domaine

---

### 📱 **site.webmanifest (PWA)**
📍 **Fichier :** `assets/site.webmanifest`

Configuration pour transformer le site en **application mobile** (PWA).
- Mettre à jour les chemins des icônes
- Créer les icônes : `icon-192x192.png` et `icon-512x512.png`

---

## 🏆 Checklist SEO complète

### ✅ Avant la mise en ligne :
- [ ] Remplacer tous les `mosquee-lumiere-piete-nimes.fr` par le **vrai nom de domaine**
- [ ] Créer les images :
  - [ ] `favicon.ico` (16x16, 32x32)
  - [ ] `apple-touch-icon.png` (180x180)
  - [ ] `og-image.jpg` (1200x630)
  - [ ] `icon-192x192.png` et `icon-512x512.png`
- [ ] Vérifier tous les liens (email, téléphone, réseaux sociaux)
- [ ] Tester le site sur mobile

### ✅ Après la mise en ligne :
- [ ] Créer un compte **Google Search Console**
- [ ] Soumettre le sitemap à Google
- [ ] Créer un compte **Bing Webmaster Tools**
- [ ] Créer une page **Google My Business** (référencement local)
- [ ] Tester avec l'outil PageSpeed Insights : https://pagespeed.web.dev/

---

## 📊 Outils SEO recommandés

### Gratuits :
- **Google Search Console** (suivi performances SEO)
- **Google Analytics** (statistiques visiteurs)
- **PageSpeed Insights** (vitesse du site)
- **Rich Results Test** (test données structurées) : https://search.google.com/test/rich-results
- **Facebook Sharing Debugger** (test Open Graph) : https://developers.facebook.com/tools/debug/

### Extensions navigateur :
- **Meta SEO Inspector** (Chrome/Firefox)
- **SEO Meta in 1 Click** (Chrome)

---

## 🔄 Mise à jour saisonnière des mots-clés

### 🌙 **Ramadan (Mars-Avril)**
**Mots-clés prioritaires :**
```
ramadan nîmes, horaire iftar, tarawih, collecte ramadan, don ramadan, mosquée ramadan 2026
```

**Mise à jour :**
- Titre : `Mosquée Nîmes | Ramadan 2026 - Horaires Iftar & Tarawih`
- Description : `Horaires de prière Ramadan 2026 à la Mosquée Lumière et Piété de Nîmes. Iftar, Tarawih, collecte...`

---

### 🎉 **Aïd (2 fois par an)**
**Mots-clés prioritaires :**
```
aid nîmes, prière aid, horaire aid 2026, fête aid gard, mosquée aid
```

---

### ⚰️ **Salat Janaza (toute l'année)**
**Mots-clés prioritaires :**
```
salat janaza nîmes, prière funéraire mosquée nîmes, enterrement musulman gard
```

---

### 🏗️ **Projets de collecte**
**Mots-clés prioritaires :**
```
don mosquée nîmes, financer mosquée, projet mosquée, collecte en ligne, soutenir mosquée
```

---

## 📞 Support

Pour toute question sur la mise à jour du SEO, contactez le webmaster.

**Date de création :** 26 février 2026  
**Dernière mise à jour :** 26 février 2026
