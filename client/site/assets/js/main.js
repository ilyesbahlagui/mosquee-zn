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
// 3. SIMPLE CAROUSEL COMPONENT
// ════════════════════════════════════════════════════════════════

// Fonction utilitaire qui initialise chaque carrousel présent sur la page.
(function initSimpleCarousels() {
    const carousels = document.querySelectorAll('.simple-carousel');
    if (carousels.length === 0) return;

    // modal global réutilisable
    const modal = document.getElementById('scModal');
    const modalImg = modal.querySelector('.sc-modal-img');
    const modalDesc = modal.querySelector('.sc-modal-desc');
    const modalClose = modal.querySelector('.sc-modal-close');
    const modalPrev = modal.querySelector('.sc-modal-prev');
    const modalNext = modal.querySelector('.sc-modal-next');

    let currentCarousel = null;
    let currentIndex = 0;

    function updateModal() {
        const slides = Array.from(currentCarousel.querySelectorAll('.sc-slide'));
        const slide = slides[currentIndex];
        const imgEl = slide.querySelector('img');
        const descEl = slide.querySelector('.sc-desc');
        // possibilité de contenu additionnel : soit via élément .sc-extra,
        // soit via attribut data-extra.
        const extraEl = slide.querySelector('.sc-extra');
        const extraData = slide.dataset.extra;
        modalImg.src = imgEl.src;
        modalImg.alt = imgEl.alt;
        modalDesc.innerHTML = descEl ? descEl.innerHTML : '';
        if (extraEl) {
            modalDesc.innerHTML += '<div class="sc-extra-content">' + extraEl.innerHTML + '</div>';
        } else if (extraData) {
            modalDesc.innerHTML += '<div class="sc-extra-content">' + extraData + '</div>';
        }
    }
    function openModal(carousel, idx) {
        currentCarousel = carousel;
        currentIndex = idx;
        updateModal();
        modal.classList.add('show');
    }
    function navigate(delta) {
        const slides = Array.from(currentCarousel.querySelectorAll('.sc-slide'));
        currentIndex = (currentIndex + delta + slides.length) % slides.length;
        updateModal();
    }

    modalClose.addEventListener('click', () => modal.classList.remove('show')); 
    modalPrev.addEventListener('click', () => navigate(-1));
    modalNext.addEventListener('click', () => navigate(1));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.sc-track');
        const slides = Array.from(carousel.querySelectorAll('.sc-slide'));
        const prev = carousel.querySelector('.sc-prev');
        const next = carousel.querySelector('.sc-next');
        let index = 0;
        let timer;

        // pagination dots setup
        const dotsWrapper = document.createElement('div');
        dotsWrapper.className = 'sc-dots';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'sc-dot';
            dot.addEventListener('click', () => {
                index = i;
                updateView();
                resetTimer();
            });
            dotsWrapper.appendChild(dot);
        });
        carousel.appendChild(dotsWrapper);

        function updateView() {
            slides.forEach(s => s.classList.remove('active'));
            slides[index].classList.add('active');
            track.style.transform = `translateX(-${index*100}%)`;
            const dots = dotsWrapper.querySelectorAll('.sc-dot');
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }
        function go(delta) {
            index = (index + delta + slides.length) % slides.length;
            updateView();
        }
        prev.addEventListener('click', () => { go(-1); resetTimer(); });
        next.addEventListener('click', () => { go(1); resetTimer(); });
        slides.forEach((s,i)=> s.addEventListener('click', () => openModal(carousel,i)));
        const autoplayInterval = parseInt(carousel.dataset.autoplay) || 0;
        function resetTimer() {
            if (autoplayInterval > 0) {
                clearInterval(timer);
                timer = setInterval(() => go(1), autoplayInterval);
            }
        }
        if (autoplayInterval > 0) {
            timer = setInterval(() => go(1), autoplayInterval);
            carousel.addEventListener('mouseenter', () => clearInterval(timer));
            carousel.addEventListener('mouseleave', resetTimer);
        }
        updateView();
    });
})();
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
        const res = await fetch('https://mosquee-zn-api.ib-app.fr/amount');
        
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
 * Gestion des images de la section "Notre Mosquée" (Ancienne galerie supprimée)
 */

// ════════════════════════════════════════════════════════════════
// SPIRITUAL SLIDER - Carrousel de rappels spirituels
// ════════════════════════════════════════════════════════════════

/**
 * Gère le slider de citations spirituelles dans la section bancaire
 * Défilement automatique toutes les 5 secondes avec navigation manuelle par points
 */
(function initSpiritualSlider() {
    const slides = document.querySelectorAll('.spiritual-slide');
    const prevBtn = document.querySelector('.spiritual-prev');
    const nextBtn = document.querySelector('.spiritual-next');
    const dots = document.querySelectorAll('.spiritual-dot');

    if (slides.length === 0 || !prevBtn || !nextBtn) return;

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
        // Mise à jour des dots
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    // Clic sur les flèches
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Clic sur les dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
    });

    // Initialisation
    showSlide(0);
})();