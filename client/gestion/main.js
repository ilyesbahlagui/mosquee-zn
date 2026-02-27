const API_BASE_URL = 'http://localhost:3000';

async function fetchAmounts() {
  const amountsDisplay = document.getElementById('amounts-display');
  const amountsError = document.getElementById('amounts-error');

  try {
    const response = await fetch(`${API_BASE_URL}/amount`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.ok === false) {
      throw new Error(data.error || 'Erreur lors de la récupération des montants');
    }

    displayAmounts(data);
    amountsError.style.display = 'none';
  } catch (error) {
    console.error('Erreur lors de la récupération des montants:', error);
    amountsDisplay.innerHTML = '';
    amountsError.textContent = 'Erreur de récupération des montants';
    amountsError.style.display = 'block';
  }
}

function displayAmounts(data) {
  const amountsDisplay = document.getElementById('amounts-display');

  const amountTypes = [
    { key: 'cotizup', label: 'CotizUp' },
    { key: 'banque', label: 'Banque' }
  ];

  amountsDisplay.innerHTML = amountTypes.map(({ key, label }) => {
    const amount = data[key];
    if (!amount || !amount.ok) {
      return `
        <div class="amount-card">
          <h3>${label}</h3>
          <div class="amount-value">-</div>
          <div class="amount-date">Données non disponibles</div>
        </div>
      `;
    }

    return `
      <div class="amount-card">
        <h3>${label}</h3>
        <div class="amount-value">${amount.amount.toFixed(2)} €</div>
        <div class="amount-date">Mis à jour le ${amount.updatedAt}</div>
      </div>
    `;
  }).join('');

  // Mettre à jour le compteur total
  updateTotalCounter(data);
}

function updateTotalCounter(data) {
  const targetAmount = 150000; // Objectif de 150 000 euros
  let totalAmount = 0;

  // Calculer la somme de tous les montants disponibles
  const amountTypes = ['cotizup', 'banque'];
  amountTypes.forEach(type => {
    const amount = data[type];
    if (amount && amount.ok && amount.amount) {
      totalAmount += amount.amount;
    }
  });

  // Calculer le pourcentage (sans limitation à 100%)
  const actualPercentage = (totalAmount / targetAmount) * 100;
  const percentage = Math.min(actualPercentage, 100); // Pour la barre visuelle

  // Mettre à jour les éléments du DOM
  const totalCurrentElement = document.getElementById('total-current');
  const progressFillElement = document.getElementById('progress-fill');
  const progressPercentElement = document.getElementById('progress-percent');
  const progressBarElement = document.querySelector('.progress-bar');

  // Forcer les styles de la barre conteneur
  if (progressBarElement) {
    progressBarElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    progressBarElement.style.borderRadius = '25px';
    progressBarElement.style.height = '20px';
    progressBarElement.style.border = '2px solid rgba(255, 255, 255, 0.6)';
    progressBarElement.style.overflow = 'hidden';
    progressBarElement.style.position = 'relative';
    progressBarElement.style.width = '100%';
  }

  if (totalCurrentElement) {
    totalCurrentElement.textContent = totalAmount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  if (progressFillElement) {
    // Valeurs dynamiques normales
    progressFillElement.style.width = `${percentage}%`;
    progressFillElement.style.height = '100%';
    progressFillElement.style.backgroundColor = actualPercentage >= 100 ? '#27ae60' : '#f1c40f';
    progressFillElement.style.display = 'block';
    progressFillElement.style.borderRadius = '25px';
    progressFillElement.style.transition = 'width 0.8s ease-in-out';
  }

  if (progressPercentElement) {
    // Afficher le vrai pourcentage même s'il dépasse 100%
    progressPercentElement.textContent = actualPercentage.toFixed(1);
  }

  // Afficher un message de statut selon la progression
  const statusMessage = document.getElementById('status-message');
  
  if (statusMessage) {
    if (actualPercentage >= 100) {
      statusMessage.textContent = `🎉 OBJECTIF DÉPASSÉ ! (${(actualPercentage - 100).toFixed(1)}% en plus)`;
      statusMessage.style.color = '#27ae60';
      statusMessage.style.fontWeight = 'bold';
    } else {
      statusMessage.textContent = `Il reste ${(targetAmount - totalAmount).toLocaleString('fr-FR', {maximumFractionDigits: 0})} € à collecter`;
      statusMessage.style.color = 'rgba(255, 255, 255, 0.8)';
    }
  }
}

function initializeTotalCounter() {
  // Initialiser la barre de progression avec des valeurs par défaut
  const totalCurrentElement = document.getElementById('total-current');
  const progressFillElement = document.getElementById('progress-fill');
  const progressPercentElement = document.getElementById('progress-percent');

  if (totalCurrentElement) {
    totalCurrentElement.textContent = '0,00';
  }

  if (progressFillElement) {
    progressFillElement.style.width = '0%';
  }

  if (progressPercentElement) {
    progressPercentElement.textContent = '0.0';
  }
}

function showMessage(containerId, type, text) {
  const container = document.getElementById(containerId);
  const messageClass = type === 'success' ? 'success-message' : 'error-message';

  container.innerHTML = `<div class="${messageClass}">${text}</div>`;

  setTimeout(() => {
    container.innerHTML = '';
  }, 3000);
}

async function updateAmount(type) {
  const form = document.getElementById(`form-${type}`);
  const messageContainerId = `message-${type}`;
  const formData = new FormData(form);
  const montant = formData.get('montant');
  const code = formData.get('code');

  try {
    const url = `${API_BASE_URL}/${type}?montant=${encodeURIComponent(montant)}&code=${encodeURIComponent(code)}`;
    const response = await fetch(url);

    const data = await response.json();

    if (response.ok && response.status === 200) {
      const message = data.message || 'Montant mis à jour avec succès';
      showMessage(messageContainerId, 'success', message);
      form.reset();
      await fetchAmounts();
    } else {
      const errorMessage = data.error || 'Une erreur est survenue';
      showMessage(messageContainerId, 'error', errorMessage);
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du montant ${type}:`, error);
    showMessage(messageContainerId, 'error', 'Erreur de connexion au serveur');
  }
}

function setupFormHandlers() {
  const formBanque = document.getElementById('form-banque');

  formBanque.addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateAmount('banque');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation de la barre de progression
  initializeTotalCounter();
  
  // Chargement initial des montants
  fetchAmounts();
  
  setupFormHandlers();
  
  setInterval(() => {
    fetchAmounts();
  }, 60000);
});
