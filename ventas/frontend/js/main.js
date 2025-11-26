// Cargar productos desde la API y mostrarlos en la página principal
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar productos destacados
    await cargarProductosDestacados();
    
    // Cargar categorías
    await cargarCategoriasInicio();
});

// Cargar productos destacados
async function cargarProductosDestacados() {
    try {
        const productos = await fetchData('/productos/disponibles');
        const productosGrid = document.querySelector('#productos .row');
        
        if (productosGrid) {
            productosGrid.innerHTML = '';
            
            // Mostrar solo los primeros 6 productos
            productos.slice(0, 6).forEach(producto => {
                productosGrid.innerHTML += `
                    <div class="col-md-4">
                        <div class="card product-card h-100">
                            <img src="${producto.url_imagen || 'https://via.placeholder.com/400x300/007bff/ffffff?text=' + encodeURIComponent(producto.nombre)}" 
                                 class="card-img-top" alt="${producto.nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombre}</h5>
                                <p class="text-muted">${producto.categoria}</p>
                                <p class="card-text">${producto.descripcion.substring(0, 100)}...</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h5 mb-0 text-primary">${formatearPrecio(producto.precio)}</span>
                                    <button class="btn btn-primary" onclick="cotizarProducto(${producto.id})">Cotizar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Cargar categorías
async function cargarCategoriasInicio() {
    try {
        const categorias = await fetchData('/categorias/activas');
        const categoriasGrid = document.querySelector('#categoriasContainer');
        
        if (categoriasGrid && categorias.length > 0) {
            categoriasGrid.innerHTML = '';
            
            categorias.forEach(categoria => {
                categoriasGrid.innerHTML += `
                    <div class="col-md-4">
                        <div class="card category-card h-100 text-center">
                            <div class="card-body">
                                <i class="bi ${categoria.icono || 'bi-box-seam'} category-icon"></i>
                                <h5 class="card-title mt-3">${categoria.nombre}</h5>
                                <p class="card-text">${categoria.descripcion || 'Productos de calidad'}</p>
                                <a href="categoria.html?categoria=${encodeURIComponent(categoria.nombre)}" class="btn btn-outline-primary">Ver más</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// Función para cotizar producto
function cotizarProducto(id) {
    if (!isAuthenticated()) {
        mostrarAlerta('Debes iniciar sesión para cotizar productos', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    mostrarAlerta('Solicitud de cotización enviada. Nos pondremos en contacto contigo pronto.', 'success');
}

// Manejo del formulario de contacto
const formContacto = document.querySelector('#contacto form');
if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const empresa = document.getElementById('empresa').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Aquí podrías enviar el mensaje a tu backend
        console.log('Mensaje de contacto:', { nombre, email, empresa, mensaje });
        
        mostrarAlerta('Mensaje enviado correctamente. Te responderemos pronto.', 'success');
        formContacto.reset();
    });
}
