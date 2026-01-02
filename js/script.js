// --- CONFIGURACIÓN DEL DUEÑO ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias DOM
    const textInput = document.getElementById('textInput');
    const authorInput = document.getElementById('authorInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.getElementById('previewContainer');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const logoInput = document.getElementById('logoInput');
    const fontSelect = document.getElementById('fontSelect');

    // Referencias de Monetización
    const removeWatermarkTrigger = document.getElementById('removeWatermarkTrigger');
    const promoCodeArea = document.getElementById('promoCodeArea');
    const applyCodeBtn = document.getElementById('applyCodeBtn');
    const promoInput = document.getElementById('promoInput');
    const premiumSuccessMsg = document.getElementById('premiumSuccessMsg');

    // 2. Variables de estado
    let globalAuthor = "@miusuario";
    let currentTheme = "theme-classic"; 
    let globalLogoUrl = ""; 
    let currentFont = "font-inter";

    // 3. VERIFICACIÓN INTELIGENTE DE PREMIUM
   // 3. VERIFICACIÓN INTELIGENTE DE PREMIUM
    const codigoGuardado = localStorage.getItem('userPromoCode');
    
    // CAMBIO: Ahora verificamos si el código guardado existe dentro de tu lista de 100 códigos
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
    function renderSlides(text) {
        previewContainer.innerHTML = '';
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
            slide.className = `carousel-slide ${currentTheme} ${premiumClass}`;
            
            slide.innerHTML = `
                <div class="slide-content" style="flex-direction: column;">
                    ${logoHTML}
                    
                    <p class="${currentFont}" style="font-size: 24px; font-weight: bold; text-align: center; margin: 0;">
                        ${paragraph}
                    </p>
                </div>

                <div class="slide-footer" style="display: flex; justify-content: space-between; align-items: center;">
                    
                    <span class="${currentFont}" style="font-size: 0.8rem">${globalAuthor}</span>

                    <span class="watermark ${currentFont}" style="font-size: 0.6rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">
                        ⚡ Creado con AromaLab
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
    
    if(textInput) textInput.addEventListener('input', (e) => renderSlides(e.target.value));

    if(authorInput) {
        authorInput.addEventListener('input', (e) => {
            globalAuthor = e.target.value || "@miusuario";
            renderSlides(textInput ? textInput.value : ""); 
        });
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentTheme = btn.getAttribute('data-theme');
            renderSlides(textInput.value);
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
                    renderSlides(textInput.value);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if(fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            currentFont = e.target.value;
            renderSlides(textInput.value);
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

   // Validar el código (VERSIÓN LISTA DE CÓDIGOS)
    if(applyCodeBtn) {
        applyCodeBtn.addEventListener('click', () => {
            const codigoIngresado = promoInput.value.trim().toUpperCase();

            // CAMBIO AQUÍ: Verificamos si el código está en la lista de 100
            if (typeof CODIGOS_VALIDOS !== 'undefined' && CODIGOS_VALIDOS.includes(codigoIngresado)) {
                
                // 1. Guardamos el código
                localStorage.setItem('userPromoCode', codigoIngresado);
                
                // 2. Activamos
                window.isPremium = true; 
                document.body.classList.add('premium-mode');
                renderSlides(textInput.value);
                
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
    // DESCARGAR PDF
    // ---------------------------------------------------------
    if(downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            const btnOriginalText = downloadBtn.innerText;
            downloadBtn.innerText = "Procesando...";
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [500, 500] });
            const slides = document.querySelectorAll('.carousel-slide');

            for (let i = 0; i < slides.length; i++) {
                const canvas = await html2canvas(slides[i], {
                    scale: 2, 
                    useCORS: true,
                    allowTaint: true 
                });

                const imgData = canvas.toDataURL('image/png');
                if (i > 0) doc.addPage([500, 500]);
                doc.addImage(imgData, 'PNG', 0, 0, 500, 500);
            }

            doc.save('carrusel-aromalab.pdf');
            downloadBtn.innerText = btnOriginalText;
        });
    }

    renderSlides("");
});