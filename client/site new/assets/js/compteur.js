/* ══════════════════════════════════════════════════════════════
   COMPTEUR.JS — Script du compteur de dons en temps réel
   Actualisation : Chaque minute (60 secondes)
   ══════════════════════════════════════════════════════════════ */

// ══════════════════════════════════════════════════════════════
// 1. HORLOGE EN TEMPS RÉEL
// ══════════════════════════════════════════════════════════════

const horlogeDateEl = document.getElementById('horloge-date');
const horlogeTimeEl = document.getElementById('horloge-time');

function mettreAJourHorloge() {
    const maintenant = new Date();
    
    // Format date : Vendredi 27 Février 2026
    const optionsDate = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateFormatee = maintenant.toLocaleDateString('fr-FR', optionsDate);
    
    // Format heure : 14:30:25
    const heures = String(maintenant.getHours()).padStart(2, '0');
    const minutes = String(maintenant.getMinutes()).padStart(2, '0');
    const secondes = String(maintenant.getSeconds()).padStart(2, '0');
    const heureFormatee = `${heures}:${minutes}:${secondes}`;
    
    // Capitaliser première lettre de la date
    horlogeDateEl.textContent = dateFormatee.charAt(0).toUpperCase() + dateFormatee.slice(1);
    horlogeTimeEl.textContent = heureFormatee;
}

// Met à jour l'horloge toutes les secondes
setInterval(mettreAJourHorloge, 1000);
mettreAJourHorloge(); // Appel initial

// ══════════════════════════════════════════════════════════════
// 2. COMPTEUR DE DONS EN TEMPS RÉEL
// ══════════════════════════════════════════════════════════════

// Configuration
const API_URL = 'http://localhost:3000/amount';
const OBJECTIF = 150000; // Objectif en euros
const UPDATE_INTERVAL = 60000; // 1 minute en millisecondes

// Éléments DOM
const montantTotalEl = document.getElementById('montant-total');
const objectifEl = document.getElementById('objectif');
const pourcentageEl = document.getElementById('pourcentage');
const montantRestantEl = document.getElementById('montant-restant');
const jaugeProgressionEl = document.getElementById('jauge-progression');
const montantBanqueEl = document.getElementById('montant-banque');
const montantCotizupEl = document.getElementById('montant-cotizup');
const dateBanqueEl = document.getElementById('date-banque');
const dateCotizupEl = document.getElementById('date-cotizup');
const compteurStatusEl = document.getElementById('compteur-status');
const compteurSuccessEl = document.getElementById('compteur-success');
const successMontantFinalEl = document.getElementById('success-montant-final');

// Variables globales
let updateIntervalId = null;

// ══════════════════════════════════════════════════════════════
// 3. FONCTIONS UTILITAIRES
// ══════════════════════════════════════════════════════════════

// Formater un montant en euros
function formaterMontant(montant) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}

