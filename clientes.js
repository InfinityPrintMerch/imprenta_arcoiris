// ==========================================================================
// FUNCIONAMIENTO DEL SLIDER MANUAL DE TESTIMONIOS (clientes.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const container = document.querySelector('.testimonials-slider-container');

    if (!track || !cards.length) return;

    let currentIndex = 0;

    // Lógica para mover las flechas al contenedor inferior en móviles
    const setupMobileArrows = () => {
        const mobileContainer = document.querySelector('.mobile-slider-controls');
        const prevArrow = document.querySelector('.testimonials-slider-container > .prev-arrow');
        const nextArrow = document.querySelector('.testimonials-slider-container > .next-arrow');

        if (window.innerWidth <= 768 && mobileContainer.children.length === 0) {
            // Clonamos los botones para el layout móvil
            const prevClone = prevArrow.cloneNode(true);
            const nextClone = nextArrow.cloneNode(true);

            mobileContainer.appendChild(prevClone);
            mobileContainer.appendChild(nextClone);

            // Asignamos los eventos a los clones
            prevClone.addEventListener('click', slidePrev);
            nextClone.addEventListener('click', slideNext);
        }
    };

    // Actualiza la posición de la pista
    const updateSlider = () => {
        // Obtenemos el ancho exacto de una tarjeta + el gap (espacio entre ellas)
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;
        const moveAmount = cardWidth + gap;

        // Movemos el track usando transform
        track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
    };

    // Función para avanzar
    const slideNext = () => {
        const trackWrapperWidth = track.parentElement.offsetWidth;
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 0;

        // Cuántas tarjetas se ven completas en la pantalla actual
        const visibleCards = Math.floor((trackWrapperWidth + gap) / (cardWidth + gap)) || 1;

        // Límite máximo de índice
        const maxIndex = cards.length - visibleCards;

        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Si llega al final, regresa al inicio suavemente
        }
        updateSlider();
    };

    // Función para retroceder
    const slidePrev = () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            // Si está en el primero y da atrás, va al último disponible
            const trackWrapperWidth = track.parentElement.offsetWidth;
            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(track).gap) || 0;
            const visibleCards = Math.floor((trackWrapperWidth + gap) / (cardWidth + gap)) || 1;

            currentIndex = Math.max(0, cards.length - visibleCards);
        }
        updateSlider();
    };

    // Eventos para flechas Desktop
    const btnNext = document.querySelector('.testimonials-slider-container > .next-arrow');
    const btnPrev = document.querySelector('.testimonials-slider-container > .prev-arrow');

    if (btnNext) btnNext.addEventListener('click', slideNext);
    if (btnPrev) btnPrev.addEventListener('click', slidePrev);

    // Reposicionar el slider si cambia el tamaño de la ventana (para no quedar en espacios vacíos)
    window.addEventListener('resize', () => {
        setupMobileArrows();
        currentIndex = 0; // Reiniciar vista
        updateSlider();
    });

    // Iniciar configuración
    setupMobileArrows();
});