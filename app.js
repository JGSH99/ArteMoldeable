// ==========================================
// ARCHIVO COMPLETO: app.js
// LÓGICA DEL MODAL (LIGHTBOX) Y MINI-GALERÍA
// ==========================================

const imagenes = document.querySelectorAll('.imagen1 article > img'); 
const modal = document.getElementById('modal-galeria');
const botonCerrar = document.querySelector('.cerrar-modal');

const imagenAmpliada = document.getElementById('imagen-ampliada');
const contenedorMiniaturas = document.getElementById('contenedor-miniaturas');
const modalTitulo = document.getElementById('modal-titulo');
const modalPrecio = document.getElementById('modal-precio'); 
const modalDescripcion = document.getElementById('modal-descripcion');
const modalBtnWhatsapp = document.getElementById('modal-btn-whatsapp');

const miNumero = "593990283595";

// 1. ABRIR EL MODAL AL HACER CLIC EN UN PRODUCTO
imagenes.forEach(imagen => {
    imagen.addEventListener('click', (evento) => {
        modal.style.display = 'flex';
        
        const articulo = evento.target.closest('article');
        
        // CORRECCIÓN: Safeguards para evitar que el código se rompa si falta algún texto
        const elementoTitulo = articulo.querySelector('h2, h3');
        const tituloExtraido = elementoTitulo ? elementoTitulo.innerText : "Detalle artístico";

        const elementoPrecio = articulo.querySelector('.precio');
        const precioExtraido = elementoPrecio ? elementoPrecio.innerText : "Consultar precio"; 

        const elementoPasos = articulo.querySelector('ol');
        const pasosExtraidos = elementoPasos ? elementoPasos.outerHTML : "<p>Detalles adicionales por interno.</p>";
        
        const imagenPrincipalSrc = imagen.src;
        const imagenesOcultas = articulo.querySelectorAll('.galeria-oculta img'); 
        
        imagenAmpliada.src = imagenPrincipalSrc;
        modalTitulo.innerText = tituloExtraido;
        modalPrecio.innerText = precioExtraido; 
        modalDescripcion.innerHTML = pasosExtraidos; 
        
        contenedorMiniaturas.innerHTML = ''; 
        
        // CORRECCIÓN: Le pasamos "true" a la primera para que empiece marcada como activa
        agregarMiniatura(imagenPrincipalSrc, true);
        
        imagenesOcultas.forEach(imgOculta => {
            agregarMiniatura(imgOculta.src, false);
        });
        
        // CORRECCIÓN: Saludo personalizado con el nombre de tu marca
        const mensaje = `¡Hola Arte Moldeable! Me interesa el detalle "${tituloExtraido}" que tiene un valor de ${precioExtraido}. ¿Me podrías ayudar a agendar mi pedido?`;
        const urlWhatsApp = `https://wa.me/${miNumero}?text=${encodeURIComponent(mensaje)}`;
        
        modalBtnWhatsapp.onclick = () => window.open(urlWhatsApp, '_blank');
    });
});

// 2. FUNCIÓN PARA CREAR LAS FOTITOS PEQUEÑAS (ACTUALIZADA)
function agregarMiniatura(rutaimagen, esPrincipal = false) {
    const miniatura = document.createElement('img');
    miniatura.src = rutaimagen;
    
    // Si es la foto principal, le ponemos la clase "activa" desde el inicio
    if (esPrincipal) {
        miniatura.classList.add('activa');
    }
    
    miniatura.addEventListener('click', () => {
        imagenAmpliada.src = rutaimagen;
        
        // Lógica para quitarle el borde lila a todas y ponérselo solo a la que recibió el clic
        document.querySelectorAll('.modal-miniaturas img').forEach(img => {
            img.classList.remove('activa');
        });
        miniatura.classList.add('activa');
    });
    
    contenedorMiniaturas.appendChild(miniatura);
}

// ==========================================
// 3. LÓGICA PARA CERRAR EL MODAL
// ==========================================

botonCerrar.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (evento) => {
    if (evento.target === modal) {
        modal.style.display = 'none';
    }
});