/* components.js */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Detectar si estamos en una subcarpeta (ej. la carpeta "servicios")
    const isSubfolder = window.location.pathname.includes('/servicios/');

    // Si estamos en subcarpeta usamos '../', si no, usamos './' (raíz)
    const basePath = isSubfolder ? '../' : './';

    try {
        // --- CARGAR HEADER ---
        const headerRes = await fetch(basePath + 'header.html');
        let headerHtml = await headerRes.text();

        // Si estamos en una subcarpeta, corregimos TODAS las rutas automáticamente
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

        // --- CARGAR FOOTER ---
        const footerRes = await fetch(basePath + 'footer.html');
        let footerHtml = await footerRes.text();

        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHtml;
        }

        // --- LÓGICA DEL HEADER Y MENÚ MÓVIL ---
        const header = document.getElementById('main-header');
        const menuToggle = document.getElementById('menu-toggle');
        const navLinksContainer = document.getElementById('nav-links');

        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
            });
        }

        // Lógica del menú hamburguesa
        if (menuToggle && navLinksContainer) {
            menuToggle.addEventListener('click', () => {
                navLinksContainer.classList.toggle('nav-active');

                // Cambiar el icono (de barras a 'X')
                const icon = menuToggle.querySelector('i');
                if (navLinksContainer.classList.contains('nav-active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });

            // Cerrar menú al hacer clic en cualquier enlace
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

        // --- LÓGICA PARA MARCAR EL ENLACE ACTIVO EN EL MENÚ ---
        const navLinks = document.querySelectorAll('.nav-links a');
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');

            // 1. Si estamos dentro de la carpeta de servicios, resaltar "Servicios"
            if (isSubfolder && linkHref.includes('#servicios')) {
                link.classList.add('active');
            }
            // 2. Si estamos en el index.html
            else if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
                if (currentHash) {
                    if (linkHref.includes(currentHash)) link.classList.add('active');
                } else if (linkHref === 'index.html' || linkHref === '../index.html') {
                    link.classList.add('active');
                }
            }
            // 3. Para las páginas separadas (galería o contacto)
            else {
                if (currentPath.includes('galeria') && linkHref.includes('galeria')) link.classList.add('active');
                if (currentPath.includes('contacto') && linkHref.includes('contacto')) link.classList.add('active');
            }
        });

        // Actualizar el activo visualmente al hacer clic en anclas (ej. "#productos") sin recargar
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // --- INICIAR ANIMACIONES GLOBALES (fade-in-up) ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    } catch (error) {
        console.error("Error cargando los componentes. Recuerda usar Live Server:", error);
    }
});