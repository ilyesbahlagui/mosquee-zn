# 📂 Structure du Projet — Mosquée Lumière et Piété Nîmes

## 📋 Vue d'ensemble

```
client/site new/
│
├── 📄 index.html                 # Page principale du site
├── 📄 index-template.html        # Template de sauvegarde
│
├── 🌐 robots.txt                 # Instructions pour les robots Google
├── 🗺️ sitemap.xml                # Plan du site pour SEO
├── ⚙️ .htaccess                  # Configuration Apache (SSL, cache, compression)
│
├── 📚 SEO-GUIDE.md               # Guide complet SEO avec instructions
├── 📚 STRUCTURE.md               # Ce fichier
│
└── 📁 assets/                    # Tous les fichiers médias et ressources
    │
    ├── 📱 site.webmanifest       # Configuration PWA (application mobile)
    │
    ├── 📁 css/
    │   └── style.css             # Feuille de style principale (commentée)
    │
    ├── 📁 js/
    │   └── main.js               # Scripts JavaScript (commentés)
    │
    ├── 📁 images/                # Images du site
    │   ├── ⚠️ favicon-16x16.png           # (À CRÉER)
    │   ├── ⚠️ favicon-32x32.png           # (À CRÉER)
    │   ├── ⚠️ apple-touch-icon.png        # (À CRÉER)
    │   ├── ⚠️ og-image.jpg                # (À CRÉER)
    │   ├── ⚠️ twitter-card.jpg            # (À CRÉER)
    │   ├── ⚠️ icon-192x192.png            # (À CRÉER)
    │   ├── ⚠️ icon-512x512.png            # (À CRÉER)
    │   ├── ⚠️ logo.png                    # (À CRÉER)
    │   └── ⚠️ header.avif                 # (À CRÉER) - Image de fond du hero
    │
    └── 📁 fichiers/              # Documents téléchargeables
        ├── ⚠️ rib.pdf                     # (À CRÉER) - RIB de la mosquée
        ├── ⚠️ video-parking.mp4           # (À CRÉER) - Vidéo du terrain
        └── ⚠️ poster-parking.jpg          # (À CRÉER) - Miniature vidéo
```

---

## 🖼️ Images manquantes à créer

### 1️⃣ **Favicons (icônes du site dans les onglets)**

| Fichier | Taille | Description |
|---------|--------|-------------|
| `favicon-16x16.png` | 16x16 px | Icône onglet (petite taille) |
| `favicon-32x32.png` | 32x32 px | Icône onglet (grande taille) |
| `apple-touch-icon.png` | 180x180 px | Icône iOS (écran d'accueil) |

**Contenu suggéré :** Logo de la mosquée ou icône de mosquée stylisée

**Outil en ligne :** https://realfavicongenerator.net/

---

### 2️⃣ **Images SEO (réseaux sociaux)**

| Fichier | Taille | Description |
|---------|--------|-------------|
| `og-image.jpg` | 1200x630 px | Aperçu Facebook, WhatsApp |
| `twitter-card.jpg` | 1200x630 px | Aperçu Twitter/X |

**Contenu suggéré :** 
- Logo + "Mosquée Lumière et Piété - Nîmes"
- Texte du projet actuel (ex: "Projet Parking Ramadan 2026")
- Fond attractif (couleur beige/orange)

**Outil en ligne :** Canva, Photopea, ou Photoshop

---

### 3️⃣ **Icônes PWA (application mobile)**

| Fichier | Taille | Description |
|---------|--------|-------------|
| `icon-192x192.png` | 192x192 px | Icône app Android (petite) |
| `icon-512x512.png` | 512x512 px | Icône app Android (grande) |

**Contenu suggéré :** Logo de la mosquée sur fond uni

---

### 4️⃣ **Images du site**

| Fichier | Taille | Description |
|---------|--------|-------------|
| `logo.png` | Libre | Logo principal de la mosquée |
| `header.avif` | 1920x1080 px | Image de fond du hero (entrée de la mosquée) |

**Format AVIF recommandé** pour la performance (80% moins lourd que JPG)

**Conversion AVIF :** https://avif.io/ ou https://squoosh.app/

---

### 5️⃣ **Documents & Médias**

| Fichier | Format | Description |
|---------|--------|-------------|
| `rib.pdf` | PDF | Relevé d'Identité Bancaire de la mosquée |
| `video-parking.mp4` | MP4 (H.264) | Vidéo de présentation du terrain (30-60 sec) |
| `poster-parking.jpg` | 1280x720 px | Image miniature de la vidéo |

**Compression vidéo :** HandBrake ou CloudConvert

---

## 🔧 Actions à effectuer avant mise en ligne

### ✅ Checklist technique

- [ ] **Créer toutes les images manquantes** (voir liste ci-dessus)
- [ ] **Remplacer le nom de domaine** dans tous les fichiers :
  - [ ] `index.html` (meta tags)
  - [ ] `sitemap.xml`
  - [ ] `robots.txt`
  - [ ] `.htaccess` (si utilisé)
- [ ] **Modifier les coordonnées réelles** :
  - [ ] Adresse complète
  - [ ] Numéro de téléphone
  - [ ] Email de contact
  - [ ] Liens réseaux sociaux (Facebook, Instagram, Snapchat)
- [ ] **Tester le site en local** avant mise en ligne
- [ ] **Vérifier la responsiveness** (mobile, tablette, desktop)

---

### ✅ Checklist SEO (après mise en ligne)

- [ ] Créer un compte **Google Search Console**
- [ ] Soumettre le `sitemap.xml` à Google
- [ ] Créer un compte **Bing Webmaster Tools**
- [ ] Créer une fiche **Google My Business** (référencement local)
- [ ] Tester la vitesse : https://pagespeed.web.dev/
- [ ] Tester les données structurées : https://search.google.com/test/rich-results
- [ ] Tester le partage Facebook : https://developers.facebook.com/tools/debug/

---

## 📊 Performance actuelle

### ✅ Points forts :
- ✅ **HTML, CSS, JS séparés** (bonne organisation)
- ✅ **Commentaires détaillés** (facile à maintenir)
- ✅ **Meta tags SEO complets** (titre, description, Open Graph, Schema.org)
- ✅ **Responsive** (mobile-first)
- ✅ **Accessibilité** (balises sémantiques)

### ⚠️ À améliorer :
- ⚠️ **Images manquantes** (favicon, OG image, logo)
- ⚠️ **Compression images** (passer en AVIF/WebP)
- ⚠️ **Certificat SSL** (HTTPS obligatoire pour Google)
- ⚠️ **Lazy loading images** (charger les images au scroll)

---

## 📝 Logs de modifications

| Date | Auteur | Modifications |
|------|--------|---------------|
| 26/02/2026 | Équipe dev | Création structure complète + SEO optimisé |

---

## 📞 Support

Pour toute question technique, consulter :
- **SEO-GUIDE.md** — Guide complet du référencement
- **index.html** — Commentaires dans le code HTML
- **assets/css/style.css** — Commentaires dans le CSS
- **assets/js/main.js** — Commentaires dans le JavaScript

---

**Version :** 1.0  
**Dernière mise à jour :** 26 février 2026