// Animer un changement de valeur
function animerValeur(element, nouvelleValeur, duree = 1000) {
    const valeurActuelle = parseFloat(element.textContent.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
    const difference = nouvelleValeur - valeurActuelle;
    const debut = Date.now();
    
    const animation = setInterval(() => {
        const temps = Date.now() - debut;
        const progression = Math.min(temps / duree, 1);
        
        // Easing function (ease-out)
        const easing = 1 - Math.pow(1 - progression, 3);
        const valeurIntermediaire = valeurActuelle + (difference * easing);
        
        element.textContent = formaterMontant(valeurIntermediaire);
        
        if (progression >= 1) {
            clearInterval(animation);
            element.textContent = formaterMontant(nouvelleValeur);
        }
    }, 16); // ~60fps
}

// Formater une date
function formaterDate(dateString) {
    // Format: "26-02-2026 12:09:24"
    if (!dateString || dateString === '--') return '--';
    
    const [datePart, timePart] = dateString.split(' ');
    const [jour, mois, annee] = datePart.split('-');
    const [heure, minute] = timePart.split(':');
    
    return `${jour}/${mois}/${annee} à ${heure}:${minute}`;
}

// ══════════════════════════════════════════════════════════════
// 4. RÉCUPÉRATION ET AFFICHAGE DES DONNÉES
// ══════════════════════════════════════════════════════════════

async function recupererDonnees() {
    try {
        // Affiche le statut de chargement
        compteurStatusEl.innerHTML = `
            <i class="fa-solid fa-sync fa-spin"></i>
            <span>Actualisation des données...</span>
        `;
        compteurStatusEl.classList.remove('hidden');
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Calcule le total
        const montantBanque = data.banque?.amount || 0;
        const montantCotizup = data.leetchi?.amount || 0;
        const montantTotal = montantBanque + montantCotizup;
        
        // Calcule le pourcentage
        const pourcentage = Math.min((montantTotal / OBJECTIF) * 100, 100);
        const montantRestant = Math.max(OBJECTIF - montantTotal, 0);
        
        // Met à jour l'affichage avec animations
        animerValeur(montantTotalEl, montantTotal);
        animerValeur(montantBanqueEl, montantBanque);
        animerValeur(montantCotizupEl, montantCotizup);
        animerValeur(montantRestantEl, montantRestant);
        
        // Met à jour le pourcentage
        pourcentageEl.textContent = `${Math.round(pourcentage)}%`;
        
        // Met à jour la jauge de progression
        jaugeProgressionEl.style.width = `${pourcentage}%`;
        
        // Met à jour l'objectif
        objectifEl.textContent = formaterMontant(OBJECTIF);
        
        // Met à jour les dates
        dateBanqueEl.textContent = formaterDate(data.banque?.updatedAt);
        dateCotizupEl.textContent = formaterDate(data.leetchi?.updatedAt);
        
        // Cache le statut après un court délai
        setTimeout(() => {
            compteurStatusEl.innerHTML = `
                <i class="fa-solid fa-check-circle"></i>
                <span>Données à jour</span>
            `;
            setTimeout(() => {
                compteurStatusEl.classList.add('hidden');
            }, 2000);
        }, 500);
        
        // Vérifie si l'objectif est atteint
        if (montantTotal >= OBJECTIF) {
            afficherMessageReussite(montantTotal);
        }
        
        console.log('✅ Données actualisées:', {
            montantTotal: formaterMontant(montantTotal),
            pourcentage: `${Math.round(pourcentage)}%`,
            objectif: formaterMontant(OBJECTIF)
        });
        
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des données:', error);
        compteurStatusEl.innerHTML = `
            <i class="fa-solid fa-exclamation-triangle"></i>
            <span>Erreur de connexion au serveur</span>
        `;
        compteurStatusEl.style.background = '#FEE2E2';
        compteurStatusEl.style.color = '#DC2626';
    }
}

// ══════════════════════════════════════════════════════════════
// 5. MESSAGE DE RÉUSSITE
// ══════════════════════════════════════════════════════════════

function afficherMessageReussite(montantFinal) {
    successMontantFinalEl.textContent = formaterMontant(montantFinal);
    compteurSuccessEl.classList.add('active');
    
    // Arrête les actualisations automatiques
    if (updateIntervalId) {
        clearInterval(updateIntervalId);
        updateIntervalId = null;
        console.log('🎉 Objectif atteint ! Actualisation automatique arrêtée.');
    }
}

// ══════════════════════════════════════════════════════════════
// 6. INITIALISATION
// ══════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation du compteur de dons...');
    
    // Récupération immédiate des données
    recupererDonnees();
    
    // Actualisation automatique toutes les minutes
    updateIntervalId = setInterval(recupererDonnees, UPDATE_INTERVAL);
    
    console.log(`⏰ Actualisation automatique configurée (toutes les ${UPDATE_INTERVAL / 1000} secondes)`);
});

// Nettoyage à la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (updateIntervalId) {
        clearInterval(updateIntervalId);
        console.log('🛑 Actualisation automatique arrêtée');
    }
});
