const nav = document.getElementById("main-nav");
const hamburger = document.getElementById("hamburger-btn");
const menu = document.getElementById("nav-menu");
const menuLinks = document.querySelectorAll(".fixed-mosquee-menu-link");
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (nav && hamburger && menu) {
    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 50);

        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle("show", window.scrollY > 300);
        }
    });

    const toggleMenu = () => {
        hamburger.classList.toggle("open");
        menu.classList.toggle("open");
    };

    hamburger.addEventListener("click", toggleMenu);
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (menu.classList.contains("open")) toggleMenu();
        });
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
                const isMobile = window.innerWidth <= 768;
                const originalHTML = btn.innerHTML;
                const icon = "<i class=\"fa-solid fa-check\"></i>";

                btn.innerHTML = isMobile ? icon : `${icon} <span class="txt-copy">Copie !</span>`;
                btn.classList.add("copied");

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.remove("copied");
                }, 2000);
            }).catch((err) => {
                console.error("Erreur de copie:", err);
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

    const restartTimer = () => {
        clearInterval(timer);
        timer = setInterval(() => render(index + 1), 8000);
    };

    if (next) next.addEventListener("click", () => { render(index + 1); restartTimer(); });
    if (prev) prev.addEventListener("click", () => { render(index - 1); restartTimer(); });
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            render(i);
            restartTimer();
        });
    });

    restartTimer();
}

function initMosqueeCarouselModal() {
    const track = document.querySelector(".sc-track");
    const slides = Array.from(document.querySelectorAll(".sc-slide"));
    const prev = document.querySelector(".sc-prev");
    const next = document.querySelector(".sc-next");
    const modal = document.getElementById("scModal");
    const modalImg = document.querySelector(".sc-modal-img");
    const modalDesc = document.querySelector(".sc-modal-desc");
    const modalClose = document.querySelector(".sc-modal-close");
    const modalPrev = document.querySelector(".sc-modal-prev");
    const modalNext = document.querySelector(".sc-modal-next");
    if (!track || !slides.length) return;

    let index = 0;

    const renderCarousel = (newIndex) => {
        if (newIndex >= slides.length) index = 0;
        else if (newIndex < 0) index = slides.length - 1;
        else index = newIndex;

        track.style.transform = `translateX(-${index * 100}%)`;
    };

    const openModal = (newIndex) => {
        if (!modal || !modalImg || !modalDesc) return;
        renderCarousel(newIndex);

        const img = slides[index].querySelector("img");
        const desc = slides[index].querySelector(".sc-desc");
        if (!img) return;

        modalImg.src = img.src;
        modalImg.alt = img.alt || "Image de la mosquée";
        modalDesc.textContent = desc ? desc.textContent : "";
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove("show");
        document.body.style.overflow = "";
    };

    if (next) next.addEventListener("click", () => renderCarousel(index + 1));
    if (prev) prev.addEventListener("click", () => renderCarousel(index - 1));
    setInterval(() => renderCarousel(index + 1), 5000);

    slides.forEach((slide, i) => {
        const img = slide.querySelector("img");
        if (img) img.addEventListener("click", () => openModal(i));
    });

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalNext) modalNext.addEventListener("click", () => openModal(index + 1));
    if (modalPrev) modalPrev.addEventListener("click", () => openModal(index - 1));

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("show")) {
            closeModal();
        }
    });
}

function initCurrentYear() {
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
    initCopyButtons();
    initSpiritualSlider();
    initMosqueeCarouselModal();
    initCurrentYear();
});
