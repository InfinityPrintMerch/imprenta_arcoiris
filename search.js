// search.js
document.addEventListener("DOMContentLoaded", () => {
    let serviciosData = [];

    // 1. Detectar ruta base dinámicamente (para subcarpetas)
    const scriptTag = document.querySelector('script[src*="search.js"]');
    let basePath = './';
    if (scriptTag) {
        basePath = scriptTag.getAttribute('src').replace('search.js', '');
    }

    // 2. Cargar JSON de servicios
    // ATENCIÓN: Esto requiere que abras el proyecto con Live Server, de lo contrario fallará por CORS.
    fetch(`${basePath}servicios.json`)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el JSON");
            return response.json();
        })
        .then(data => { serviciosData = data; })
        .catch(error => {
            console.error("Error leyendo servicios.json (¿Estás usando Live Server?):", error);
        });

    // 3. Función principal que inicia el buscador
    const iniciarBuscador = () => {
        const searchToggleBtn = document.getElementById('searchToggleBtn');
        const searchInput = document.getElementById('searchInput');
        const searchWrapper = document.getElementById('searchWrapper');
        const clearSearchBtn = document.getElementById('clearSearch');
        const mainHeader = document.getElementById('main-header');
        const searchResultsArea = document.getElementById('search-results-area');
        const resultsGrid = document.getElementById('resultsGrid');
        const searchTermDisplay = document.getElementById('searchTermDisplay');
        const resultsCount = document.getElementById('resultsCount');

        // Si por alguna razón no encuentra los elementos, detenemos el script para que no marque error
        if (!searchToggleBtn || !searchInput) return;

        // Abrir buscador al hacer clic en la lupa
        searchToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchWrapper.classList.add('active');
            mainHeader.classList.add('search-is-open');
            searchInput.focus();
        });

        // Cerrar si se da clic fuera del buscador y está vacío
        document.addEventListener('click', (e) => {
            if (searchWrapper.classList.contains('active') && !searchWrapper.contains(e.target) && searchInput.value.trim() === '') {
                cerrarBuscador(searchInput, clearSearchBtn, searchResultsArea, resultsGrid, searchWrapper, mainHeader);
            }
        });

        // Lógica al escribir
        searchInput.addEventListener('input', function (e) {
            const term = e.target.value.toLowerCase().trim();

            if (term.length > 0) {
                clearSearchBtn.style.display = 'block';
                toggleContenidoPagina(false); // Oculta el resto de la página
                searchResultsArea.style.display = 'block';
                searchTermDisplay.textContent = `"${e.target.value}"`;

                const resultados = serviciosData.filter(servicio => {
                    const enTitulo = servicio.titulo.toLowerCase().includes(term);
                    const enDesc = servicio.descripcion.toLowerCase().includes(term);
                    const enKeywords = servicio.keywords.some(kw => kw.toLowerCase().includes(term));
                    return enTitulo || enDesc || enKeywords;
                });

                renderResultados(resultados, resultsGrid, resultsCount, basePath);
            } else {
                cerrarBuscador(searchInput, clearSearchBtn, searchResultsArea, resultsGrid, searchWrapper, mainHeader);
                toggleContenidoPagina(true); // Muestra el resto de la página
            }
        });

        // Botón de la X para limpiar
        clearSearchBtn.addEventListener('click', () => {
            cerrarBuscador(searchInput, clearSearchBtn, searchResultsArea, resultsGrid, searchWrapper, mainHeader);
            toggleContenidoPagina(true);
        });
    };

    // 4. SINCRONIZACIÓN PERFECTA
    // Si el header ya existe en la página, iniciamos. Si no, esperamos a que components.js avise que ya terminó.
    if (document.getElementById('searchToggleBtn')) {
        iniciarBuscador();
    } else {
        document.addEventListener('headerCargado', iniciarBuscador);
    }

    // --- FUNCIONES SECUNDARIAS ---

    // Oculta/Muestra todas las secciones de la página excepto el header, footer y área de resultados
    function toggleContenidoPagina(mostrar) {
        const elementosOcultables = document.querySelectorAll('body > section:not(#search-results-area), body > main, body > div.page-wrapper');
        elementosOcultables.forEach(el => {
            el.style.display = mostrar ? '' : 'none';
        });
    }

    // Renderiza las tarjetas de resultados
    function renderResultados(resultados, resultsGrid, resultsCount, basePath) {
        resultsGrid.innerHTML = '';

        if (resultados.length === 0) {
            resultsCount.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> 0 encontrados`;
            resultsCount.className = "count-badge empty";

            resultsGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; animation: popIn 0.4s ease-out forwards;">
                    <div class="icon-wrapper"><i class="fa-regular fa-face-frown-open"></i></div>
                    <h3>¡Ups! No encontramos coincidencias</h3>
                    <p>No te preocupes, contáctanos por WhatsApp y revisamos cómo podemos fabricarlo para ti.</p>
                    <a href="https://wa.me/522411250287" target="_blank" class="btn" style="background: #25D366; color: white; border-radius: 50px; font-weight: 600; padding: 12px 25px; display: inline-flex; align-items: center; gap: 10px;">
                        <i class="fa-brands fa-whatsapp"></i> Preguntar por WhatsApp
                    </a>
                </div>
            `;
            return;
        }

        resultsCount.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${resultados.length} servicio(s)`;
        resultsCount.className = "count-badge success";

        resultados.forEach((servicio, index) => {
            const delay = index * 0.05;

            let tagsHtml = '';
            if (servicio.keywords && servicio.keywords.length > 0) {
                const topKeywords = servicio.keywords.slice(0, 4);
                const tagsString = topKeywords.map(kw => `<span style="background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; border: 1px solid #e2e8f0;">${kw}</span>`).join('');
                const masText = servicio.keywords.length > 4 ? `<span style="font-size: 0.75rem; color: #94a3b8; margin-left: 5px;">+ más</span>` : '';

                tagsHtml = `
                    <div style="margin-top: 15px; margin-bottom: 5px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                        <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; width: 100%;">Relacionado con:</span>
                        ${tagsString} ${masText}
                    </div>
                `;
            }

            // Normalizar la URL para que no tenga problemas al unir la ruta base
            let cleanUrl = servicio.url.startsWith('/') ? servicio.url.substring(1) : servicio.url;
            const finalUrl = `${basePath}${cleanUrl}`;

            const tarjetaHtml = `
                <div class="service-card" style="display: flex; flex-direction: column; opacity: 0; animation: popIn 0.4s ease-out ${delay}s forwards;">
                    <div class="service-icon-box ${servicio.colorClase}">
                        <i class="fa-solid ${servicio.icono}"></i>
                    </div>
                    <h3 style="margin-top:0;">${servicio.titulo}</h3>
                    <p style="margin-bottom: 5px;">${servicio.descripcion}</p>
                    ${tagsHtml}
                    <a href="${finalUrl}" class="link-more" style="margin-top: auto; padding-top: 20px;">Ver detalles <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            `;
            resultsGrid.insertAdjacentHTML('beforeend', tarjetaHtml);
        });
    }

    // Regresa el buscador a su estado original oculto
    function cerrarBuscador(input, clearBtn, resultsArea, grid, wrapper, header) {
        input.value = '';
        clearBtn.style.display = 'none';
        resultsArea.style.display = 'none';
        grid.innerHTML = '';
        wrapper.classList.remove('active');
        header.classList.remove('search-is-open');
    }
});