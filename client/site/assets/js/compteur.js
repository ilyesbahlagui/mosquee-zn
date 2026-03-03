// ══════════════════════════════════════════════════════════════
// 1. COMPTE À REBOURS (Temps restant TV)
// ══════════════════════════════════════════════════════════════

const DATE_LIMITE = new Date('2026-03-19T23:59:59');

const cdJours = document.getElementById('cd-j');
const cdHeures = document.getElementById('cd-h');
const cdMinutes = document.getElementById('cd-m');
const cdSecondes = document.getElementById('cd-s');

function mettreAJourCountdown() {
    const maintenant = new Date();
    const difference = DATE_LIMITE - maintenant;
    
    if (difference <= 0) {
        cdJours.textContent = '00';
        cdHeures.textContent = '00';
        cdMinutes.textContent = '00';
        cdSecondes.textContent = '00';
        return;
    }
    
    const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
    const heures = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const secondes = Math.floor((difference % (1000 * 60)) / 1000);
    
    cdJours.textContent = String(jours).padStart(2, '0');
    cdHeures.textContent = String(heures).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSecondes.textContent = String(secondes).padStart(2, '0');
}

setInterval(mettreAJourCountdown, 1000);
mettreAJourCountdown();

// ══════════════════════════════════════════════════════════════
// 2. COMPTEUR DE DONS (Actualisation auto)
// ══════════════════════════════════════════════════════════════

const API_URL = 'https://mosquee-zn-api.ib-app.fr/amount';
const OBJECTIF = 150000; 
const UPDATE_INTERVAL = 60000; 

const montantTotalEl = document.getElementById('montant-total');
const objectifEl = document.getElementById('objectif');
const pourcentageEl = document.getElementById('pourcentage');
const jaugeProgressionEl = document.getElementById('jauge-progression');
const montantBanqueEl = document.getElementById('montant-banque');
const montantCotizupEl = document.getElementById('montant-cotizup');
const compteurSuccessEl = document.getElementById('compteur-success');
const successMontantFinalEl = document.getElementById('success-montant-final');
const mainCardEl = document.getElementById('main-card');

let updateIntervalId = null;

function formaterMontant(montant) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(montant);
}

function animerValeur(element, nouvelleValeur, duree = 1000) {
    if(!element) return;
    const valeurActuelle = parseFloat(element.textContent.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
    const difference = nouvelleValeur - valeurActuelle;
    const debut = Date.now();
    
    const animation = setInterval(() => {
        const temps = Date.now() - debut;
        const progression = Math.min(temps / duree, 1);
        const easing = 1 - Math.pow(1 - progression, 3);
        const valeurIntermediaire = valeurActuelle + (difference * easing);
        
        element.textContent = formaterMontant(valeurIntermediaire);
        if (progression >= 1) {
            clearInterval(animation);
            element.textContent = formaterMontant(nouvelleValeur);
        }
    }, 16);
}

async function recupererDonnees() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur HTTP');
        
        const data = await response.json();
        const montantBanque = data.banque?.amount || 0;
        const montantCotizup = data.cotizup?.amount || 0;
        const montantTotal = montantBanque + montantCotizup;
        
        const pourcentage = Math.min((montantTotal / OBJECTIF) * 100, 100);
        
        animerValeur(montantTotalEl, montantTotal);
        animerValeur(montantBanqueEl, montantBanque);
        animerValeur(montantCotizupEl, montantCotizup);
        
        pourcentageEl.textContent = Math.round(pourcentage) + "%";
        jaugeProgressionEl.style.width = Math.round(pourcentage) + "%";
        objectifEl.textContent = formaterMontant(OBJECTIF);
        
        if (montantTotal >= OBJECTIF) {
            afficherMessageReussite(montantTotal);
        }
        
    } catch (error) {
        console.error("Erreur d'actualisation des données :", error);
    }
}

function afficherMessageReussite(montantFinal) {
    successMontantFinalEl.textContent = formaterMontant(montantFinal);
    compteurSuccessEl.style.display = 'block';
    mainCardEl.style.display = 'none'; 
    if (updateIntervalId) clearInterval(updateIntervalId);
}

window.addEventListener('DOMContentLoaded', () => {
    recupererDonnees();
    updateIntervalId = setInterval(recupererDonnees, UPDATE_INTERVAL);
});