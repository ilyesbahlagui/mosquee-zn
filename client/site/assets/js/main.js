const API_URL = "http://localhost:3000/public/annonces?nom=lumiere-et-piete";

function $(selector, root = document) {
	return root.querySelector(selector);
}

function $$(selector, root = document) {
	return Array.from(root.querySelectorAll(selector));
}

function escapeHtml(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function formatDateFr(raw) {
	if (!raw) return "";
	const date = new Date(raw);
	if (Number.isNaN(date.getTime())) return raw;
	return date.toLocaleDateString("fr-FR");
}

function setCurrentYear() {
	const currentYearEl = $("#currentYear");
	if (currentYearEl) currentYearEl.textContent = String(new Date().getFullYear());
}

function initNavbar() {
	const nav = $("#main-nav");
	const hamburger = $("#hamburger-btn");
	const menu = $("#nav-menu");
	const scrollTopBtn = $("#scrollTopBtn");

	window.addEventListener("scroll", () => {
		if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);
		if (scrollTopBtn) scrollTopBtn.classList.toggle("show", window.scrollY > 300);
	});

	if (!hamburger || !menu) return;

	const toggleMenu = () => {
		hamburger.classList.toggle("open");
		menu.classList.toggle("open");
	};

	hamburger.addEventListener("click", toggleMenu);
	$$(".fixed-mosquee-menu-link").forEach((link) => {
		link.addEventListener("click", () => {
			if (menu.classList.contains("open")) toggleMenu();
		});
	});
}

function initCopyButtons() {
	$$(".btn-copy").forEach((btn) => {
		btn.addEventListener("click", async (e) => {
			e.preventDefault();
			const id = btn.getAttribute("data-copy-id");
			const input = id ? document.getElementById(id) : null;
			if (!input) return;

			try {
				await navigator.clipboard.writeText(input.value);
				const original = btn.innerHTML;
				btn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="txt-copy">Copié !</span>';
				btn.classList.add("copied");
				window.setTimeout(() => {
					btn.innerHTML = original;
					btn.classList.remove("copied");
				}, 1500);
			} catch (error) {
				console.warn("Copie impossible:", error);
			}
		});
	});
}

function initSpiritualSlider() {
	const slides = $$(".spiritual-slide");
	const dots = $$(".spiritual-dot");
	const prev = $(".spiritual-prev");
	const next = $(".spiritual-next");
	if (!slides.length) return;

	let index = 0;
	let timer = null;

	const render = (newIndex) => {
		index = (newIndex + slides.length) % slides.length;
		slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
		dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
	};

	const restartTimer = () => {
		if (timer) clearInterval(timer);
		timer = setInterval(() => render(index + 1), 8000);
	};

	if (prev) prev.addEventListener("click", () => {
		render(index - 1);
		restartTimer();
	});

	if (next) next.addEventListener("click", () => {
		render(index + 1);
		restartTimer();
	});

	dots.forEach((dot, i) => {
		dot.addEventListener("click", () => {
			render(i);
			restartTimer();
		});
	});

	restartTimer();
}

const catImages = {
	"Ramadan": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80",
	"Aïd": "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=600&q=80",
	"Conférence": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
	"Cours": "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=600&q=80",
	"Janaza": "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?auto=format&fit=crop&w=600&q=80",
	"Événement": "https://images.unsplash.com/photo-1511795409476-692200373d15?auto=format&fit=crop&w=600&q=80",
	"Divers": "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=600&q=80"
};

let annoncesStore = [];

function getAnnoncesContainers() {
	const list = document.getElementById("annonces-list") || document.getElementById("annoncesGrid");
	const filters = document.getElementById("filter-container") || document.getElementById("annoncesFilters");
	const modal = document.getElementById("modal-annonce");
	return { list, filters, modal };
}

function updateMenuBadge(total) {
	const link = document.querySelector("a[href='#actualites']");
	if (!link) return;
	const existing = link.querySelector(".badge-count");
	if (existing) existing.remove();
	if (total > 0) {
		link.insertAdjacentHTML("beforeend", `<span class="badge-count"><span>${total}</span></span>`);
	}
}

function setNoAnnoncesMessage(message = "Pas d'actualités pour le moment.") {
	const { list, filters } = getAnnoncesContainers();
	if (filters) {
		filters.innerHTML = '<span class="event-tag active" data-cat="all">Tout voir</span>';
	}
	if (list) {
		list.innerHTML = `<p style="grid-column:1/-1; text-align:center;">${escapeHtml(message)}</p>`;
	}
}

function buildDateBadges(ann) {
	if (!ann.date_evenement && !ann.date_expiration) return "";

	let dateBloc = '<div class="annonce-dates-badges">';
	if (ann.date_evenement) {
		dateBloc += `<span class="date-badge start-date"><i class="fa-regular fa-calendar-check"></i> Début : ${escapeHtml(new Date(ann.date_evenement).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }))}</span>`;
	}
	if (ann.date_expiration) {
		dateBloc += `<span class="date-badge end-date"><i class="fa-regular fa-calendar-xmark"></i> Fin : ${escapeHtml(new Date(ann.date_expiration).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }))}</span>`;
	}
	dateBloc += "</div>";
	return dateBloc;
}

