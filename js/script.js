// --- CONFIGURACIÓN DE SWIPESTUDIO ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias DOM
    const textInput = document.getElementById('textInput');
    const authorInput = document.getElementById('authorInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.getElementById('previewContainer');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const logoInput = document.getElementById('logoInput');
    const fontSelect = document.getElementById('fontSelect');
    const formatSelect = document.getElementById('formatSelect'); // Selector de formato
    
    // Referencias de Fondo Personalizado
    const bgColorInput = document.getElementById('bgColorInput');
    const bgImageInput = document.getElementById('bgImageInput');
    const resetBgBtn = document.getElementById('resetBgBtn');

    // Referencias de Monetización y Texto
    const removeWatermarkTrigger = document.getElementById('removeWatermarkTrigger');
    const promoCodeArea = document.getElementById('promoCodeArea');
    const applyCodeBtn = document.getElementById('applyCodeBtn');
    const promoInput = document.getElementById('promoInput');
    const premiumSuccessMsg = document.getElementById('premiumSuccessMsg');
    const sizeInput = document.getElementById('sizeInput');
    const sizeValue = document.getElementById('sizeValue');

    // 2. Variables de estado
    let globalAuthor = "@miusuario";
    let currentTheme = "theme-classic"; 
    let globalLogoUrl = ""; 
    let currentFont = "font-inter";
    let slidesState = []; 
    let currentFormat = "square"; 
    let currentFontSize = 24; 
    let customBgColor = ""; 
    let customBgImage = ""; // <--- CORREGIDO (Antes decía letcustomBgImage)

    // Medidas para diferentes formatos (Referencia para JS)
    const FORMAT_DIMENSIONS = {
        square:    { width: 1080, height: 1080 },
        portrait:  { width: 1080, height: 1350 },
        story:     { width: 1080, height: 1920 },
        landscape: { width: 1920, height: 1080 }
    };

    // --- LISTA DE TEMAS DE PAGO ---
    const PREMIUM_THEMES = ['theme-cyberpunk', 'theme-luxury']; 

    // VERIFICACIÓN INTELIGENTE DE PREMIUM
    const codigoGuardado = localStorage.getItem('userPromoCode');
    
    // Verificamos si el código guardado existe en la lista cargada desde codes.js
    if (codigoGuardado && typeof CODIGOS_VALIDOS !== 'undefined' && CODIGOS_VALIDOS.includes(codigoGuardado)) {
        window.isPremium = true;
    } else {
        window.isPremium = false;
    }

    // Si ya es premium al entrar, aplicamos cambios visuales
   if (window.isPremium) {
        document.body.classList.add('premium-mode');
        if (premiumSuccessMsg) premiumSuccessMsg.style.display = 'block';
        if (removeWatermarkTrigger) removeWatermarkTrigger.style.display = 'none';
        if (promoCodeArea) promoCodeArea.style.display = 'none';
    }

    // ---------------------------------------------------------
    // FUNCIÓN PRINCIPAL: Renderizar las diapositivas
    // ---------------------------------------------------------
    function renderSlides(text = textInput.value) { 
        previewContainer.innerHTML = '';
        
        if (!text) text = "";
        const paragraphs = text.split('\n\n'); 
        
        const contentToRender = (paragraphs.length === 1 && paragraphs[0] === "") 
                                ? ["Escribe aquí tu frase genial..."] 
                                : paragraphs;

        let logoHTML = "";
        if (globalLogoUrl !== "") {
            logoHTML = `<img src="${globalLogoUrl}" class="slide-logo" alt="Logo">`;
        }
        
        contentToRender.forEach((paragraph, index) => {
            const slide = document.createElement('div');
            
            const premiumClass = window.isPremium ? 'premium-mode' : '';
            // Aplicamos clase de tema y de formato
            slide.className = `carousel-slide ${currentTheme} ${premiumClass} format-${currentFormat}`;

// --- APLICAR FONDO (VERSIÓN FUERZA BRUTA) ---
            
            // 1. Reseteo agresivo
            slide.style.removeProperty('background-image');
            slide.style.removeProperty('background-color');
            slide.style.background = ""; 

            // 2. Aplicar con prioridad máxima
            if (customBgImage) {
                // Si hay imagen, forzamos que se muestre y cubra todo
                slide.style.setProperty('background-image', `url(${customBgImage})`, 'important');
                slide.style.setProperty('background-size', 'cover', 'important');
                slide.style.setProperty('background-position', 'center', 'important');
                slide.style.setProperty('background-repeat', 'no-repeat', 'important');
            } 
            else if (customBgColor) {
                // Si hay color, forzamos el color y quitamos cualquier imagen del tema
                slide.style.setProperty('background-color', customBgColor, 'important');
                slide.style.setProperty('background-image', 'none', 'important');
            }
            // ---------------------------------------------------------

            // --- A. DEFINIR EL TEXTO ---
            const textHtml1 = `
                <p class="${currentFont} slide-text-content" style="font-size: ${currentFontSize}px;">
                    ${paragraph}
                </p>
            `;
            
            const textHtml2 = ""; 

            // --- B. VISTA PREVIA (CANDADO) ---
            let previewOverlay = "";

            if (PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) {
                previewOverlay = `
                    <div style="
                        position: absolute; 
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.85); 
                        display: flex; 
                        flex-direction: column;
                        justify-content: center; 
                        align-items: center; 
                        z-index: 100;
                        border-radius: 8px;
                        pointer-events: none;
                    ">
                        <span style="font-size: 60px;">🔒</span>
                        <span style="color: white; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-align: center;">
                            Premium
                        </span>
                        <span style="color: #ddd; font-size: 14px; margin-top: 10px;">
                            Usa tu código para desbloquear
                        </span>
                    </div>
                `;
            }
            
            // --- C. INYECTAR HTML FINAL ---
            slide.innerHTML = `
                <div class="slide-content">
                    ${previewOverlay} 
                    ${logoHTML}       
                    ${textHtml1}      
                    ${textHtml2}      
                </div>

                <div class="slide-footer">
                    <span class="${currentFont}" style="font-size: 0.8rem">${globalAuthor}</span>

                    <span class="watermark ${currentFont}" style="font-size: 0.6rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">
                        ⚡ Creado con SwipeStudio
                    </span>

                    <span class="${currentFont}" style="font-size: 0.8rem">${index + 1}/${contentToRender.length}</span>
                </div>
            `;
            previewContainer.appendChild(slide);
        });
    }

    // ---------------------------------------------------------
    // EVENTOS
    // ---------------------------------------------------------

    if(formatSelect) {
        formatSelect.addEventListener('change', (e) => {
            currentFormat = e.target.value;
            renderSlides();
        });
    }

    if(textInput) textInput.addEventListener('input', (e) => renderSlides(e.target.value));

    if(authorInput) {
        authorInput.addEventListener('input', (e) => {
            globalAuthor = e.target.value || "@miusuario";
            renderSlides(); 
        });
    }

    if(sizeInput) {
        sizeInput.addEventListener('input', (e) => {
            currentFontSize = e.target.value;
            if(sizeValue) sizeValue.innerText = `${currentFontSize}px`;
            renderSlides();
        });
    }

    // --- EVENTOS DE FONDO ---
    if (bgColorInput) {
        bgColorInput.addEventListener('input', (e) => {
            customBgColor = e.target.value;
            customBgImage = ""; // Limpiar imagen si se selecciona color
            if(bgImageInput) bgImageInput.value = "";
            renderSlides();
        });
    }

    if (bgImageInput) {
        bgImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    customBgImage = event.target.result;
                    customBgColor = ""; // Limpiar color si se selecciona imagen
                    if(bgColorInput) bgColorInput.value = ""; // Reset visual (opcional)
                    renderSlides();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (resetBgBtn) {
        resetBgBtn.addEventListener('click', () => {
            customBgColor = "";
            customBgImage = "";
            if(bgColorInput) bgColorInput.value = "#ffffff";
            if(bgImageInput) bgImageInput.value = "";
            renderSlides();
        });
    }

    // Botones de temas
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentTheme = btn.getAttribute('data-theme');

            const isPremiumTheme = btn.getAttribute('data-premium') === "true";
            
            if (isPremiumTheme && !window.isPremium) {
                console.log("Modo Vista Previa Activado"); 
            }

            // Reset de fondos personalizados al cambiar tema (Mejora UX)
            customBgColor = "";
            customBgImage = "";
            if(bgColorInput) bgColorInput.value = "#ffffff";
            if(bgImageInput) bgImageInput.value = "";

            slidesState = [];
            renderSlides();
        });
    });

    // Subir Logo (CON CANDADO)
    if(logoInput) {
        logoInput.addEventListener('change', (e) => {
            if (!window.isPremium) {
                alert("🔒 La carga de Logos es una función exclusiva para usuarios PRO.\n\nIntroduce tu código VIP para desbloquearla.");
                logoInput.value = ""; 
                if(promoCodeArea) promoCodeArea.style.display = 'flex';
                return;
            }

            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    globalLogoUrl = event.target.result;
                    renderSlides();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if(fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            currentFont = e.target.value;
            renderSlides();
        });
    }

    // ---------------------------------------------------------
    // MONETIZACIÓN
    // ---------------------------------------------------------
    
    if(removeWatermarkTrigger) {
        removeWatermarkTrigger.addEventListener('click', () => {
            if (promoCodeArea.style.display === 'none') {
                promoCodeArea.style.display = 'flex';
            } else {
                promoCodeArea.style.display = 'none';
            }
        });
    }

    // Validar el código
    if(applyCodeBtn) {
        applyCodeBtn.addEventListener('click', () => {
            const codigoIngresado = promoInput.value.trim().toUpperCase();

            if (typeof CODIGOS_VALIDOS !== 'undefined' && CODIGOS_VALIDOS.includes(codigoIngresado)) {
                
                // 1. Guardamos y Activamos
                localStorage.setItem('userPromoCode', codigoIngresado);
                window.isPremium = true; 
                document.body.classList.add('premium-mode');
                
                // 2. Refrescamos la vista
                renderSlides();
                
                // Feedback visual
                promoCodeArea.style.display = 'none';
                removeWatermarkTrigger.style.display = 'none';
                if(premiumSuccessMsg) premiumSuccessMsg.style.display = 'block';
                
                alert("¡Código válido! Bienvenido al plan PRO.");
            } else {
                alert("Código no válido o no encontrado en la lista.");
            }
        });
    }
    
    // ---------------------------------------------------------
    // DESCARGAR PDF (VERSIÓN BLINDADA Y AUTÓNOMA)
    // ---------------------------------------------------------
    if(downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            
            // 1. SEGURIDAD
            if (typeof PREMIUM_THEMES !== 'undefined' && PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) {
                alert("⭐ Estás usando un Diseño Premium.\n\nIntroduce tu código PRO para descargar.");
                if(promoCodeArea) promoCodeArea.style.display = 'flex';
                return;
            }

            const btnOriginalText = downloadBtn.innerText;
            downloadBtn.innerText = "Calculando medidas...";
            
            // 2. LEER FORMATO DIRECTAMENTE DEL HTML (¡Más seguro!)
            const selectElement = document.getElementById('formatSelect');
            const formatoActual = selectElement ? selectElement.value : 'square';

            // 3. DICCIONARIO DE MEDIDAS (Local para evitar errores de lectura)
            const MEDIDAS = {
                square:    { w: 1080, h: 1080 },
                portrait:  { w: 1080, h: 1350 },
                story:     { w: 1080, h: 1920 },
                landscape: { w: 1920, h: 1080 }
            };

            const targetW = MEDIDAS[formatoActual].w;
            const targetH = MEDIDAS[formatoActual].h;

            console.log(`Generando PDF: ${formatoActual} (${targetW}x${targetH})`); 

            const { jsPDF } = window.jspdf;
            
            // 4. CREAR PDF CON LAS MEDIDAS EXACTAS
            const doc = new jsPDF({ 
                orientation: targetW > targetH ? 'landscape' : 'portrait', 
                unit: 'px', 
                format: [targetW, targetH] 
            });

            const slides = document.querySelectorAll('.carousel-slide');

            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];

                // Factor de Zoom
                const scaleFactor = targetW / slide.offsetWidth;

                const canvas = await html2canvas(slide, {
                    scale: scaleFactor, 
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');
                
                if (i > 0) doc.addPage([targetW, targetH]);
                doc.addImage(imgData, 'PNG', 0, 0, targetW, targetH);
            }

            doc.save(`swipestudio-${formatoActual}.pdf`);
            downloadBtn.innerText = btnOriginalText;
        });
    }

    // Inicializar
    renderSlides();

    // ---------------------------------------------------------
    // DESCARGAR IMÁGENES SUELTAS (ZIP)
    // ---------------------------------------------------------
    const downloadZipBtn = document.getElementById('downloadZipBtn');

    if (downloadZipBtn) {
        downloadZipBtn.addEventListener('click', async () => {
            
            // 1. Verificación Premium (Reutilizamos lógica existente)
            if (typeof PREMIUM_THEMES !== 'undefined' && PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) {
                alert("⭐ Estás usando un Diseño Premium.\n\nIntroduce tu código PRO para descargar.");
                if(promoCodeArea) promoCodeArea.style.display = 'flex'; // Único estilo necesario por lógica de UI
                return;
            }

            const btnOriginalText = downloadZipBtn.innerText;
            downloadZipBtn.innerText = "Procesando...";
            
            // 2. Inicializar ZIP
            const zip = new JSZip();
            const slides = document.querySelectorAll('.carousel-slide');
            
            // 3. Obtener medidas según formato seleccionado
            const selectElement = document.getElementById('formatSelect');
            const formatoActual = selectElement ? selectElement.value : 'square';
            
            const MEDIDAS_ZIP = {
                square:    { w: 1080 },
                portrait:  { w: 1080 },
                story:     { w: 1080 },
                landscape: { w: 1920 }
            };
            const targetW = MEDIDAS_ZIP[formatoActual].w;

            // 4. Bucle de generación
            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                
                // Feedback visual en el botón
                downloadZipBtn.innerText = `Generando ${i + 1}/${slides.length}...`;

                // Calcular escala para HD
                const scaleFactor = targetW / slide.offsetWidth;

                const canvas = await html2canvas(slide, {
                    scale: scaleFactor,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null,
                    logging: false
                });

                // Convertir Canvas a Blob (Archivo binario)
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                
                // Agregar al paquete ZIP
                zip.file(`slide-${i + 1}.png`, blob);
            }

            // 5. Generar y descargar archivo final
            downloadZipBtn.innerText = "Empaquetando...";
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `swipestudio-pack.zip`;
                link.click();
                
                downloadZipBtn.innerText = btnOriginalText;
            });
        });
    }
});