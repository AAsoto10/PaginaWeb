// Verificar autenticación y rol de cliente
if (!isAuthenticated() || !isCliente()) {
    window.location.href = 'index.html';
}

const usuario = getUsuarioActual();

// Mostrar información del usuario
document.getElementById('clienteName').textContent = usuario.nombre;
document.getElementById('userName').textContent = `${usuario.nombre} ${usuario.apellido}`;
document.getElementById('userEmail').textContent = usuario.email;
document.getElementById('userInitials').textContent = `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`;

// Llenar formulario de perfil
document.getElementById('perfilNombre').value = usuario.nombre;
document.getElementById('perfilApellido').value = usuario.apellido;
document.getElementById('perfilEmail').value = usuario.email;
document.getElementById('perfilTelefono').value = usuario.telefono || '';
document.getElementById('perfilEmpresa').value = usuario.empresa || '';

// Navegación entre secciones
document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.closest('[data-section]').dataset.section;
        mostrarSeccion(section);
    });
});

function mostrarSeccion(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
    // Remover clase active de todos los links
    document.querySelectorAll('.nav-pills .nav-link').forEach(l => l.classList.remove('active'));
    
    // Mostrar sección seleccionada
    document.getElementById(`${section}-section`).style.display = 'block';
    
    // Agregar clase active al link
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Cargar datos según la sección
    if (section === 'favoritos') {
        cargarFavoritos();
    }
}

// Cargar productos favoritos
async function cargarFavoritos() {
    try {
        // Obtener favoritos del localStorage
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        const listaFavoritos = document.getElementById('listaFavoritos');
        const sinFavoritos = document.getElementById('sinFavoritos');
        
        if (favoritos.length === 0) {
            listaFavoritos.innerHTML = '';
            sinFavoritos.style.display = 'block';
            return;
        }
        
        sinFavoritos.style.display = 'none';
        
        // Obtener todos los productos
        const productos = await fetchData('/productos');
        const productosFavoritos = productos.filter(p => favoritos.includes(p.id));
        
        listaFavoritos.innerHTML = '';
        productosFavoritos.forEach(producto => {
            listaFavoritos.innerHTML += `
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <h6 class="card-title">${producto.nombre}</h6>
                                    <p class="text-muted mb-2">${producto.categoria}</p>
                                    <p class="h5 text-primary">${formatearPrecio(producto.precio)}</p>
                                </div>
                                <button class="btn btn-sm btn-outline-danger" onclick="eliminarFavorito(${producto.id})">
                                    <i class="bi bi-heart-fill"></i>
                                </button>
                            </div>
                            <button class="btn btn-primary btn-sm mt-2 w-100">Cotizar</button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        mostrarAlerta('Error al cargar favoritos', 'danger');
    }
}

// Eliminar favorito
function eliminarFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos = favoritos.filter(fav => fav !== id);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    cargarFavoritos();
    mostrarAlerta('Producto eliminado de favoritos', 'info');
}

// Logout
document.getElementById('btnLogout').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});
