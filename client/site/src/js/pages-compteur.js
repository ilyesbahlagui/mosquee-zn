// Configuration
const GOAL = 500000;
const REFRESH_INTERVAL = 60000; // 60 secondes
const API_URL = 'https://compteur-mosquee-tarascon.ib-app.fr/amount';

// Variables globales
let data = null;
let lastUpdate = null;
let countdown = 60;
let fetchInterval = null;
let countdownInterval = null;

// Éléments DOM
const elements = {
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('error-message'),
    dataContainer: document.getElementById('data-container'),
    totalAmount: document.getElementById('total-amount'),
    goalReached: document.getElementById('goal-reached'),
    progressPercentage: document.getElementById('progress-percentage'),
    progressPercentageValue: document.getElementById('progress-percentage-value'),
    remainingAmount: document.getElementById('remaining-amount'),
    progressFill: document.getElementById('progress-fill'),
    currentAmount: document.getElementById('current-amount'),
    leetchiAmount: document.getElementById('leetchi-amount'),
    leetchiDate: document.getElementById('leetchi-date'),
    banqueAmount: document.getElementById('banque-amount'),
    banqueDate: document.getElementById('banque-date'),
    countdownElement: document.getElementById('countdown')
};

// Fonctions utilitaires
function formatAmount(amount) {
    return amount.toLocaleString('fr-FR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }) + ' €';
}

function formatGoal(goal) {
    return goal.toLocaleString('fr-FR') + ' €';
}

function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.error.classList.add('hidden');
    elements.dataContainer.classList.add('hidden');
}

function showError(message) {
    elements.loading.classList.add('hidden');
    elements.error.classList.remove('hidden');
    elements.dataContainer.classList.add('hidden');
    elements.errorMessage.textContent = message;
}

function showData() {
    elements.loading.classList.add('hidden');
    elements.error.classList.add('hidden');
    elements.dataContainer.classList.remove('hidden');
}

function updateProgress(totalAmount) {
    const progress = (totalAmount / GOAL) * 100;
    const isGoalReached = progress >= 100;
    
    // Mise à jour de la barre de progression
    elements.progressFill.style.width = `${Math.min(progress, 100)}%`;
    
    // Affichage du pourcentage dans la barre - toujours visible
    elements.progressPercentageValue.textContent = `${progress.toFixed(1)}%`;
    elements.progressPercentageValue.style.display = 'inline';
    
    // Affichage du message d'objectif atteint
    if (isGoalReached) {
        elements.goalReached.classList.remove('hidden');
        elements.progressPercentage.textContent = progress.toFixed(1);
    } else {
        elements.goalReached.classList.add('hidden');
    }
}

function updateDisplay() {
    if (!data) return;
    
    const totalAmount = data.leetchi.amount + data.banque.amount;
    const remainingAmount = Math.max(0, GOAL - totalAmount);
    const progress = (totalAmount / GOAL) * 100;
    
    // Mise à jour du total
    elements.totalAmount.textContent = formatAmount(totalAmount);
    
    // Mise à jour du montant actuel dans la barre de progression
    elements.currentAmount.textContent = formatAmount(totalAmount);
    
    // Mise à jour du montant restant
    elements.remainingAmount.textContent = formatAmount(remainingAmount);
    
    // Mise à jour de la barre de progression
    updateProgress(totalAmount);
    
    // Mise à jour des cartes
    elements.leetchiAmount.textContent = formatAmount(data.leetchi.amount);
    elements.leetchiDate.textContent = '';
    
    elements.banqueAmount.textContent = formatAmount(data.banque.amount);
    elements.banqueDate.textContent = '';
}

function updateCountdown() {
    if (!lastUpdate) return;
    
    const now = new Date();
    const diff = Math.max(0, 60 - Math.floor((now.getTime() - lastUpdate.getTime()) / 1000));
    countdown = diff;
    
    elements.countdownElement.textContent = countdown;
}

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des données');
        }
        
        const result = await response.json();
        
        // Validation des données
        if (!result.leetchi || !result.banque) {
            throw new Error('Format de données invalide');
        }
        
        data = result;
        lastUpdate = new Date();
        countdown = 60;
        
        updateDisplay();
        showData();
        

        
    } catch (err) {
        showError(err.message || 'Une erreur est survenue');
    }
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(updateCountdown, 1000);
}

function startAutoRefresh() {
    if (fetchInterval) {
        clearInterval(fetchInterval);
    }
    
    fetchInterval = setInterval(fetchData, REFRESH_INTERVAL);
}

function stopIntervals() {
    if (fetchInterval) {
        clearInterval(fetchInterval);
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}

// Gestion du cycle de vie de la page
function init() {
    // Chargement initial
    showLoading();
    fetchData();
    
    // Démarrage des intervalles
    startCountdown();
    startAutoRefresh();
}

// Gestion de la visibilité de la page (pause quand l'onglet n'est pas visible)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopIntervals();
    } else {
        startCountdown();
        startAutoRefresh();
        // Actualiser immédiatement si la page redevient visible
        fetchData();
    }
});

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', function() {
    stopIntervals();
});



// Initialisation au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
