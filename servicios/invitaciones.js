/* invitaciones.js */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const showcaseSection = document.getElementById('showcase-section');
    const categoriesView = document.getElementById('categories-view');
    const galleryView = document.getElementById('gallery-view');
    const backBtn = document.getElementById('back-btn');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryContainer = document.getElementById('gallery-container');
    const cards = document.querySelectorAll('.cat-card');

    // Referencias del Modal
    const modalOverlay = document.getElementById('preview-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');

    // Base de datos de ejemplos con tus links reales
    const examples = {
        digitales: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1612450892040-39965a39626e?ixlib=rb-4.0.3', thumb: 'https://images.unsplash.com/photo-1612450892040-39965a39626e?ixlib=rb-4.0.3&w=400', title: 'Invitación Boda Digital' }
        ],
        impresas: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3', thumb: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&w=400', title: 'Impresión Clásica' }
        ],
        especiales: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1527502758117-742bc5da8eb5?ixlib=rb-4.0.3', thumb: 'https://images.unsplash.com/photo-1527502758117-742bc5da8eb5?ixlib=rb-4.0.3&w=400', title: 'Tarjetería Especial' }
        ],
        laser: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3', thumb: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&w=400', title: 'Corte Láser MDF' }
        ],
        web: [
            { type: 'web', url: 'https://invitacion-av54.onrender.com/', thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=400', title: 'Invitación AV54' },
            { type: 'web', url: 'https://zero565-inv.onrender.com/', thumb: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&w=400', title: 'Invitación Zero565' }
        ],
        video: [
            { type: 'video', url: 'https://res.cloudinary.com/zgnbt2uz/video/upload/f_auto:video/IMG_3441_wkslsi?_s=vp', thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&w=400', title: 'Save the Date Animado' }
        ]
    };

    const categoryNames = {
        digitales: "Invitaciones Digitales",
        impresas: "Invitaciones Impresas",
        especiales: "Invitaciones Especiales",
        laser: "Invitaciones en Corte Láser",
        web: "Páginas Web Interactivas",
        video: "Video Invitaciones Animadas"
    };

    // Ajusta el scroll solo hasta el inicio de la sección
    function scrollToSection() {
        const headerHeight = document.getElementById('main-header').offsetHeight;
        const targetPosition = showcaseSection.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }

    // Al hacer clic en una tarjeta de categoría
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-category');
            showGallery(cat);
            scrollToSection();
        });
    });

    // Al hacer clic en el botón de regresar
    backBtn.addEventListener('click', () => {
        galleryView.classList.add('hidden');
        categoriesView.classList.remove('hidden');

        categoriesView.classList.remove('fade-in-gallery');
        void categoriesView.offsetWidth;
        categoriesView.classList.add('fade-in-gallery');

        scrollToSection();
    });

    function showGallery(category) {
        galleryTitle.textContent = categoryNames[category];
        galleryContainer.innerHTML = '';

        const items = examples[category];

        if (items && items.length > 0) {
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'showcase-item fade-in-gallery';

                let iconClass = 'fa-solid fa-magnifying-glass';
                if (item.type === 'web') iconClass = 'fa-solid fa-link';
                if (item.type === 'video') iconClass = 'fa-solid fa-play';

                div.innerHTML = `
                    <img src="${item.thumb}" alt="${item.title}" loading="lazy">
                    <div class="showcase-overlay">
                        <i class="${iconClass}"></i>
                        <span>Ver Ejemplo</span>
                    </div>
                `;

                div.addEventListener('click', () => openModal(item));
                galleryContainer.appendChild(div);
            });
        } else {
            galleryContainer.innerHTML = '<p style="color: var(--gray-mid); font-size: 1.1rem; grid-column: 1 / -1; text-align: center;">Próximamente agregaremos ejemplos para esta categoría.</p>';
        }

        categoriesView.classList.add('hidden');
        galleryView.classList.remove('hidden');

        galleryView.classList.remove('fade-in-gallery');
        void galleryView.offsetWidth;
        galleryView.classList.add('fade-in-gallery');
    }

    // --- FUNCIONES DEL MODAL --- //
    function openModal(item) {
        modalBody.innerHTML = '';

        if (item.type === 'image') {
            modalBody.innerHTML = `<img src="${item.url}" alt="${item.title}">`;
        }
        else if (item.type === 'web') {
            // Controles dinámicos para vistas Web
            modalBody.innerHTML = `
                <div class="device-toggles">
                    <button class="device-btn active" data-view="desktop"><i class="fa-solid fa-desktop"></i> Escritorio</button>
                    <button class="device-btn" data-view="mobile"><i class="fa-solid fa-mobile-screen"></i> Teléfono</button>
                </div>
                <div class="iframe-wrapper">
                    <iframe id="web-preview-iframe" src="${item.url}" class="iframe-desktop" title="Previsualización Web"></iframe>
                </div>
            `;

            // Lógica de los botones Desktop/Mobile
            const viewBtns = modalBody.querySelectorAll('.device-btn');
            const iframe = document.getElementById('web-preview-iframe');

            viewBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    viewBtns.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');

                    const view = e.currentTarget.getAttribute('data-view');
                    if (view === 'mobile') {
                        iframe.className = 'iframe-mobile';
                    } else {
                        iframe.className = 'iframe-desktop';
                    }
                });
            });

        }
        else if (item.type === 'video') {
            // Video con auto-ajuste y auto-reproducción
            modalBody.innerHTML = `
                <video controls autoplay playsinline>
                    <source src="${item.url}" type="video/mp4">
                    Tu navegador no soporta reproducción de video.
                </video>
            `;
        }

        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Bloquear scroll del fondo
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = ''; // Restaurar scroll
        modalBody.innerHTML = ''; // Limpiar contenido detiene videos/iframes
    }

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
});