function showModal(ann, img, dateBloc) {
	const { modal } = getAnnoncesContainers();
	const mImg = document.getElementById("m-img");
	const mTitre = document.getElementById("m-titre");
	const mContent = document.getElementById("m-content");
	const mDate = document.getElementById("m-date");
	const mTags = document.getElementById("m-tags");
	if (!modal || !mImg || !mTitre || !mContent || !mDate || !mTags) return;

	mImg.src = img;
	mTitre.textContent = ann.titre || "";
	mContent.innerHTML = ann.contenu || "";
	mDate.innerHTML = dateBloc;

	let tagsHtml = `<span class="tag-orange">${escapeHtml(ann.categorie_nom || "Divers")}</span>`;
	if (Number(ann.est_urgent) === 1) {
		tagsHtml = `<span class="badge-urgent">Urgent</span> ${tagsHtml}`;
	}
	mTags.innerHTML = tagsHtml;

	modal.classList.add("show");
	document.body.style.overflow = "hidden";
}

function displayAnnonces(items) {
	const { list } = getAnnoncesContainers();
	if (!list) return;

	list.innerHTML = items.length
		? ""
		: "<p style=\"grid-column:1/-1; text-align:center;\">Pas d'actualités pour le moment.</p>";

	items.forEach((ann) => {
		const photo = catImages[ann.categorie_nom] || catImages["Divers"];
		const dateBloc = buildDateBadges(ann);
		const previewText = String(ann.contenu || "").replace(/<[^>]*>/g, "");

		const card = document.createElement("div");
		card.className = "annonce-card";
		card.innerHTML = `
			<img src="${escapeHtml(photo)}" class="annonce-img" alt="Illustration">
			<div class="annonce-body">
				<div class="annonce-meta">
					${Number(ann.est_urgent) === 1 ? '<span class="badge-urgent">Urgent</span>' : ""}
					<span class="tag-orange">${escapeHtml(ann.categorie_nom || "Divers")}</span>
				</div>
				<h4 class="annonce-titre">${escapeHtml(ann.titre || "Sans titre")}</h4>
				${dateBloc}
				<div class="annonce-txt">${escapeHtml(previewText)}</div>
			</div>
		`;
		card.addEventListener("click", () => showModal(ann, photo, dateBloc));
		list.appendChild(card);
	});
}

function buildAnnoncesFilters(categories) {
	const { filters } = getAnnoncesContainers();
	if (!filters) return;

	filters.innerHTML = '<span class="event-tag active" data-cat="all">Tout voir</span>';
	categories.forEach((c) => {
		const btn = document.createElement("span");
		btn.className = "event-tag";
		btn.textContent = c;
		btn.addEventListener("click", () => {
			$$(".event-tag", filters).forEach((t) => t.classList.remove("active"));
			btn.classList.add("active");
			displayAnnonces(c === "all" ? annoncesStore : annoncesStore.filter((a) => a.categorie_nom === c));
		});
		filters.appendChild(btn);
	});
}

function initAnnonceModalClose() {
	const modal = document.getElementById("modal-annonce");
	const closeBtn = document.getElementById("close-modal-ann");
	if (!modal || !closeBtn) return;

	const close = () => {
		modal.classList.remove("show");
		document.body.style.overflow = "";
	};

	closeBtn.addEventListener("click", close);
	modal.addEventListener("click", (e) => {
		if (e.target === modal) close();
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && modal.classList.contains("show")) close();
	});
}

async function fetchAnnonces() {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 7000);
		const response = await fetch(API_URL, { signal: controller.signal });
		clearTimeout(timeout);

		if (!response.ok) return { annonces: [], categories: [] };
		const json = await response.json();
		if (json?.success && json?.data?.annonces) {
			return {
				annonces: json.data.annonces,
				categories: json.data.categories || []
			};
		}
	} catch (error) {
		console.warn("API annonces indisponible:", error?.message || error);
	}
	return { annonces: [], categories: [] };
}

async function initAnnonces() {
	const { annonces, categories } = await fetchAnnonces();

	if (!annonces.length) {
		updateMenuBadge(0);
		setNoAnnoncesMessage("Aucune annonce disponible.");
		return;
	}

	annoncesStore = annonces;
	updateMenuBadge(annoncesStore.length);
	buildAnnoncesFilters(categories || []);
	displayAnnonces(annoncesStore);
}

document.addEventListener("DOMContentLoaded", () => {
	initNavbar();
	setCurrentYear();
	initCopyButtons();
	initSpiritualSlider();
	initAnnonceModalClose();

	// Appel API au demarrage, sans faire planter l'interface si l'API est indisponible.
	initAnnonces();
});
