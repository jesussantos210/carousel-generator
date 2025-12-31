# 🚀 Generador de Carruseles para Redes Sociales (SaaS MVP)

![Status](https://img.shields.io/badge/Status-Funcional-brightgreen)
![Tech](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

Una herramienta web diseñada para creadores de contenido que permite transformar texto plano en **Carruseles de LinkedIn o Instagram** profesionales en segundos. 

Este proyecto fue construido como un MVP (Producto Mínimo Viable) utilizando **Vanilla JavaScript**, enfocándose en la manipulación del DOM y la generación de archivos PDF desde el navegador (Client-Side).

## 📸 Demo / Vista Previa

![Captura de Pantalla](./imagen/carousel-generator.jpeg) 

🔗 **Pruébalo en vivo aquí:** [carouselgenerator](carouselgenerator.netlify.app)

## ✨ Funcionalidades Principales

* **⚡ Edición en Tiempo Real:** Escribe texto y visualiza los cambios instantáneamente.
* **✂️ Paginación Automática:** Detecta dobles espacios (`Enter` x2) para separar el texto en nuevas diapositivas automáticamente.
* **🎨 Temas Personalizables:** Cambio dinámico de estilos CSS (Classic, Dark Mode, Sunset, Elegant).
* **🔤 Selector de Tipografía:** Integración con Google Fonts (Inter, Playfair, Roboto Mono, Montserrat).
* **🖼️ Carga de Logo:** Permite a los usuarios subir su propio logo (PNG/JPG) para branding mediante `FileReader API`.
* **📥 Exportación PDF:** Generación de documentos multipágina listos para LinkedIn usando `html2canvas` y `jsPDF`.
* **📱 Diseño Responsivo:** Panel de vista previa con scroll horizontal para manejar múltiples diapositivas.

## 🛠️ Stack Tecnológico

* **HTML5:** Estructura semántica.
* **CSS3:** Flexbox para layout, variables CSS para temas y diseño responsivo.
* **JavaScript (Vanilla):** Lógica de estado, manipulación del DOM y eventos.
* **Librerías Externas (vía CDN):**
    * `html2canvas`: Para renderizar el DOM como imagen.
    * `jspdf`: Para compilar las imágenes en un documento PDF descargable.

## 🚀 Cómo ejecutarlo localmente

Este proyecto no requiere instalación de dependencias (`npm`) ni servidores complejos.

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/TU-USUARIO/carousel-generator.git](https://github.com/TU-USUARIO/carousel-generator.git)
    ```

2.  **Navega a la carpeta:**
    ```bash
    cd carousel-generator
    ```

3.  **Abre el proyecto:**
    * Simplemente haz doble clic en el archivo `index.html`.
    * O usa la extensión "Live Server" de VS Code para una mejor experiencia.

## 📂 Estructura del Proyecto

```text
/
├── index.html      # Estructura y maquetación
├── style.css       # Estilos, temas y diseño responsive
├── script.js       # Lógica: renderizado, eventos y exportación
└── README.md       # Documentación
```

## 🔮 Próximas Mejoras (Roadmap)
* [ ] Integración con la API de OpenAI para generar contenido automático.

* [ ] Arrastrar y soltar (Drag & Drop) para reordenar diapositivas.

* [ ] Pasarela de pago (Stripe) para características premium (quitar marca de agua).

* [ ] Guardar preferencias del usuario en LocalStorage.

## 🤝 Contribuciones
Las contribuciones son bienvenidas. Si tienes una idea para mejorar este generador, siéntete libre de abrir un `issue` o enviar un `pull request`.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - eres libre de usarlo y modificarlo.