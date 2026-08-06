/* components.js */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Detectar si estamos en una subcarpeta (ej. la carpeta "servicios")
    const isSubfolder = window.location.pathname.includes('/servicios/');
    const basePath = isSubfolder ? '../' : './';

    try {
        // --- 1. CARGAR HEADER ---
        const headerRes = await fetch(basePath + 'header.html');
        let headerHtml = await headerRes.text();

        // Corregir rutas automáticamente si estamos en subcarpeta
        if (isSubfolder) {
            headerHtml = headerHtml.replace(/href="index\.html/g, 'href="../index.html');
            headerHtml = headerHtml.replace(/href="galeria\.html/g, 'href="../galeria.html');
            headerHtml = headerHtml.replace(/href="contacto\.html/g, 'href="../contacto.html');
            headerHtml = headerHtml.replace(/src="logotipe\.png"/g, 'src="../logotipe.png"');
        }

        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerHtml;
        }

        // --- 2. INYECTAR ÁREA DE RESULTADOS DE BÚSQUEDA AUTOMÁTICAMENTE ---
        if (!document.getElementById('search-results-area')) {
            const searchArea = document.createElement('section');
            searchArea.id = 'search-results-area';
            searchArea.style.display = 'none';
            searchArea.innerHTML = `
                <div class="container">
                    <div class="results-header" style="margin-bottom: 50px; padding-bottom: 25px; border-bottom: 2px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 2.2rem; color: var(--blue-dark); font-weight: 800;">
                            Resultados para: <span id="searchTermDisplay" style="color: var(--gold); position: relative;"></span>
                        </h2>
                        <span id="resultsCount">0 servicios encontrados</span>
                    </div>
                    <div class="service-grid" id="resultsGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px;"></div>
                </div>
            `;
            if (headerPlaceholder) {
                headerPlaceholder.insertAdjacentElement('afterend', searchArea);
            }
        }

        // --- 2.5 INYECTAR ASISTENTE VIRTUAL FLOTANTE AUTOMÁTICAMENTE ---
        if (!document.getElementById('ai-assistant-container')) {
            const aiContainer = document.createElement('div');
            aiContainer.id = 'ai-assistant-container';
            aiContainer.innerHTML = `
                <button id="ai-toggle-btn" class="ai-float-btn" aria-label="Abrir asistente">
                    <i class="fa-solid fa-robot"></i>
                </button>
                <div id="ai-chat-window" class="ai-chat-window hidden">
                    <div class="ai-chat-header">
                        <div class="ai-header-info">
                            <div class="ai-avatar"><i class="fa-solid fa-rainbow"></i></div>
                            <div>
                                <h4>RainB</h4>
                                <span class="ai-status">En línea</span>
                            </div>
                        </div>
                        <button id="ai-close-btn" class="ai-close-btn"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="ai-chat-body" id="ai-chat-body"></div>
                    <div class="ai-chat-footer" id="ai-options-container"></div>
                    
                    <!-- NUEVA ZONA DE ESCRITURA -->
                    <div class="ai-chat-input-area">
                        <input type="text" id="ai-user-input" placeholder="Escribe tu mensaje..." autocomplete="off">
                        <button id="ai-send-btn" title="Enviar"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            `;
            document.body.appendChild(aiContainer);
        }

        // --- 3. CARGAR FOOTER ---
        const footerRes = await fetch(basePath + 'footer.html');
        if (footerRes.ok) {
            let footerHtml = await footerRes.text();
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = footerHtml;
            }
        }

        // --- 4. LÓGICA DEL HEADER Y MENÚ MÓVIL ---
        const header = document.getElementById('main-header');
        const menuToggle = document.getElementById('menu-toggle');
        const navLinksContainer = document.getElementById('nav-links');

        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
            });
        }

        if (menuToggle && navLinksContainer) {
            menuToggle.addEventListener('click', () => {
                navLinksContainer.classList.toggle('nav-active');
                const icon = menuToggle.querySelector('i');
                if (navLinksContainer.classList.contains('nav-active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });

            const links = navLinksContainer.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navLinksContainer.classList.remove('nav-active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                });
            });
        }

        // --- 5. LÓGICA PARA MARCAR EL ENLACE ACTIVO EN EL MENÚ ---
        const navLinks = document.querySelectorAll('.nav-links a');
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');

            if (isSubfolder && linkHref.includes('#servicios')) {
                link.classList.add('active');
            } else if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
                if (currentHash) {
                    if (linkHref.includes(currentHash)) link.classList.add('active');
                } else if (linkHref === 'index.html' || linkHref === '../index.html') {
                    link.classList.add('active');
                }
            } else {
                if (currentPath.includes('galeria') && linkHref.includes('galeria')) link.classList.add('active');
                if (currentPath.includes('contacto') && linkHref.includes('contacto')) link.classList.add('active');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // --- 6. INICIAR ANIMACIONES GLOBALES ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

        // --- 7. AVISO DE CARGA TERMINADA ---
        document.dispatchEvent(new Event('headerCargado'));
        document.dispatchEvent(new Event('asistenteCargado')); // <--- Avisamos al assistant.js que ya puede arrancar

    } catch (error) {
        console.error("Error cargando los componentes. Recuerda usar Live Server:", error);
    }
});