/**
 * ==============================================
 * ⚡ SWIPESTUDIO - CAROUSEL GENERATOR ENGINE
 * ==============================================
 * @author     Jesús Santos
 * @role       Software Engineer & Vibe Coder
 * @year       2026
 * @version    1.0.0 (BETA)
 * @license    Copyright (c) 2026 Jesús Santos. All rights reserved.
 * * "Building ideas with logic and flow." 🌊
 * ==============================================
 */

// Firma Digital en Consola (Easter Egg para desarrolladores)
console.log(
    "%c ⚡ SwipeStudio %c Developed by Jesús Santos ",
    "background: #3b82f6; color: white; padding: 5px; border-radius: 3px 0 0 3px; font-weight: bold;",
    "background: #111; color: #fff; padding: 5px; border-radius: 0 3px 3px 0;"
);
console.log("%c 🌊 Vibe Coder Architecture", "color: #94a3b8; font-size: 11px; margin-top: 2px;");

// --- SCRIPT.JS ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. REFERENCIAS
    const textInput = document.getElementById('textInput');
    const authorInput = document.getElementById('authorInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadZipBtn = document.getElementById('downloadZipBtn');
    const previewContainer = document.getElementById('previewContainer');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const logoInput = document.getElementById('logoInput');
    const fontSelect = document.getElementById('fontSelect');
    const formatSelect = document.getElementById('formatSelect');
    const sizeInput = document.getElementById('sizeInput');
    const sizeValue = document.getElementById('sizeValue');
    const bgColorInput = document.getElementById('bgColorInput');
    const bgImageInput = document.getElementById('bgImageInput');
    const resetBgBtn = document.getElementById('resetBgBtn');
    
    // Modal
    const removeWatermarkTrigger = document.getElementById('removeWatermarkTrigger');
    const premiumSuccessMsg = document.getElementById('premiumSuccessMsg');
    const modal = document.getElementById('premiumModal');
    const closeModal = document.getElementById('closeModal');
    const modalInput = document.getElementById('modalPromoInput');
    const modalBtn = document.getElementById('modalApplyBtn');
    const modalMsg = document.getElementById('modalMsg');

    // 2. ESTADO
    let globalAuthor = "@miusuario";
    let currentTheme = "theme-classic";
    let globalLogoUrl = "";
    let currentFont = "font-inter";
    let slidesState = [];
    let currentFormat = "square";
    let currentFontSize = 24;
    let customBgColor = "";
    let customBgImage = "";

    const FORMAT_DIMENSIONS = {
        square: { w: 1080, h: 1080 },
        portrait: { w: 1080, h: 1350 },
        story: { w: 1080, h: 1920 },
        landscape: { w: 1920, h: 1080 }
    };

    // LISTA COMPLETA DE TEMAS DE PAGO
    const PREMIUM_THEMES = ['theme-cyberpunk', 'theme-luxury', 'theme-gold', 'theme-unicorn', 'theme-matrix'];

    // 3. PREMIUM CHECK
    const codigoGuardado = localStorage.getItem('userPromoCode');
    if (typeof CODIGOS_VALIDOS === 'undefined') window.CODIGOS_VALIDOS = ["SWIPE2024"];

    if (codigoGuardado && CODIGOS_VALIDOS.includes(codigoGuardado)) {
        window.isPremium = true;
    } else {
        window.isPremium = false;
    }

    if (window.isPremium) {
        document.body.classList.add('premium-mode');
        if (premiumSuccessMsg) premiumSuccessMsg.style.display = 'block';
        if (removeWatermarkTrigger) removeWatermarkTrigger.style.display = 'none';
    }

    // 4. RENDER
    function renderSlides(text = textInput.value) {
        previewContainer.innerHTML = '';
        if (!text) text = "";
        const paragraphs = text.split('\n\n');
        const contentToRender = (paragraphs.length === 1 && paragraphs[0] === "") ? ["Texto aquí..."] : paragraphs;

        contentToRender.forEach((paragraph, slideIndex) => {
            const slide = document.createElement('div');
            const premiumClass = window.isPremium ? 'premium-mode' : '';
            slide.className = `carousel-slide ${currentTheme} ${premiumClass} format-${currentFormat}`;

            // Fondo
            slide.style.background = "";
            if (customBgImage) {
                slide.style.setProperty('background-image', `url(${customBgImage})`, 'important');
                slide.style.setProperty('background-size', 'cover', 'important');
                slide.style.setProperty('background-position', 'center', 'important');
                slide.style.setProperty('background-repeat', 'no-repeat', 'important');
            } else if (customBgColor) {
                slide.style.setProperty('background-color', customBgColor, 'important');
                slide.style.setProperty('background-image', 'none', 'important');
            }

            // Logo
            if (!slidesState[slideIndex]) slidesState[slideIndex] = {};
            if (!slidesState[slideIndex]['logo']) slidesState[slideIndex]['logo'] = { x: 0, y: 0 };
            const logoPos = slidesState[slideIndex]['logo'];
            let logoHTML = globalLogoUrl ? `<div id="drag-logo-${slideIndex}" class="draggable" style="position: absolute; top: 20px; left: 20px; z-index: 60; transform: translate(${logoPos.x}px, ${logoPos.y}px);"><img src="${globalLogoUrl}" class="slide-logo" style="pointer-events: none; max-width: 80px;"></div>` : "";

            // Texto
            const textParts = paragraph.split('|');
            let textHTML = "";
            const startY = -((textParts.length - 1) * 60) / 2;
            textParts.forEach((part, idx) => {
                const pKey = `text-${idx}`;
                if (!slidesState[slideIndex][pKey]) slidesState[slideIndex][pKey] = { x: 0, y: 0 };
                const pos = slidesState[slideIndex][pKey];
                const offTop = startY + (idx * 60);
                textHTML += `<div id="drag-text-${slideIndex}-${idx}" class="draggable" style="transform: translate(${pos.x}px, ${pos.y}px); width: 100%; display: flex; justify-content: center; left: 0; position: absolute; top: 50%; margin-top: ${offTop}px; padding: 10px; min-height: 50px;"><p class="${currentFont} slide-text-content" style="font-size: ${currentFontSize}px; margin: 0; text-align: center; transform: translateY(-50%);">${part.trim()}</p></div>`;
            });

            // Overlay (desativado temporalmente)
            let overlay = "";
            if (PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) {
                overlay = `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; border-radius: 8px; pointer-events: none;"><span style="font-size: 60px;">🔒</span><span style="color: white; font-size: 24px; font-weight: bold;">PREMIUM</span></div>`;
            }

            slide.innerHTML = `<div class="slide-content" style="position: relative; width: 100%; height: 100%; overflow: hidden;">${overlay} ${logoHTML} ${textHTML}</div><div class="slide-footer"><span class="${currentFont}" style="font-size: 0.8rem">${globalAuthor}</span><span class="watermark ${currentFont}" style="font-size: 0.6rem; opacity: 0.6; letter-spacing: 1px;">⚡ Creado con SwipeStudio</span><span class="${currentFont}" style="font-size: 0.8rem">${slideIndex + 1}/${contentToRender.length}</span></div>`;
            previewContainer.appendChild(slide);

            const lEl = slide.querySelector(`#drag-logo-${slideIndex}`);
            if (lEl) makeDraggable(lEl, slideIndex, 'logo');
            textParts.forEach((_, idx) => {
                const tEl = slide.querySelector(`#drag-text-${slideIndex}-${idx}`);
                if (tEl) makeDraggable(tEl, slideIndex, `text-${idx}`);
            });
        });
    }

    // 5. EVENTOS
    function openModal() { if(!window.isPremium) modal.style.display = 'flex'; else alert("¡Ya eres PRO!"); }
    if(removeWatermarkTrigger) removeWatermarkTrigger.addEventListener('click', openModal);
    if(logoInput) logoInput.addEventListener('click', (e) => { if(!window.isPremium) { e.preventDefault(); openModal(); } });
    if(closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target == modal) modal.style.display = 'none'; });

    if(modalBtn) {
        modalBtn.addEventListener('click', () => {
            const c = modalInput.value.trim().toUpperCase();
            if (window.CODIGOS_VALIDOS && window.CODIGOS_VALIDOS.includes(c)) {
                localStorage.setItem('userPromoCode', c);
                window.isPremium = true; document.body.classList.add('premium-mode');
                modalMsg.style.display = 'block'; modalMsg.style.color = '#4ade80'; modalMsg.innerText = "¡Activado!";
                setTimeout(() => { modal.style.display = 'none'; renderSlides(); if(premiumSuccessMsg) premiumSuccessMsg.style.display = 'block'; if(removeWatermarkTrigger) removeWatermarkTrigger.style.display = 'none'; alert("🎉 ¡Bienvenido PRO!"); }, 1000);
            } else {
                modalMsg.style.display = 'block'; modalMsg.style.color = '#ef4444'; modalMsg.innerText = "Código inválido.";
            }
        });
    }

    if(textInput) textInput.addEventListener('input', (e) => renderSlides(e.target.value));
    if(authorInput) authorInput.addEventListener('input', (e) => { globalAuthor = e.target.value; renderSlides(); });
    if(sizeInput) sizeInput.addEventListener('input', (e) => { currentFontSize = e.target.value; sizeValue.innerText = e.target.value + "px"; renderSlides(); });
    if(fontSelect) fontSelect.addEventListener('change', (e) => { currentFont = e.target.value; renderSlides(); });
    if(formatSelect) formatSelect.addEventListener('change', (e) => { currentFormat = e.target.value; renderSlides(); });
    
    if(bgColorInput) bgColorInput.addEventListener('input', (e) => { customBgColor = e.target.value; customBgImage = ""; renderSlides(); });
    if(bgImageInput) bgImageInput.addEventListener('change', (e) => { const f = e.target.files[0]; if(f) { const r = new FileReader(); r.onload = (ev) => { customBgImage = ev.target.result; customBgColor = ""; renderSlides(); }; r.readAsDataURL(f); } });
    if(resetBgBtn) resetBgBtn.addEventListener('click', () => { customBgColor = ""; customBgImage = ""; renderSlides(); });

    themeBtns.forEach(btn => btn.addEventListener('click', () => { currentTheme = btn.getAttribute('data-theme'); slidesState = []; renderSlides(); }));
    
    if(logoInput) logoInput.addEventListener('change', (e) => { if(!window.isPremium) return; const f = e.target.files[0]; if(f) { const r = new FileReader(); r.onload = (ev) => { globalLogoUrl = ev.target.result; renderSlides(); }; r.readAsDataURL(f); } });

    // Descargas
    if(downloadBtn) downloadBtn.addEventListener('click', async () => {
        if(PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) { openModal(); return; }
        const t = downloadBtn.innerText; downloadBtn.innerText = "Generando...";
        const fmt = formatSelect.value; const {w, h} = FORMAT_DIMENSIONS[fmt];
        const {jsPDF} = window.jspdf; const doc = new jsPDF({orientation: w>h?'l':'p', unit:'px', format:[w,h]});
        const slides = document.querySelectorAll('.carousel-slide');
        for(let i=0; i<slides.length; i++) {
            const cvs = await html2canvas(slides[i], {scale: w/slides[i].offsetWidth, useCORS:true, allowTaint:true, backgroundColor:null});
            if(i>0) doc.addPage([w,h]); doc.addImage(cvs.toDataURL('image/png'), 'PNG', 0, 0, w, h);
        }
        doc.save('swipe.pdf'); downloadBtn.innerText = t;
    });

    if(downloadZipBtn) downloadZipBtn.addEventListener('click', async () => {
        if(PREMIUM_THEMES.includes(currentTheme) && !window.isPremium) { openModal(); return; }
        const t = downloadZipBtn.innerText; downloadZipBtn.innerText = "Procesando...";
        const zip = new JSZip(); const slides = document.querySelectorAll('.carousel-slide');
        const w = FORMAT_DIMENSIONS[formatSelect.value].w;
        for(let i=0; i<slides.length; i++) {
            const cvs = await html2canvas(slides[i], {scale: w/slides[i].offsetWidth, useCORS:true, allowTaint:true, backgroundColor:null});
            const blob = await new Promise(r => cvs.toBlob(r, 'image/png'));
            zip.file(`slide-${i+1}.png`, blob);
        }
        zip.generateAsync({type:"blob"}).then(c => { const l = document.createElement('a'); l.href = URL.createObjectURL(c); l.download = "pack.zip"; l.click(); downloadZipBtn.innerText = t; });
    });

    function makeDraggable(el, idx, type) {
        let dragging=false, sx, sy;
        el.addEventListener('mousedown', (e) => { dragging=true; sx=e.clientX; sy=e.clientY; el.style.cursor='grabbing'; e.stopPropagation(); });
        window.addEventListener('mousemove', (e) => {
            if(!dragging) return; e.preventDefault();
            const dx = e.clientX-sx, dy = e.clientY-sy;
            if(!slidesState[idx]) slidesState[idx]={}; if(!slidesState[idx][type]) slidesState[idx][type]={x:0,y:0};
            slidesState[idx][type].x+=dx; slidesState[idx][type].y+=dy;
            el.style.transform=`translate(${slidesState[idx][type].x}px, ${slidesState[idx][type].y}px)`;
            sx=e.clientX; sy=e.clientY;
        });
        window.addEventListener('mouseup', () => { dragging=false; el.style.cursor='grab'; });
    }

    renderSlides();
});