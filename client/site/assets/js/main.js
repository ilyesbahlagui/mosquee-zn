const nav = document.getElementById("main-nav");
const hamburger = document.getElementById("hamburger-btn");
const menu = document.getElementById("nav-menu");
const menuLinks = document.querySelectorAll(".fixed-mosquee-menu-link");
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (nav && hamburger && menu) {
    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 50);
        if (scrollTopBtn) scrollTopBtn.classList.toggle("show", window.scrollY > 300);
    });
    const toggleMenu = () => {
        hamburger.classList.toggle("open");
        menu.classList.toggle("open");
    };
    hamburger.addEventListener("click", toggleMenu);
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => { if (menu.classList.contains("open")) toggleMenu(); });
    });
}

function initCopyButtons() {
    const copyBtns = document.querySelectorAll(".btn-copy");
    copyBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const id = btn.getAttribute("data-copy-id");
            const input = id ? document.getElementById(id) : null;
            if (!input) return;
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value).then(() => {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = "<i class=\"fa-solid fa-check\"></i> <span class=\"txt-copy\">Copie !</span>";
                btn.classList.add("copied");
                setTimeout(() => { btn.innerHTML = originalHTML; btn.classList.remove("copied"); }, 2000);
            });
        });
    });
}

function initSpiritualSlider() {
    const slides = document.querySelectorAll(".spiritual-slide");
    const dots = document.querySelectorAll(".spiritual-dot");
    const prev = document.querySelector(".spiritual-prev");
    const next = document.querySelector(".spiritual-next");
    if (!slides.length) return;
    let index = 0;
    let timer;
    const render = (newIndex) => {
        if (newIndex >= slides.length) index = 0;
        else if (newIndex < 0) index = slides.length - 1;
        else index = newIndex;
        slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    };
    const restartTimer = () => { clearInterval(timer); timer = setInterval(() => render(index + 1), 8000); };
    if (next) next.addEventListener("click", () => { render(index + 1); restartTimer(); });
    if (prev) prev.addEventListener("click", () => { render(index - 1); restartTimer(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { render(i); restartTimer(); }));
    restartTimer();
}

function initMosqueeCarouselModal() {
    const track = document.querySelector(".sc-track");
    const slides = Array.from(document.querySelectorAll(".sc-slide"));
    if (!track || !slides.length) return;
    const modal = document.getElementById("scModal");
    const modalImg = document.querySelector(".sc-modal-img");
    const modalDesc = document.querySelector(".sc-modal-desc");
    const modalClose = document.querySelector(".sc-modal-close");
    let index = 0;
    const render = (i) => { index = (i + slides.length) % slides.length; track.style.transform = `translateX(-${index * 100}%)`; };
    document.querySelector(".sc-next")?.addEventListener("click", () => render(index + 1));
    document.querySelector(".sc-prev")?.addEventListener("click", () => render(index - 1));
    slides.forEach((sl, i) => sl.querySelector("img")?.addEventListener("click", () => {
        modalImg.src = sl.querySelector("img").src;
        modalDesc.textContent = sl.querySelector(".sc-desc")?.textContent || "";
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    }));
    modalClose?.addEventListener("click", () => { modal.classList.remove("show"); document.body.style.overflow = ""; });
}

function initAnnonces() {
    console.log("Démarrage initAnnonces...");
    const API_URL = "http://127.0.0.1:3000/public/annonces?nom=lumiere-et-piete";
    const loader = document.getElementById("annonces-loader");
    const contentArea = document.getElementById("annonces-content-area");
    const emptyState = document.getElementById("annonces-empty-state");
    const tabsList = document.getElementById("annonces-tabs-list");
    const gridContainer = document.getElementById("annonces-grid-container");
    const modal = document.getElementById("annonce-modal");
    const modalCloseBtn = document.getElementById("amodal-close-btn");
    const modalTitle = document.getElementById("amodal-title");
    const modalDates = document.getElementById("amodal-dates");
    const modalBody = document.getElementById("amodal-body-html");
    const modalTagsContainer = document.getElementById("amodal-tags-container");
    const scrollLeftBtn = document.getElementById("tabs-scroll-left");
    const scrollRightBtn = document.getElementById("tabs-scroll-right");

    if (!loader) return;
    let allAnnonces = [];

    const updateNavBadge = (count) => {
        const badge = document.getElementById("nav-badge-count");
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? "inline-flex" : "none";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const fetchAnnonces = async () => {
        
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            if (loader) loader.style.display = "none";
            if (result.success && result.data && result.data.annonces.length > 0) {
                console.log("Annonces reçues :", result.data.annonces.length);
                allAnnonces = result.data.annonces;
                updateNavBadge(allAnnonces.length);
                renderTabs(result.data.categories || [], allAnnonces);
                renderCards(allAnnonces);
                if (contentArea) { contentArea.style.display = "block"; contentArea.classList.remove("hidden"); }
            } else if (emptyState) emptyState.style.display = "block";
        } catch (e) {
            console.error("Erreur Fetch Annonces:", e);
            if (loader) loader.style.display = "none";
            if (emptyState) emptyState.style.display = "block";
        }
    };

    const renderTabs = (categories, annonces) => {
        if (!tabsList) return;
        tabsList.innerHTML = `<button class="tab-btn active" data-filter="all">Général <span class="tab-badge">${annonces.length}</span></button>`;
        categories.forEach(cat => {
            const count = annonces.filter(a => a.categorie_nom === cat).length;
            tabsList.innerHTML += `<button class="tab-btn" data-filter="${cat}">${cat} ${count > 0 ? `<span class="tab-badge">${count}</span>` : ''}</button>`;
        });
        tabsList.querySelectorAll(".tab-btn").forEach(btn => btn.addEventListener("click", (e) => {
            tabsList.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            const filter = e.currentTarget.getAttribute("data-filter");
            renderCards(filter === "all" ? annonces : annonces.filter(a => a.categorie_nom === filter));
        }));
    };

    const renderCards = (list) => {
        if (!gridContainer) return;
        gridContainer.innerHTML = list.length ? "" : "<p style='grid-column:1/-1;text-align:center;'>Aucune annonce.</p>";
        list.forEach(a => {
            const dEvt = formatDate(a.date_evenement);
            const dExp = formatDate(a.date_expiration);
            let datesHTML = dEvt ? `<div><i class="fa-regular fa-calendar-check"></i> ${dEvt}</div>` : "";
            if (dExp) datesHTML += `<div><i class="fa-regular fa-clock"></i> Expire le ${dExp}</div>`;
            const card = document.createElement("div");
            card.className = "annonce-card";
            card.innerHTML = `${a.est_urgent ? '<div class="urgent-tag">Urgent</div>' : ''}<div class="card-cat">${a.categorie_nom}</div><h3 class="card-title">${a.titre}</h3><div class="card-dates">${datesHTML}</div>`;
            card.addEventListener("click", () => {
                modalTagsContainer.innerHTML = `<div class="card-cat">${a.categorie_nom}</div>${a.est_urgent ? '<div class="urgent-tag">Urgent</div>' : ''}`;
                modalTitle.textContent = a.titre;
                modalDates.innerHTML = datesHTML;
                modalBody.innerHTML = (a.contenu || "").replace(/&nbsp;/g, ' ');
                modal.classList.add("show");
                document.body.style.overflow = "hidden";
            });
            gridContainer.appendChild(card);
        });
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", () => { modal.classList.remove("show"); document.body.style.overflow = ""; });
    if (scrollLeftBtn) scrollLeftBtn.addEventListener("click", () => tabsList.scrollBy({left:-200, behavior:'smooth'}));
    if (scrollRightBtn) scrollRightBtn.addEventListener("click", () => tabsList.scrollBy({left:200, behavior:'smooth'}));

    fetchAnnonces();
}

document.addEventListener("DOMContentLoaded", () => {
    initCopyButtons();
    initSpiritualSlider();
    initMosqueeCarouselModal();
    initAnnonces();
});
