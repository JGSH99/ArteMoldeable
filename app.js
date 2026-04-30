// ==========================================
// ARCHIVO COMPLETO: app.js
// LÓGICA DEL MODAL (LIGHTBOX) Y MINI-GALERÍA
// ==========================================

// Primero, JS va y busca elementos en tu HTML y los guarda en variables ("cajas") para usarlos después.
// querySelectorAll atrapa TODAS las imágenes que están adentro de los articles.
const imagenes = document.querySelectorAll('.imagen1 article > img'); 

// getElementById atrapa a los elementos que creaste en el HTML para el Modal por su ID.
const modal = document.getElementById('modal-galeria');
const botonCerrar = document.querySelector('.cerrar-modal');
const imagenAmpliada = document.getElementById('imagen-ampliada');
const contenedorMiniaturas = document.getElementById('contenedor-miniaturas');
const modalTitulo = document.getElementById('modal-titulo');
const modalPrecio = document.getElementById('modal-precio'); 
const modalDescripcion = document.getElementById('modal-descripcion');
const modalBtnWhatsapp = document.getElementById('modal-btn-whatsapp');

// Tu número de contacto fijo para los pedidos
const miNumero = "593990283595";

// 1. ABRIR EL MODAL AL HACER CLIC EN UN PRODUCTO

// forEach() hace un bucle: Agarra cada imagen de la tienda una por una y le pega un evento
imagenes.forEach(imagen => {
    // addEventListener le dice: "Si el usuario te hace 'click', dispara esta función"
    imagen.addEventListener('click', (evento) => {
        // Enciende el Modal. Cambia el display de 'none' a 'flex', haciéndolo visible en pantalla.
        modal.style.display = 'flex';
        
        // El TRUCO MAESTRO: 'closest' sube por tu código HTML desde la foto clickeada hasta encontrar la etiqueta <article> que la envuelve. Así JS sabe exactamente qué producto tocaste.
        const articulo = evento.target.closest('article');
        
        // Ahora, busca solo dentro de ESE <article> el título (h2 o h3)
        const elementoTitulo = articulo.querySelector('h2, h3');
        // El símbolo '?' es un ternario: ¿Encontramos el título? Si sí, saca el texto interno. Si no, usa el texto por defecto "Detalle artístico". Es un salvavidas por si cometes errores en el HTML.
        const tituloExtraido = elementoTitulo ? elementoTitulo.innerText : "Detalle artístico";

        // Lo mismo para extraer el precio
        const elementoPrecio = articulo.querySelector('.precio');
        const precioExtraido = elementoPrecio ? elementoPrecio.innerText : "Consultar precio"; 

        // Extraemos la lista de pasos (<ol>) pero usando 'outerHTML' para copiar todas las etiquetas <li> intactas.
        const elementoPasos = articulo.querySelector('ol');
        const pasosExtraidos = elementoPasos ? elementoPasos.outerHTML : "<p>Detalles adicionales por interno.</p>";
        
        // Guarda la ruta (URL/src) de la imagen grandota que acabas de tocar
        const imagenPrincipalSrc = imagen.src;
        // Busca todas las fotitos secundarias que estaban ocultas (.galeria-oculta)
        const imagenesOcultas = articulo.querySelectorAll('.galeria-oculta img'); 
        
        // INYECCIÓN DE DATOS: JS cambia los textos e imágenes "vacías" del Modal, por los datos del producto exacto que clickeaste.
        imagenAmpliada.src = imagenPrincipalSrc;
        modalTitulo.innerText = tituloExtraido;
        modalPrecio.innerText = precioExtraido; 
        modalDescripcion.innerHTML = pasosExtraidos; 
        
        // Borra (limpia) cualquier miniatura de un producto anterior que hayas visto antes
        contenedorMiniaturas.innerHTML = ''; 
        
        // Llama a la función de abajo para crear la primera foto pequeñita y le pasa "true" para que aparezca marcada/seleccionada de inmediato.
        agregarMiniatura(imagenPrincipalSrc, true);
        
        // Bucle para añadir también como miniaturas todas las fotos extra que estaban en la carpeta oculta. A estas les pasamos "false".
        imagenesOcultas.forEach(imgOculta => {
            agregarMiniatura(imgOculta.src, false);
        });
        
        // CREACIÓN DE MENSAJE DINÁMICO DE WHATSAPP
        const mensaje = `¡Hola Arte Moldeable! Me interesa el detalle "${tituloExtraido}" que tiene un valor de ${precioExtraido}. ¿Me podrías ayudar a agendar mi pedido?`;
        
        // encodeURIComponent arregla tu texto (convierte los espacios en "%20") para que a la URL de WhatsApp no se le rompa el enlace.
        const urlWhatsApp = `https://wa.me/${miNumero}?text=${encodeURIComponent(mensaje)}`;
        
        // Le dice al botón verde: "Cuando te hagan clic, abre una nueva pestaña (_blank) y llévame a este enlace de WhatsApp".
        modalBtnWhatsapp.onclick = () => window.open(urlWhatsApp, '_blank');
    });
});

// 2. FUNCIÓN PARA CREAR LAS FOTITOS PEQUEÑAS DINÁMICAMENTE
// Esta función "fabrica" código HTML de imágenes desde cero y las inyecta en el Modal.
function agregarMiniatura(rutaimagen, esPrincipal = false) {
    // document.createElement('img') crea literalmente una etiqueta <img> en la memoria
    const miniatura = document.createElement('img');
    miniatura.src = rutaimagen; // Le asignamos su foto
    
    // Si la función recibió "true", le añadimos la clase de CSS "activa" (la del borde lila)
    if (esPrincipal) {
        miniatura.classList.add('activa');
    }
    
    // Le agregamos un evento de clic a esta nueva miniatura recién creada
    miniatura.addEventListener('click', () => {
        // Al tocarla, cambiamos la foto gigante central por la ruta de esta foto pequeñita
        imagenAmpliada.src = rutaimagen;
        
        // Limpieza visual: Le quita la clase "activa" (el borde) a TODAS las miniaturas
        document.querySelectorAll('.modal-miniaturas img').forEach(img => {
            img.classList.remove('activa');
        });
        // Y por último le pone la clase "activa" a ESTA miniatura específica que acabas de tocar
        miniatura.classList.add('activa');
    });
    
    // appendChild es lo que finalmente "escupe" y pega nuestra miniatura ya terminada en tu página HTML visible.
    contenedorMiniaturas.appendChild(miniatura);
}

// ==========================================
// 3. LÓGICA PARA CERRAR EL MODAL
// ==========================================

// Cuando el usuario hace clic en la "X" (botonCerrar), apaga el modal devolviéndolo a display 'none'
botonCerrar.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Truco de UX (Experiencia de usuario): Si el usuario hace clic en el área oscura de fondo (fuera de la cajita blanca), también se cierra el modal.
modal.addEventListener('click', (evento) => {
    // evento.target comprueba: "¿Exactamente qué tocaste? ¿Tocaste el fondo (modal) o tocaste el texto blanco adentro de él?". Si tocaste el fondo, se apaga.
    if (evento.target === modal) {
        modal.style.display = 'none';
    }
});