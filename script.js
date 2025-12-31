document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias DOM
    const textInput = document.getElementById('textInput');
    const authorInput = document.getElementById('authorInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.getElementById('previewContainer');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const logoInput = document.getElementById('logoInput');
    
    // NUEVO: Referencia al selector de fuentes
    const fontSelect = document.getElementById('fontSelect');

    // Variables de estado
    let globalAuthor = "@miusuario";
    let currentTheme = "theme-classic"; 
    let globalLogoUrl = ""; 
    
    // NUEVO: Variable para la fuente (valor por defecto: Inter)
    let currentFont = "font-inter";

    // ---------------------------------------------------------
    // FUNCIÓN 1: Renderizar las diapositivas
    // ---------------------------------------------------------
    function renderSlides(text) {
        previewContainer.innerHTML = '';
        const paragraphs = text.split('\n\n'); 

        // Lógica del logo
        let logoHTML = "";
        if (globalLogoUrl !== "") {
            logoHTML = `<img src="${globalLogoUrl}" class="slide-logo" alt="Logo">`;
        }
        
        paragraphs.forEach((paragraph, index) => {
            const slide = document.createElement('div');
            // Aplicamos tema
            slide.className = `carousel-slide ${currentTheme}`;
            
            slide.innerHTML = `
                <div class="slide-content" style="flex-direction: column;">
                    ${logoHTML}
                    
                    <p class="${currentFont}" style="font-size: 24px; font-weight: bold; text-align: center; margin: 0;">
                        ${paragraph || "Escribe algo..."}
                    </p>
                </div>
                <div class="slide-footer">
                    <span class="${currentFont}">${globalAuthor}</span>
                    <span class="watermark ${currentFont}">${index + 1}/${paragraphs.length}</span>
                </div>
            `;
            previewContainer.appendChild(slide);
        });
    }

    // ---------------------------------------------------------
    // EVENTOS
    // ---------------------------------------------------------
    
    textInput.addEventListener('input', (e) => renderSlides(e.target.value));
    
    authorInput.addEventListener('input', (e) => {
        globalAuthor = e.target.value || "@miusuario";
        renderSlides(textInput.value); 
    });

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentTheme = btn.getAttribute('data-theme');
            renderSlides(textInput.value);
        });
    });

    logoInput.addEventListener('change', (e) => {
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

    // NUEVO: Evento para el cambio de fuente
    fontSelect.addEventListener('change', (e) => {
        // Actualizamos la variable con el valor del select (ej: "font-playfair")
        currentFont = e.target.value;
        // Re-renderizamos para ver el cambio
        renderSlides(textInput.value);
    });

    // ---------------------------------------------------------
    // FUNCIÓN 2: Descargar PDF
    // ---------------------------------------------------------
    downloadBtn.addEventListener('click', async () => {
        const btnOriginalText = downloadBtn.innerText;
        downloadBtn.innerText = "Procesando...";
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [500, 500] });
        const slides = document.querySelectorAll('.carousel-slide');

        for (let i = 0; i < slides.length; i++) {
            // Nota: html2canvas a veces tarda en cargar fuentes externas. 
            // Esperar un poco o asegurar carga es ideal, pero para MVP funciona.
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

    // Inicialización
    renderSlides("");
});