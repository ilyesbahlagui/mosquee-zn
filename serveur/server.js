import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// charger variables d'environnement depuis .env si présent
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 30903;

// Domaines autorisés pour le CORS
const allowedOrigins = [
  'https://mosquee-lumiere-piete.fr',
  'https://mosquee-zn.ib-app.fr',
  'https://mosquee-zn-gestion.ib-app.fr'
];

// Configuration CORS pour autoriser uniquement les domaines spécifiés
app.use(cors({
  origin: function (origin, callback) {
    // Autorise si l'origine est dans la liste ou si la requête n'a pas d'origine (comme curl ou tests locaux)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

const OUT_FILE = path.join(__dirname, 'amount.json');
// Code requis pour modifier les montants (stocké dans .env pour plus de sécurité)
const SECURITY_CODE = process.env.SECURITY_CODE

// Format date : jj-mm-aaaa hh:mm:ss (Fuseau horaire Paris)
function formatDate() {
  const now = new Date();
  // Utiliser Intl.DateTimeFormat pour le fuseau Europe/Paris
  const options = {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  // Format : jj-mm-aaaa hh:mm:ss
  const parts = new Intl.DateTimeFormat('fr-FR', options).formatToParts(now);
  const get = type => parts.find(p => p.type === type)?.value;
  const day = get('day');
  const month = get('month');
  const year = get('year');
  const hours = get('hour');
  const minutes = get('minute');
  const seconds = get('second');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// Met à jour un montant banque
function updateAmount(type, montant, code) {
  // Vérif code sécurité
  if (code !== SECURITY_CODE) {
    return { error: 'Code de sécurité invalide', status: 401 };
  }
  
  // Vérif format montant (accepte . et ,)
  if (!montant || !/^\d+[.,]?\d*$/.test(montant)) {
    return { error: 'Montant invalide', status: 400 };
  }
  
  const amount = parseFloat(montant.toString().replace(',', '.')); // Virgule → point
  
  let data;
  
  // Créer structure par défaut
  const defaultData = {
    cotizup: { ok: true, amount: 0, updatedAt: formatDate() },
    banque: { ok: true, amount: 0, updatedAt: formatDate() }
  };
  
  try {
    if (!fs.existsSync(OUT_FILE)) {
      data = defaultData;
    } else {
      const fileContent = fs.readFileSync(OUT_FILE, 'utf8').trim();
      if (!fileContent) {
        // Fichier vide
        data = defaultData;
      } else {
        data = JSON.parse(fileContent);
        // Vérifier si la structure existe
        if (!data[type]) {
          data[type] = { ok: true, amount: 0, updatedAt: formatDate() };
        }
      }
    }
  } catch (err) {
    // Fichier corrompu
    data = defaultData;
  }
  
  // Mise à jour du montant
  data[type].amount = amount;
  data[type].updatedAt = formatDate();
  
  fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
  
  return { 
    success: true, 
    message: `Montant ${type} mis à jour avec succès`,
    data: data[type]
  };
}

// GET /amount - Retourne tous les montants
app.get('/amount', (req, res) => {
  try {
    if (!fs.existsSync(OUT_FILE)) {
      return res.status(404).json({ ok: false, error: 'Fichier JSON introuvable' });
    }
    const data = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /banque?montant=X&code=Y - Maj montant banque
app.get('/banque', (req, res) => {
  try {
    const { montant, code } = req.query;
    const result = updateAmount('banque', montant, code);
    
    if (result.error) {
      return res.status(result.status).json({ ok: false, error: result.error });
    }
    
    return res.status(200).json({ 
      ok: true, 
      message: result.message,
      banque: result.data
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ API dispo sur http://localhost:${PORT}`);
  console.log(`📋 Routes disponibles :`);
  console.log(`   GET /amount - Voir tous les montants`);
  console.log(`   GET /banque?montant=X&code=Y - Maj banque`);
});
