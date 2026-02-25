// Configuration
const GOAL = 500000;
const REFRESH_INTERVAL = 60000; // 60 secondes
const API_URL = 'https://compteur-mosquee-tarascon.ib-app.fr/amount';

// Variables globales
let data = null;
let fetchInterval = null;

// Éléments DOM
const elements = {
    counterCurrent: document.querySelector('.counter-current'),
    progressFill: document.querySelector('.progress-fill'),
    progressText: document.querySelector('.progress-text'),
    leetchiAmount: document.getElementById('leetchi-amount'),
    banqueAmount: document.getElementById('banque-amount')
};

// Fonctions utilitaires
function formatAmount(amount) {
    return amount.toLocaleString('fr-FR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}



function updateDisplay() {
    if (!data) return;
    
    const leetchiAmount = parseFloat(data.leetchi) || 0;
    const banqueAmount = parseFloat(data.banque) || 0;
    const totalAmount = leetchiAmount + banqueAmount;
    const remainingAmount = Math.max(0, GOAL - totalAmount);
    const progress = Math.min((totalAmount / GOAL) * 100, 100);
    
    // Animation du compteur principal
    if (elements.counterCurrent) {
        const currentValue = parseInt(elements.counterCurrent.textContent.replace(/[^0-9]/g, '')) || 0;
        animateCounter(elements.counterCurrent, currentValue, totalAmount);
    }
    
    // Mise à jour de la barre de progression
    if (elements.progressFill) {
        elements.progressFill.style.width = `${progress}%`;
    }
    
    // Mise à jour du texte de progression avec animation
    if (elements.progressText) {
        animatePercentage(0, progress);
    }
    
    // Mise à jour des cartes individuelles
    if (elements.leetchiAmount) {
        elements.leetchiAmount.textContent = formatAmount(leetchiAmount) + ' €';
    }
    
    if (elements.banqueAmount) {
        elements.banqueAmount.textContent = formatAmount(banqueAmount) + ' €';
    }
}

function animateCounter(element, start, end, duration = 2000) {
    if (!element) return;
    
    const startTime = performance.now();
    const difference = end - start;
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = start + (difference * easedProgress);
        
        if (progress < 1) {
            element.textContent = Math.round(current).toLocaleString('fr-FR');
            requestAnimationFrame(updateCounter);
        } else {
            // S'assurer que la valeur finale est exactement correcte
            element.textContent = Math.round(end).toLocaleString('fr-FR');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animatePercentage(startPercent, endPercent, duration = 2000) {
    if (!elements.progressText) return;
    
    const startTime = performance.now();
    const difference = endPercent - startPercent;
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function updatePercentage(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentPercent = startPercent + (difference * easedProgress);
        
        const total = (currentPercent / 100) * GOAL;
        const remaining = Math.max(GOAL - total, 0);
        
        if (progress < 1) {
            if (total >= GOAL) {
                elements.progressText.textContent = `🎉 Objectif atteint ! ${currentPercent.toFixed(1)}% collecté`;
            } else {
                elements.progressText.textContent = `${currentPercent.toFixed(1)}% collecté - Il reste ${formatAmount(remaining)} € à collecter`;
            }
            requestAnimationFrame(updatePercentage);
        } else {
            // Valeur finale exacte
            const finalTotal = (endPercent / 100) * GOAL;
            const finalRemaining = Math.max(GOAL - finalTotal, 0);
            
            if (finalTotal >= GOAL) {
                elements.progressText.textContent = `🎉 Objectif atteint ! ${endPercent.toFixed(1)}% collecté`;
            } else {
                elements.progressText.textContent = `${endPercent.toFixed(1)}% collecté - Il reste ${formatAmount(finalRemaining)} € à collecter`;
            }
        }
    }
    
    requestAnimationFrame(updatePercentage);
}

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des données');
        }
        
        const result = await response.json();
        
        // Traitement des données selon la structure de l'API
        const transformedData = {
            leetchi: 0,
            banque: 0
        };
        
        if (result.leetchi && result.leetchi.ok && typeof result.leetchi.amount === 'number') {
            transformedData.leetchi = result.leetchi.amount;
        }
        
        if (result.banque && result.banque.ok && typeof result.banque.amount === 'number') {
            transformedData.banque = result.banque.amount;
        }
        
        // Fallback sur l'ancienne structure
        if (result.ok && typeof result.amount === 'number') {
            transformedData.leetchi = result.amount;
        }
        
        data = transformedData;
        lastUpdate = new Date();
        
        updateDisplay();
        
    } catch (err) {
        console.error('Erreur:', err);
        // En cas d'erreur, garder les données précédentes
    }
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
}



// Gestion du cycle de vie de la page
function init() {
    // Chargement initial
    fetchData();
    
    // Démarrage du rafraîchissement automatique
    startAutoRefresh();
}

// Gestion de la visibilité de la page (pause quand l'onglet n'est pas visible)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopIntervals();
    } else {
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