/* ════════════════════════════════════════════════════════════════
   MAIN.JS — Scripts principaux du site Mosquée Lumière et Piété
   ════════════════════════════════════════════════════════════════
   
   Contenu :
   1. Navigation & Menu Mobile (hamburger)
   2. Scroll Effects (navbar sticky, bouton scroll-to-top)
   3. Fonction Copier (coordonnées bancaires)
   4. Carrousel Photos (galerie projet parking)
   5. Modal Lightbox (affichage plein écran images)
   6. API Dons (récupération montants + jauge de progression)
   
================================================================ */

// ════════════════════════════════════════════════════════════════
// 1. NAVIGATION & MENU MOBILE
// ════════════════════════════════════════════════════════════════

// ── Sélection des éléments DOM ──
const nav = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger-btn');
const menu = document.getElementById('nav-menu');
const menuLinks = document.querySelectorAll('.fixed-mosquee-menu-link');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// ── Scroll Effects : navbar sticky + bouton scroll-to-top ──
window.addEventListener('scroll', () => {
    // Ajoute classe "scrolled" à la navbar après 50px de défilement
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Affiche le bouton "retour haut" après 300px de défilement
    if (window.scrollY > 300) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');
});

// ── Toggle Menu Mobile (hamburger) ──
const toggleMenu = () => {
    hamburger.classList.toggle('open');
    menu.classList.toggle('open');
};

hamburger.addEventListener('click', toggleMenu);

// ── Ferme le menu mobile après clic sur un lien ──
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menu.classList.contains('open')) toggleMenu();
    });
});


// ════════════════════════════════════════════════════════════════
// 2. FONCTION COPIER (Coordonnées bancaires)
// ════════════════════════════════════════════════════════════════

/**
 * Copie le contenu d'un champ de texte dans le presse-papiers
 * @param {string} id - ID de l'input à copier
 * @param {HTMLElement} btn - Bouton qui a déclenché la copie
 */
function copy(id, btn) {
    const el = document.getElementById(id);
    el.select();
    navigator.clipboard.writeText(el.value);

    // Adaptation mobile : affiche uniquement l'icône sur petit écran
    const isMobile = window.innerWidth <= 600;
    const iconHTML = "<i class='fa-solid fa-check'></i>";

    btn.innerHTML = isMobile ? iconHTML : iconHTML + " <span class='txt-copy'>Copié !</span>";

    // Réinitialise le bouton après 2 secondes
    setTimeout(() => {
        btn.innerHTML = isMobile ? "<i class='fa-regular fa-copy'></i>" : "<i class='fa-regular fa-copy'></i> <span class='txt-copy'>Copier</span>";
    }, 2000);
}


// ════════════════════════════════════════════════════════════════
// 3. CARROUSEL GALERIE (Photos projet parking)
// ════════════════════════════════════════════════════════════════

// ── Sélection des éléments DOM du carrousel ──
const track = document.querySelector('.carousel-track');
const trackContainer = document.querySelector('.carousel-track-wrapper');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
let currentSlideIndex = 0;
let carouselInterval;

// ── Sélection des éléments DOM de la modale ──
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalDesc = document.getElementById('modalDesc');
const closeBtn = document.getElementById('closeModal');
const modalPrevBtn = document.getElementById('modalPrevBtn');
const modalNextBtn = document.getElementById('modalNextBtn');

/**
 * Déplace le carrousel vers une slide spécifique
 * @param {number} index - Index de la slide à afficher (boucle infinie)
 */
function moveSlider(index) {
    // Gestion de la boucle infinie (avant → fin / fin → début)
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlideIndex = index;

    // Mise à jour de la classe active
    slides.forEach(s => s.classList.remove('active'));
    slides[currentSlideIndex].classList.add('active');

    // Calcul du défilement pour centrer la slide active
    const slide = slides[currentSlideIndex];
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const containerCenter = trackContainer.offsetWidth / 2;
    let scrollPosition = slideCenter - containerCenter;

    // Limitation du scroll aux bornes du track
    const maxScroll = track.scrollWidth - trackContainer.offsetWidth;
    if (scrollPosition < 0) scrollPosition = 0;
    if (scrollPosition > maxScroll) scrollPosition = maxScroll;

    track.style.transform = `translateX(-${scrollPosition}px)`;
    resetCarouselInterval();
}

// ── Navigation carrousel (boutons précédent / suivant) ──
nextBtn.addEventListener('click', () => moveSlider(currentSlideIndex + 1));
prevBtn.addEventListener('click', () => moveSlider(currentSlideIndex - 1));

/**
 * Démarre le défilement automatique du carrousel (3.5s par slide)
 */
function startCarousel() {
    carouselInterval = setInterval(() => moveSlider(currentSlideIndex + 1), 3500);
}

/**
 * Redémarre l'intervalle du carrousel (après interaction manuelle)
 */
function resetCarouselInterval() {
    clearInterval(carouselInterval);
    startCarousel();
}

// ── Réajustement du carrousel lors du redimensionnement de la fenêtre ──
window.addEventListener('resize', () => moveSlider(currentSlideIndex));

// ── Initialisation : affiche la première slide et lance l'auto-scroll ──
moveSlider(0);
startCarousel();


// ════════════════════════════════════════════════════════════════
// 4. MODAL LIGHTBOX (Affichage plein écran des images)
// ════════════════════════════════════════════════════════════════

