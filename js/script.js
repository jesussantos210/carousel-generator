// --- CONFIGURACIÓN DE SWIPESTUDIO ---

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. REFERENCIAS DEL DOM (HTML)
    // ==========================================
    const textInput = document.getElementById('textInput');
    const authorInput = document.getElementById('authorInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadZipBtn = document.getElementById('downloadZipBtn'); // Botón ZIP
    const previewContainer = document.getElementById('previewContainer');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const logoInput = document.getElementById('logoInput');
    const fontSelect = document.getElementById('fontSelect');
    const formatSelect = document.getElementById('formatSelect');
    const sizeInput = document.getElementById('sizeInput');
    const sizeValue = document.getElementById('sizeValue');

    // Referencias de Fondo Personalizado
    const bgColorInput = document.getElementById('bgColorInput');
    const bgImageInput = document.getElementById('bgImageInput');
    const resetBgBtn = document.getElementById('resetBgBtn');

    // Referencias de Monetización
    const removeWatermarkTrigger = document.getElementById('removeWatermarkTrigger');
    const promoCodeArea = document.getElementById('promoCodeArea');
    const applyCodeBtn = document.getElementById('applyCodeBtn');
    const promoInput = document.getElementById('promoInput');
    const premiumSuccessMsg = document.getElementById('premiumSuccessMsg');

    // ==========================================
    // 2. VARIABLES DE ESTADO
    // ==========================================
    let globalAuthor = "@miusuario";
    let currentTheme = "theme-classic"; 
    let globalLogoUrl = ""; 
    let currentFont = "font-inter";
    let slidesState = []; // Aquí guardamos las posiciones del Drag & Drop
    let currentFormat = "square"; 
    let currentFontSize = 24; 
    
    // Variables de Fondo
    let customBgColor = ""; 
    let customBgImage = ""; 

    // Medidas para PDF y ZIP
    const FORMAT_DIMENSIONS = {
        square:    { w: 1080, h: 1080 },
        portrait:  { w: 1080, h: 1350 },
        story:     { w: 1080, h: 1920 },
        landscape: { w: 1920, h: 1080 }
    };

    // Temas que requieren pago
    const PREMIUM_THEMES = ['theme-cyberpunk', 'theme-luxury']; 

    // ==========================================
    // 3. LÓGICA PREMIUM (Monetización)
    // ==========================================
    const codigoGuardado = localStorage.getItem('userPromoCode');
    
    if (codigoGuardado && typeof CODIGOS_VALIDOS !== 'undefined' && CODIGOS_VALIDOS.includes(codigoGuardado)) {
        window.isPremium = true;
    } else {
        window.isPremium = false;
    }

    if (window.isPremium) {
        document.body.classList.add('premium-mode');
        if (premiumSuccessMsg) premiumSuccessMsg.style.display = 'block';
        if (removeWatermarkTrigger) removeWatermarkTrigger.style.display = 'none';
        if (promoCodeArea) promoCodeArea.style.display = 'none';
    }

    // ==========================================
    // 4. FUNCIÓN PRINCIPAL: RENDERIZAR
    // ==========================================
    function renderSlides(text = textInput.value) { 
        previewContainer.innerHTML = '';
        
        if (!text) text = "";
        const paragraphs = text.split('\n\n'); 
        
        const contentToRender = (paragraphs.length === 1 && paragraphs[0] === "") 
                                ? ["Escribe tu texto aquí...| Arrastrame"] 
                                : paragraphs;

        contentToRender.forEach((paragraph, slideIndex) => {
            const slide = document.createElement('div');
            
           // 1. Clases y Tema
            const premiumClass = window.isPremium ? 'premium-mode' : '';
            slide.className = `carousel-slide ${currentTheme} ${premiumClass} format-${currentFormat}`;

            // 2. FONDO
            slide.style.removeProperty('background-image');
            slide.style.removeProperty('background-color');
            slide.style.background = ""; 

            if (customBgImage) {
                slide.style.setProperty('background-image', `url(${customBgImage})`, 'important');
                slide.style.setProperty('background-size', 'cover', 'important');
                slide.style.setProperty('background-position', 'center', 'important');
                slide.style.setProperty('background-repeat', 'no-repeat', 'important');
            } 
            else if (customBgColor) {
                slide.style.setProperty('background-color', customBgColor, 'important');
                slide.style.setProperty('background-image', 'none', 'important');
            }

            // 3. LOGO (Recuperar posición)
            if (!slidesState[slideIndex]) slidesState[slideIndex] = {};
            // Aseguramos que exista el objeto del logo
            if (!slidesState[slideIndex]['logo']) slidesState[slideIndex]['logo'] = {x:0, y:0};
            
            const logoPos = slidesState[slideIndex]['logo'];
            
            let logoRenderHTML = "";
            if (globalLogoUrl !== "") {
                logoRenderHTML = `
                    <div id="drag-logo-${slideIndex}" class="draggable" style="position: absolute; top: 20px; left: 20px; z-index: 60; transform: translate(${logoPos.x}px, ${logoPos.y}px);">
                        <img src="${globalLogoUrl}" class="slide-logo" alt="Logo" style="pointer-events: none; max-width: 80px;"> 
                    </div>
                `;
            }

            // 4. GENERAR CAJAS DE TEXTO (Aquí está la magia del | )
            const textParts = paragraph.split('|'); // Separamos por la barra vertical
            let allTextHTML = "";

            textParts.forEach((part, partIndex) => {
                const cleanText = part.trim(); // Quitar espacios sobrantes
                const partKey = `text-${partIndex}`; // Clave única: text-0, text-1...

                // Recuperar posición de ESTA parte específica
                if (!slidesState[slideIndex][partKey]) slidesState[slideIndex][partKey] = {x:0, y:0};
                const pos = slidesState[slideIndex][partKey];

                // Crear HTML de esta caja
                // Le damos un poco de margen top automático para que no salgan pegadas una encima de otra
                const initialTop = partIndex * 60; // Separación vertical inicial

                allTextHTML += `
                    <div id="drag-text-${slideIndex}-${partIndex}" class="draggable" 
                         style="
                            transform: translate(${pos.x}px, ${pos.y}px); 
                            width: 100%; 
                            display: flex; 
                            justify-content: center; 
                            position: absolute; 
                            top: calc(40% + ${initialTop}px); /* Centrado inicial escalonado */
                            left: 0;
                            padding: 10px;
                         ">
                        <p class="${currentFont} slide-text-content" style="font-size: ${currentFontSize}px; margin: 0; text-align: center;">
                            ${cleanText}
                        </p>
                    </div>
                `;
            });

            // 5. OVERLAY PREMIUM
            let previewOverlay = "";
            if (PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) {
                previewOverlay = `
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; border-radius: 8px; pointer-events: none;">
                        <span style="font-size: 60px;">🔒</span>
                        <span style="color: white; font-size: 24px; font-weight: bold;">PREMIUM</span>
                    </div>
                `;
            }
            
            // 6. INYECTAR HTML
            // Nota: Quitamos el flex center del padre para que el position absolute funcione libremente
            slide.innerHTML = `
                <div class="slide-content" style="position: relative; width: 100%; height: 100%; overflow: hidden;">
                    ${previewOverlay} 
                    ${logoRenderHTML}  
                    ${allTextHTML}      
                </div>

                <div class="slide-footer">
                    <span class="${currentFont}" style="font-size: 0.8rem">${globalAuthor}</span>
                    <span class="watermark ${currentFont}" style="font-size: 0.6rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">
                        ⚡ Creado con SwipeStudio
                    </span>
                    <span class="${currentFont}" style="font-size: 0.8rem">${slideIndex + 1}/${contentToRender.length}</span>
                </div>
            `;
            
            previewContainer.appendChild(slide);

            // 7. ACTIVAR ARRASTRE PARA TODO
            // Logo
            const logoElement = slide.querySelector(`#drag-logo-${slideIndex}`);
            if(logoElement) makeDraggable(logoElement, slideIndex, 'logo');

            // Textos (Bucle para activar cada parte)
            textParts.forEach((_, partIndex) => {
                const textEl = slide.querySelector(`#drag-text-${slideIndex}-${partIndex}`);
                if(textEl) makeDraggable(textEl, slideIndex, `text-${partIndex}`);
            });

        });
    }

    // ==========================================
    // 5. EVENT LISTENERS (INTERACCIÓN)
    // ==========================================

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

    if(fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            currentFont = e.target.value;
            renderSlides();
        });
    }

    // --- FONDOS PERSONALIZADOS ---
    if (bgColorInput) {
        bgColorInput.addEventListener('input', (e) => {
            customBgColor = e.target.value;
            customBgImage = ""; 
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
                    customBgColor = ""; 
                    if(bgColorInput) bgColorInput.value = ""; 
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

    // --- CAMBIO DE TEMA ---
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentTheme = btn.getAttribute('data-theme');
            
            // Reset de fondos personalizados para ver el tema nuevo
            customBgColor = "";
            customBgImage = "";
            if(bgColorInput) bgColorInput.value = "#ffffff";
            if(bgImageInput) bgImageInput.value = "";

            // Limpiamos posiciones guardadas al cambiar tema (opcional, pero recomendado)
            slidesState = []; 
            renderSlides();
        });
    });

    // --- SUBIDA DE LOGO ---
    if(logoInput) {
        logoInput.addEventListener('change', (e) => {
            if (!window.isPremium) {
                alert("🔒 La carga de Logos es una función exclusiva para usuarios PRO.");
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

    // --- MONETIZACIÓN ---
    if(removeWatermarkTrigger) {
        removeWatermarkTrigger.addEventListener('click', () => {
            promoCodeArea.style.display = (promoCodeArea.style.display === 'none') ? 'flex' : 'none';
        });
    }

    if(applyCodeBtn) {
        applyCodeBtn.addEventListener('click', () => {
            const codigoIngresado = promoInput.value.trim().toUpperCase();
            if (typeof CODIGOS_VALIDOS !== 'undefined' && CODIGOS_VALIDOS.includes(codigoIngresado)) {
                localStorage.setItem('userPromoCode', codigoIngresado);
                window.isPremium = true; 
                document.body.classList.add('premium-mode');
                renderSlides();
                promoCodeArea.style.display = 'none';
                if(premiumSuccessMsg) premiumSuccessMsg.style.display = 'block';
                alert("¡Bienvenido al plan PRO!");
            } else {
                alert("Código no válido.");
            }
        });
    }
    
    // ==========================================
    // 6. DESCARGAS (PDF Y ZIP)
    // ==========================================

    // --- DESCARGAR PDF ---
    if(downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            if (PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) {
                alert("⭐ Tema Premium. Introduce tu código PRO.");
                if(promoCodeArea) promoCodeArea.style.display = 'flex';
                return;
            }

            const btnOriginalText = downloadBtn.innerText;
            downloadBtn.innerText = "Calculando...";
            
            const formatoActual = formatSelect ? formatSelect.value : 'square';
            const targetW = FORMAT_DIMENSIONS[formatoActual].w;
            const targetH = FORMAT_DIMENSIONS[formatoActual].h;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ 
                orientation: targetW > targetH ? 'landscape' : 'portrait', 
                unit: 'px', 
                format: [targetW, targetH] 
            });

            const slides = document.querySelectorAll('.carousel-slide');

            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
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

    // --- DESCARGAR ZIP ---
    if (downloadZipBtn) {
        downloadZipBtn.addEventListener('click', async () => {
            if (PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) {
                alert("⭐ Tema Premium. Introduce tu código PRO.");
                if(promoCodeArea) promoCodeArea.style.display = 'flex';
                return;
            }

            const btnOriginalText = downloadZipBtn.innerText;
            downloadZipBtn.innerText = "Procesando...";
            
            const zip = new JSZip();
            const slides = document.querySelectorAll('.carousel-slide');
            
            const formatoActual = formatSelect ? formatSelect.value : 'square';
            const targetW = FORMAT_DIMENSIONS[formatoActual].w;

            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                downloadZipBtn.innerText = `Generando ${i + 1}/${slides.length}...`;
                
                const scaleFactor = targetW / slide.offsetWidth;
                const canvas = await html2canvas(slide, {
                    scale: scaleFactor,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null
                });

                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                zip.file(`slide-${i + 1}.png`, blob);
            }

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

    // ==========================================
    // 7. FUNCIÓN DRAG & DROP
    // ==========================================
    function makeDraggable(element, slideIndex, type) {
        let isDragging = false;
        let startX, startY;
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            element.style.cursor = 'grabbing';
            e.stopPropagation(); // Evitar conflictos
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (!slidesState[slideIndex]) slidesState[slideIndex] = {};
            if (!slidesState[slideIndex][type]) slidesState[slideIndex][type] = { x: 0, y: 0 };

            slidesState[slideIndex][type].x += deltaX;
            slidesState[slideIndex][type].y += deltaY;

            element.style.transform = `translate(${slidesState[slideIndex][type].x}px, ${slidesState[slideIndex][type].y}px)`;

            startX = e.clientX;
            startY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
            }
        });
    }

    // INICIALIZACIÓN
    renderSlides();

}); // FIN DEL DOMContentLoaded