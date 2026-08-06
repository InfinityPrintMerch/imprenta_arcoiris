/* assistant.js - Inteligencia de RainB (Imprenta Arcoiris) - Versión Completa y Corregida */
document.addEventListener("asistenteCargado", () => {
    const toggleBtn = document.getElementById("ai-toggle-btn");
    const chatWindow = document.getElementById("ai-chat-window");
    const closeBtn = document.getElementById("ai-close-btn");
    const chatBody = document.getElementById("ai-chat-body");
    const optionsContainer = document.getElementById("ai-options-container");
    const userInput = document.getElementById("ai-user-input");
    const sendBtn = document.getElementById("ai-send-btn");

    let isChatOpen = false;
    let chatInitialized = false;

    // Contacto de la sucursal actualizado
    const WHATSAPP_NUMBER = "522411250287";

    // ==========================================
    // 0. NAVEGACIÓN CORREGIDA (Rutas Relativas)
    // ==========================================
    const navigateTo = (page) => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/servicios/')) {
            window.location.href = page;
        } else {
            window.location.href = `servicios/${page}`;
        }
    };

    // ==========================================
    // 1. MOTOR DE VARIACIONES
    // ==========================================
    const getDynamicMessage = (msgData) => {
        if (Array.isArray(msgData)) {
            const randomIndex = Math.floor(Math.random() * msgData.length);
            return msgData[randomIndex];
        }
        return msgData;
    };

    // ==========================================
    // 2. BASE DE CONOCIMIENTOS (JSON de RainB)
    // ==========================================
    const conversationFlow = {
        inicio: {
            msg: [
                "¡Hola! 👋 Soy <strong>RainB</strong>, el asistente virtual de <strong>Imprenta Arcoiris</strong> 🌈.<br><br>¿En qué te puedo ayudar hoy? Escríbeme o elige una opción 👇:",
                "¡Qué tal! ✨ Soy <strong>RainB</strong> de <strong>Imprenta Arcoiris</strong>. Estoy aquí para resolver tus dudas de impresión y diseño.<br><br>¿Qué necesitas hoy?"
            ],
            options: [
                { text: "💵 Cotizar algo", next: "cotizar" },
                { text: "🗂️ Ver Servicios", next: "servicios" },
                { text: "⏱️ Entregas y Pagos", next: "entregas" },
                { text: "📎 Enviar Archivos", next: "archivos" }
            ]
        },

        // --- MENÚ DE SERVICIOS EXPANDIDO ---
        servicios: {
            msg: "Manejamos <strong>más de 20 soluciones</strong> para tu marca. 🛠️<br><br>Aquí tienes nuestro catálogo principal. Selecciona lo que buscas:",
            options: [
                { text: "📇 Tarjetas, Volantes y Notas", next: "papeleria" },
                { text: "📏 Lonas y Gran Formato", next: "lonas" },
                { text: "👕 Playeras, Textiles y DTF", next: "merch" },
                { text: "✂️ Stickers y Corte Suaje", next: "suaje" },
                { text: "⚡ Corte Láser y Grabado", next: "laser" },
                { text: "🔏 Sellos de Goma", next: "sellos" },
                { text: "💌 Invitaciones (Digital/Impresa)", next: "invitaciones" },
                { text: "🧊 Impresión 3D", next: "impresion_3d" },
                { text: "🖼️ Posters y Cuadros", next: "posters_cuadros" },
                { text: "🚗 Rotulación y Señalética", next: "rotulacion" },
                { text: "🎨 Diseño Gráfico", next: "diseno" },
                { text: "✨ Laminados y Enmicados", next: "laminados" },
                { text: "🔙 Volver al inicio", next: "inicio" }
            ]
        },

        // --- RESPUESTAS ESPECÍFICAS DEL CATÁLOGO ---
        lonas: {
            msg: "📏 <strong>Lonas y Gran Formato:</strong><br><br>• Cobramos por <strong>m²</strong>. Recuerda pasarnos tu medida exacta.<br>• <strong>Calidad Fotográfica (FHD):</strong> Hasta 1.5m de ancho x 50m de largo.<br>• <strong>Gran Formato (Espectaculares):</strong> Hasta 3.2m de ancho x 50m.",
            options: [
                { text: "👀 Ver sección Gran Formato", action: () => navigateTo("gran-formato.html") },
                { text: "📎 Reglas para Archivos", next: "archivos" },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        papeleria: {
            msg: "📇 <strong>Papelería Corporativa:</strong><br><br>Hacemos <strong>Notas de remisión</strong> (hasta 3 colores), <strong>tarjetas, volantes y trípticos</strong>.<br><br>💡 <em>Tip: Podemos hacer desde 100 piezas, pero el precio es mayor. ¡Siempre conviene más pedir el millar por tiraje!</em>",
            options: [
                { text: "👀 Ver sección Papelería", action: () => navigateTo("papeleria.html") },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        posters_cuadros: {
            msg: "🖼️ <strong>Posters y Cuadros:</strong><br><br>¡Decoramos tus espacios! Hacemos <strong>posters a medida</strong> y <strong>cuadros</strong> de alta calidad.",
            options: [
                { text: "💵 Cotizar Cuadro", next: "cotizar" },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        sellos: {
            msg: "🔏 <strong>Sellos de Goma:</strong><br><br>Manejamos sellos <strong>automáticos o manuales</strong> (que son los de banco de madera). Nos adaptamos a ti:<br>• Podemos hacer la pura goma si la ocupan.<br>• Solo el mecanismo si te hace falta.<br>• O el sello completo armado.",
            options: [
                { text: "💵 Cotizar Sello", next: "cotizar" },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        laser: {
            msg: "⚡ <strong>Corte Láser:</strong><br><br>Se cobra por <strong>minuto de corte + material</strong> (MDF, cartulina, acrílico, triplay).<br>Hacemos corte, medio corte, tallado, grabado y hasta diseñamos mecanismos o puzzles armables en MDF.",
            options: [
                { text: "👀 Ver sección CNC Láser", action: () => navigateTo("cnc-laser.html") },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        impresion_3d: {
            msg: "🧊 <strong>Impresión 3D:</strong><br><br>Se cotiza evaluando la pieza. Recibimos formatos <strong>STL, SLDPRT, 3MF</strong>.<br>Área máxima: 220x220x250 mm (piezas más grandes se hacen por partes). ¡Ideal para piezas mecánicas o repuestos de carro!",
            options: [
                { text: "👀 Ver sección Impresión 3D", action: () => navigateTo("impresion-3d.html") },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        laminados: {
            msg: "✨ <strong>Laminados y Enmicados:</strong><br><br>• <strong>Térmicos:</strong> Brillante, mate, metálico y holográficos.<br>• <strong>En frío:</strong> Enmicados con vinil transparente o impreso sobre coroplast/lámina.<br>• <strong>Enmicado tradicional:</strong> Hasta tamaño tabloide (11x17\") o medida libre. (A mayor cantidad, menor costo por pieza).",
            options: [
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        merch: {
            msg: "👕 <strong>Playeras y Textiles:</strong><br><br>¡Personalizamos tus prendas! Manejamos <strong>playeras sublimadas</strong>, y opciones con <strong>DTF textil</strong> o con <strong>vinil textil</strong>.<br>También sublimamos tazas, termos y llaveros, o usamos DTF UV / Rotulación Vinil dependiendo del artículo.",
            options: [
                { text: "👀 Ver sección Promocionales", action: () => navigateTo("promocionales.html") },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        rotulacion: {
            msg: "🚗 <strong>Rotulación:</strong><br><br>Hacemos rotulación para vehículos y señaléticas para tu negocio. ¿Te gustaría ver ejemplos visuales?",
            options: [
                { text: "👀 Ver sección Rotulación", action: () => navigateTo("rotulacion.html") },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        suaje: {
            msg: "✂️ <strong>Stickers y Suaje:</strong><br><br>Realizamos Corte y Suaje para calcomanías, etiquetas y empaques con formas creativas.",
            options: [
                { text: "👀 Ver sección Corte/Suaje", action: () => navigateTo("corte-suaje.html") },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        invitaciones: {
            msg: "💌 <strong>Invitaciones:</strong><br><br>¡Hacemos de todo! Diseño web, invitaciones en video, digitales e impresas, invitaciones especiales y con corte láser.<br><br>Te invito a ver los diferentes ejemplos que tenemos para que conozcas nuestro trabajo:",
            options: [
                { text: "👀 Ver sección Invitaciones", action: () => navigateTo("invitaciones.html") },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },
        diseno: {
            msg: "🎨 <strong>Diseño Gráfico:</strong><br><br>Podemos apoyarte a darle identidad a tu marca, desde logotipos hasta recursos para impresión.",
            options: [
                { text: "👀 Ver sección Diseño", action: () => navigateTo("diseno-grafico.html") },
                { text: "🔙 Volver", next: "servicios" }
            ]
        },

        // --- POLÍTICAS Y REGLAS DE NEGOCIO ---
        educacion_normal: {
            msg: "💡 <strong>¡Un tip de imprenta!</strong><br><br>En este mundo no existe el \"tamaño normal\" ni el \"papel normal\", <strong>todo se hace a la necesidad del cliente</strong>. 😊<br><br>• Por ejemplo, en papel hay opciones como <em>bond</em> o <em>couché</em>, y tamaños como <em>carta</em> o <em>tabloide</em>.<br>• Para lonas, necesitamos que nos des tu <strong>medida exacta</strong> en centímetros o metros.<br><br>⚠️ <em>Nota: El acomodo de archivos para impresión tiene un costo extra.</em>",
            options: [
                { text: "📝 Entendido", next: "inicio" },
                { text: "📱 Asesoría en WhatsApp", next: "humano" }
            ]
        },
        archivos: {
            msg: "⚠️ <strong>Reglas para impresión en Plotter y Gran Formato:</strong><br><br>✅ <strong>Formatos Aceptados:</strong> CDR, PSD, AI.<br>✅ <strong>Imágenes:</strong> PNG, JPG, TIFF, pero deben tener la <strong>medida exacta</strong>. La calidad depende de la que se entregue; favor de checar antes de enviar porque no nos hacemos responsables por pérdidas de calidad.<br><br>🚫 <strong>NO Aceptamos:</strong> Archivos en PowerPoint o Excel (luego los llevan así y no sirven para impresión).<br><br>📝 <strong>Si envías PDF:</strong> Deben estar convertidos a curvas (las fuentes) y debe estar lo más optimizado posible.",
            options: [
                { text: "🎨 Sobre los Colores", next: "colores" },
                { text: "👍 Entendido", next: "inicio" }
            ]
        },
        colores: {
            msg: "🎨 <strong>Sobre los Colores de Impresión:</strong><br><br>Recordar que los colores <strong>siempre se ven afectados</strong> al pasar de pantalla a impresión.<br><br>De requerir un <strong>color exacto</strong> se manejará en <strong>Pantone</strong>, pero debe de darse a conocer con antelación esa información para que no haya problema.",
            options: [
                { text: "👍 Entendido", next: "inicio" },
                { text: "📱 Hablar con un asesor", next: "humano" }
            ]
        },
        entregas: {
            msg: "📦 <strong>Entregas y Urgencias:</strong><br><br>• <strong>Entregas a domicilio:</strong> Servicio nuevo con costo extra según distancia (máx. 3km en Apizaco). Esto aumenta el tiempo de entrega, de preferencia sugerimos pasar al local.<br>• <strong>Urgencias:</strong> Tienen tarifa extra. Se sacan rápido si hay material disponible; el % extra depende de la urgencia.<br>• 🚨 <strong>POLÍTICA DE ABANDONO:</strong> Tienes MÁXIMO 15 DÍAS para recoger tu producto. No somos almacén, pasado ese tiempo se desecha.",
            options: [
                { text: "💳 Ver métodos de pago", next: "pagos" },
                { text: "🔙 Volver al inicio", next: "inicio" }
            ]
        },
        pagos: {
            msg: "💳 <strong>Pagos y Anticipos:</strong><br><br>• <strong>Anticipo:</strong> Pedimos 70% para clientes nuevos, y 50% para clientes registrados en sistema o mayoristas.<br>• <strong>Métodos de pago:</strong> Efectivo y Transferencia (próximamente tendremos terminal).",
            options: [
                { text: "📦 Ver Entregas", next: "entregas" },
                { text: "🔙 Volver al inicio", next: "inicio" }
            ]
        },
        cotizar: {
            msg: [
                "Como los costos dependen 100% del material y las medidas exactas, <strong>no puedo darte precios por aquí</strong>. 😅<br><br>Para cotizarte correctamente y darte la mejor opción, por favor comunícate con un asesor por WhatsApp.",
                "¡Me encantaría darte el precio! Pero en imprenta los costos varían según el tamaño, material y acabados. 📏✨<br><br>Para darte un precio exacto, por favor mándanos un mensajito a WhatsApp."
            ],
            options: [
                { text: "📱 Cotizar por WhatsApp", action: () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank") },
                { text: "🔙 Seguir platicando", next: "inicio" }
            ]
        },
        humano: {
            msg: "Claro, para dudas específicas o cotizaciones, lo mejor es hablar de humano a humano. 🧑‍💻 Te transfiero a nuestro WhatsApp (241 125 0287).",
            options: [
                { text: "📱 Abrir WhatsApp", action: () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank") },
                { text: "❌ Cancelar", next: "inicio" }
            ]
        },
        desconocido: {
            msg: [
                "Mmm... 🤔 Aún no tengo una respuesta para eso. Yo solo respondo dudas sobre los servicios de la imprenta. ¿Te gustaría comunicarte con un asesor por WhatsApp?",
                "¡Uy! Esa no me la sé. 😅 Como soy una IA enfocada solo en Imprenta Arcoiris, te sugiero comunicarte con mis compañeros humanos al 241 125 0287.",
                "Disculpa, no tengo información sobre ese tema en específico. 🤖 Mi conocimiento es solo sobre nuestros servicios de impresión. ¿Prefieres que te pase al WhatsApp de la tienda?"
            ],
            options: [
                { text: "📱 Hablar con un asesor", action: () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank") },
                { text: "🏠 Ver menú principal", next: "inicio" }
            ]
        }
    };
    // ==========================================
    // 3. MOTOR NLP (Reconocimiento de intenciones)
    // ==========================================
    const analyzeInput = (text) => {
        const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,?¿!¡]/g, "");
        const words = normalized.split(/\s+/);

        const intents = {
            educacion_normal: { score: 0, keywords: ["normal", "normalito", "estandar", "comun"] },
            cotizar: { score: 0, keywords: ["precio", "costo", "cotizar", "cuanto", "presupuesto", "cobran", "vale", "sale", "dinero", "cotizacion", "precios"] },

            // Servicios
            lonas: { score: 0, keywords: ["lona", "vinil", "espectacular", "microperforado", "banner", "largo", "ancho", "m2", "metros", "fhd", "plotter", "gran formato"] },
            papeleria: { score: 0, keywords: ["nota", "notas", "remision", "tarjeta", "tarjetas", "volante", "volantes", "triptico", "folleto", "catalogo", "ciento", "millar", "tiraje"] },
            sellos: { score: 0, keywords: ["sello", "sellos", "goma", "automatico", "madera", "mecanismo", "banco"] },
            rotulacion: { score: 0, keywords: ["rotulacion", "vehiculo", "coche", "carro", "flotilla", "senaletica", "señal", "letrero"] },
            suaje: { score: 0, keywords: ["suaje", "sticker", "stickers", "etiqueta", "empaque", "calcomania", "silueta", "troquel", "caja", "corte vinil"] },
            invitaciones: { score: 0, keywords: ["invitacion", "invitaciones", "boda", "xv", "fiesta", "bautizo", "evento", "digitales", "video"] },
            laser: { score: 0, keywords: ["laser", "corte", "minuto", "mdf", "acrilico", "cartulina", "triplay", "grabado", "tallado", "cnc", "puzzle"] },
            impresion_3d: { score: 0, keywords: ["3d", "impresion 3d", "stl", "sldprt", "3mf", "repuesto", "pieza", "mecanica"] },
            laminados: { score: 0, keywords: ["laminado", "brillante", "mate", "holografico", "metalico", "frio", "termico", "enmicado", "tabloide", "mica", "coroplast"] },
            merch: { score: 0, keywords: ["playera", "playeras", "gorra", "gorras", "dtf", "textil", "prenda", "estampado", "serigrafia", "ropa", "sudadera", "uniforme", "taza", "termo", "llavero", "sublimacion", "merch"] },
            diseno: { score: 0, keywords: ["diseno", "diseñar", "logo", "logotipo", "idea", "crear", "identidad", "campaña"] },
            posters_cuadros: { score: 0, keywords: ["poster", "posters", "cuadro", "cuadros", "lienzo", "fotografia"] },

            // Reglas y Políticas
            archivos: { score: 0, keywords: ["archivo", "pdf", "canva", "corel", "illustrator", "photoshop", "curvas", "fuentes", "letras", "imagen", "acomodo", "cmyk", "exportar", "cdr", "psd", "ai", "png", "jpg", "tiff", "power", "excel", "powerpoint", "resolucion", "calidad"] },
            colores: { score: 0, keywords: ["color", "colores", "pantone", "exacto", "tono", "tonalidad", "variacion"] },
            entregas: { score: 0, keywords: ["entrega", "envio", "domicilio", "tiempo", "urgente", "urgencia", "tardan", "recoger", "dias", "apizaco", "distancia", "rapido", "15 dias", "abandonado", "desechan"] },
            pagos: { score: 0, keywords: ["pago", "pagar", "transferencia", "efectivo", "anticipo", "terminal", "mayorista", "cliente", "adelanto", "50%", "70%"] },
            humano: { score: 0, keywords: ["humano", "persona", "asesor", "whatsapp", "hablar", "contacto"] },
            inicio: { score: 0, keywords: ["hola", "buenos", "dias", "tardes", "noches", "inicio", "menu", "saludos"] }
        };

        let highestScore = 0;
        let bestMatch = "desconocido";

        if (normalized.includes("tamano normal") || normalized.includes("medida normal") || normalized.includes("papel normal") || normalized.includes("hoja normal")) {
            return "educacion_normal";
        }

        for (const [intentKey, data] of Object.entries(intents)) {
            data.keywords.forEach(kw => {
                if (words.includes(kw)) {
                    data.score += 2;
                } else if (kw.length > 4 && normalized.includes(kw)) {
                    data.score += 1;
                }
            });

            if (data.score > highestScore) {
                highestScore = data.score;
                bestMatch = intentKey;
            }
        }

        return highestScore > 0 ? bestMatch : "desconocido";
    };

    // ==========================================
    // 4. FUNCIONES DE UI Y RENDERIZADO
    // ==========================================
    const toggleChat = () => {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatWindow.classList.remove("hidden");
            toggleBtn.classList.add("hidden-btn");
            if (!chatInitialized) {
                renderNode("inicio");
                chatInitialized = true;
            }
            setTimeout(() => userInput.focus(), 300);
        } else {
            chatWindow.classList.add("hidden");
            toggleBtn.classList.remove("hidden-btn");
        }
    };

    if (toggleBtn && closeBtn) {
        toggleBtn.addEventListener("click", toggleChat);
        closeBtn.addEventListener("click", toggleChat);
    }

    const addMessage = (text, sender = "bot") => {
        const msgDiv = document.createElement("div");
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.innerHTML = text;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    };

    const showTypingIndicator = () => {
        const typingDiv = document.createElement("div");
        typingDiv.className = "typing-indicator";
        typingDiv.id = "typing-indicator";
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatBody.appendChild(typingDiv);
        scrollToBottom();
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById("typing-indicator");
        if (indicator) indicator.remove();
    };

    const scrollToBottom = () => {
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const handleUserText = () => {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, "user");
        userInput.value = "";
        optionsContainer.innerHTML = "";

        const matchedNode = analyzeInput(text);
        renderNode(matchedNode);
    };

    if (sendBtn && userInput) {
        sendBtn.addEventListener("click", handleUserText);
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleUserText();
        });
    }

    const renderNode = (nodeKey) => {
        optionsContainer.innerHTML = "";

        let node = conversationFlow[nodeKey];
        if (!node) {
            console.warn(`Nodo no encontrado: ${nodeKey}. Redirigiendo a desconocido.`);
            node = conversationFlow["desconocido"];
        }

        const finalMessage = getDynamicMessage(node.msg);

        showTypingIndicator();

        const delay = Math.min(Math.max(finalMessage.length * 12, 600), 1800);

        setTimeout(() => {
            removeTypingIndicator();
            addMessage(finalMessage, "bot");

            if (node.options) {
                node.options.forEach(opt => {
                    const btn = document.createElement("button");
                    btn.className = "ai-option-btn";
                    btn.innerHTML = opt.text;
                    btn.onclick = () => {
                        addMessage(opt.text, "user");
                        optionsContainer.innerHTML = "";

                        if (opt.action) {
                            opt.action();
                            setTimeout(() => renderNode("inicio"), 1500);
                        } else if (opt.next) {
                            renderNode(opt.next);
                        }
                    };
                    optionsContainer.appendChild(btn);
                });
            }
            scrollToBottom();
        }, delay);
    };
});