/**
 * Ouvre la modale avec l'image et la description de la slide cliquée
 * @param {number} index - Index de la slide à afficher en plein écran
 */
function openModal(index) {
    currentSlideIndex = index;
    updateModalContent();
    modal.classList.add('show');
    clearInterval(carouselInterval); // Pause le carrousel pendant la modale
}

/**
 * Met à jour le contenu de la modale (image + description)
 */
function updateModalContent() {
    const slide = slides[currentSlideIndex];
    const img = slide.querySelector('img');
    const desc = slide.querySelector('.slide-desc').innerText;
    modalImg.src = img.src;
    modalDesc.innerText = desc;
}

/**
 * Ferme la modale et relance le carrousel
 */
function closeModal() {
    modal.classList.remove('show');
    startCarousel();
}

// ── Clic sur une slide pour ouvrir la modale ──
slides.forEach((slide, index) => {
    slide.addEventListener('click', () => openModal(index));
});

// ── Fermeture de la modale : bouton × ──
closeBtn.addEventListener('click', closeModal);

// ── Navigation modale : boutons précédent / suivant ──
modalPrevBtn.addEventListener('click', () => {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    updateModalContent();
    moveSlider(currentSlideIndex);
});
modalNextBtn.addEventListener('click', () => {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateModalContent();
    moveSlider(currentSlideIndex);
});

// ── Fermeture de la modale : clic en dehors de l'image ──
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
// ════════════════════════════════════════════════════════════════
// 6. GALERIE FIXE (Section Notre Mosquée)
// ════════════════════════════════════════════════════════════════

// On récupère toutes les cartes de la section mosquée
const galerieItems = document.querySelectorAll('.mosquee-galerie-item');

galerieItems.forEach(item => {
    item.addEventListener('click', () => {
        // On récupère la source et le texte depuis ton HTML
        const src = item.getAttribute('data-modal-src');
        const desc = item.getAttribute('data-modal-desc');

        // On met à jour la modale
        modalImg.src = src;
        modalDesc.innerText = desc;

        // NOUVEAU : On CACHE les flèches pour ne pas mélanger avec le parking !
        modalPrevBtn.style.display = 'none';
        modalNextBtn.style.display = 'none';

        // On affiche la modale
        modal.classList.add('show');

        // On met en pause le carrousel du parking s'il tourne
        if (typeof carouselInterval !== 'undefined') {
            clearInterval(carouselInterval);
        }
    });
});
// ════════════════════════════════════════════════════════════════
// 5. API DONS (Récupération montants + Jauge de progression)
// ════════════════════════════════════════════════════════════════

/**
 * Récupère les montants de dons depuis l'API (ou données de fallback)
 * Met à jour l'affichage : montant total, pourcentage, jauge, sources
 */
async function updateData() {
    // Objectif de collecte (à modifier selon le projet)
    const GOAL = 150000;

    try {
        // Appel API pour récupérer les montants réels
        const res = await fetch('http://mosquee-zn-api.ib-app.fr/amount');
        
        // Données de fallback (test) si l'API est indisponible
        const data = res.ok ? await res.json() : { 
            cotizup: { amount: 3427 }, 
            banque: { amount: 15000.52 } 
        };

        // Calcul du total et du pourcentage
        const total = data.cotizup.amount + data.banque.amount;
        const perc = (total / GOAL) * 100;
        
        // Formatage en euros français (ex: 18 427 €)
        const format = n => new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR', 
            maximumFractionDigits: 0 
        }).format(n);

        // Mise à jour de l'affichage dans le DOM
        document.getElementById('ui-total').innerText = format(total);
        document.getElementById('ui-banque').innerHTML = `<i class="fa-solid fa-building-columns text-peps"></i> ` + format(data.banque.amount);
        document.getElementById('ui-cotizup').innerHTML = `<i class="fa-solid fa-wallet text-peps"></i> ` + format(data.cotizup.amount);
        document.getElementById('ui-pourcentage').innerText = perc.toFixed(1) + '%';

        // Animation de la jauge de progression (délai de 500ms pour effet visuel)
        setTimeout(() => {
            document.getElementById('ui-gauge').style.width = Math.min(perc, 100) + '%';
        }, 500);
        
    } catch (e) { 
        console.error("Erreur lors de la récupération des données de l'API"); 
    }
}

// ── Lancement de la mise à jour des données au chargement de la page ──
updateData();

// ════════════════════════════════════════════════════════════════
// 7. UTILITIES (Extracted from index.html)
// ════════════════════════════════════════════════════════════════

// ── Dynamisation de l'année du pied de page ──
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

/**
 * Gestion des événements pour les boutons de copie bancaire
 */
document.querySelectorAll('.btn-copy').forEach(button => {
    button.addEventListener('click', function() {
        const inputId = this.getAttribute('data-copy-id');
        if (inputId) {
            copy(inputId, this);
        }
    });
});

/**
 * Gestion des images de la section "Notre Mosquée"
 */
document.querySelectorAll('.mosquee-galerie-item').forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.getAttribute('data-modal-src');
        const imgDesc = this.getAttribute('data-modal-desc');
        if (imgSrc && imgDesc) {
            openModalFromSrc(imgSrc, imgDesc);
        }
    });
});
