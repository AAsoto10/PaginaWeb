// Verificar autenticación y rol de admin
if (!isAuthenticated() || !isAdmin()) {
    window.location.href = 'index.html';
}

// Mostrar nombre del admin
document.getElementById('adminName').textContent = getUsuarioActual().nombre + ' ' + getUsuarioActual().apellido;

// Variables globales
let productos = [];
let categorias = [];
let usuarios = [];

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
    document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
    
    // Mostrar sección seleccionada
    document.getElementById(`${section}-section`).style.display = 'block';
    
    // Agregar clase active al link
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Cargar datos según la sección
    switch(section) {
        case 'dashboard':
            cargarDashboard();
            break;
        case 'productos':
            cargarProductos();
            break;
        case 'categorias':
            cargarCategorias();
            break;
        case 'usuarios':
            cargarUsuarios();
            break;
    }
}

// Cargar Dashboard
async function cargarDashboard() {
    try {
        const [productosData, usuariosData, categoriasData] = await Promise.all([
            fetchData('/productos'),
            fetchData('/usuarios'),
            fetchData('/categorias')
        ]);
        
        document.getElementById('totalProductos').textContent = productosData.length;
        document.getElementById('totalUsuarios').textContent = usuariosData.length;
        document.getElementById('totalCategorias').textContent = categoriasData.length;
        
        const stockTotal = productosData.reduce((sum, p) => sum + p.stock, 0);
        document.getElementById('stockTotal').textContent = stockTotal;
    } catch (error) {
        mostrarAlerta('Error al cargar dashboard', 'danger');
    }
}

// Cargar Productos
async function cargarProductos() {
    try {
        productos = await fetchData('/productos');
        const tbody = document.getElementById('tablaProductos');
        tbody.innerHTML = '';
        
        productos.forEach(producto => {
            tbody.innerHTML += `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.categoria}</td>
                    <td>${formatearPrecio(producto.precio)}</td>
                    <td>${producto.stock}</td>
                    <td>
                        <span class="badge bg-${producto.disponible ? 'success' : 'danger'}">
                            ${producto.disponible ? 'Disponible' : 'No disponible'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarProducto(${producto.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        mostrarAlerta('Error al cargar productos', 'danger');
    }
}

// Cargar categorías en el select del formulario de productos
async function cargarCategoriasSelect() {
    try {
        const categoriasActivas = await fetchData('/categorias/activas');
        const select = document.getElementById('productoCategoria');
        
        // Mantener la primera opción
        select.innerHTML = '<option value="">Seleccione una categoría</option>';
        
        // Agregar todas las categorías activas
        categoriasActivas.forEach(categoria => {
            select.innerHTML += `<option value="${categoria.nombre}">${categoria.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// Guardar Producto
document.getElementById('btnGuardarProducto').addEventListener('click', async () => {
    const id = document.getElementById('productoId').value;
    const producto = {
        nombre: document.getElementById('productoNombre').value,
        categoria: document.getElementById('productoCategoria').value,
        precio: parseFloat(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        descripcion: document.getElementById('productoDescripcion').value,
        especificaciones: document.getElementById('productoEspecificaciones').value,
        url_imagen: document.getElementById('productoImagen').value,
        disponible: true
    };
    
    try {
        if (id) {
            await putData(`/productos/${id}`, producto);
            mostrarAlerta('Producto actualizado correctamente', 'success');
        } else {
            await postData('/productos', producto);
            mostrarAlerta('Producto creado correctamente', 'success');
        }
        
        bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
        document.getElementById('formProducto').reset();
        cargarProductos();
    } catch (error) {
        mostrarAlerta('Error al guardar producto', 'danger');
    }
});

// Editar Producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById('productoId').value = producto.id;
        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoCategoria').value = producto.categoria;
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoStock').value = producto.stock;
        document.getElementById('productoDescripcion').value = producto.descripcion;
        document.getElementById('productoEspecificaciones').value = producto.especificaciones || '';
        document.getElementById('productoImagen').value = producto.url_imagen || '';
        
        new bootstrap.Modal(document.getElementById('modalProducto')).show();
    }
}

// Eliminar Producto
async function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
            await deleteData(`/productos/${id}`);
            mostrarAlerta('Producto eliminado correctamente', 'success');
            cargarProductos();
        } catch (error) {
            mostrarAlerta('Error al eliminar producto', 'danger');
        }
    }
}

// Cargar Categorías
async function cargarCategorias() {
    try {
        categorias = await fetchData('/categorias');
        const tbody = document.getElementById('tablaCategorias');
        tbody.innerHTML = '';
        
        categorias.forEach(categoria => {
            tbody.innerHTML += `
                <tr>
                    <td>${categoria.id}</td>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion || '-'}</td>
                    <td>
                        <span class="badge bg-${categoria.activa ? 'success' : 'danger'}">
                            ${categoria.activa ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarCategoria(${categoria.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarCategoria(${categoria.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        mostrarAlerta('Error al cargar categorías', 'danger');
    }
}

// Guardar Categoría
document.getElementById('btnGuardarCategoria').addEventListener('click', async () => {
    const id = document.getElementById('categoriaId').value;
    const categoria = {
        nombre: document.getElementById('categoriaNombre').value,
        descripcion: document.getElementById('categoriaDescripcion').value,
        icono: document.getElementById('categoriaIcono').value,
        activa: true
    };
    
    try {
        if (id) {
            await putData(`/categorias/${id}`, categoria);
            mostrarAlerta('Categoría actualizada correctamente', 'success');
        } else {
            await postData('/categorias', categoria);
            mostrarAlerta('Categoría creada correctamente', 'success');
        }
        
        bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
        document.getElementById('formCategoria').reset();
        cargarCategorias();
    } catch (error) {
        mostrarAlerta('Error al guardar categoría', 'danger');
    }
});

// Editar Categoría
function editarCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    if (categoria) {
        document.getElementById('categoriaId').value = categoria.id;
        document.getElementById('categoriaNombre').value = categoria.nombre;
        document.getElementById('categoriaDescripcion').value = categoria.descripcion || '';
        
        const icono = categoria.icono || 'bi-tag';
        document.getElementById('categoriaIcono').value = icono;
        document.getElementById('selectedIconPreview').className = `bi ${icono}`;
        document.getElementById('selectedIconName').textContent = icono;
        
        new bootstrap.Modal(document.getElementById('modalCategoria')).show();
    }
}

// Eliminar Categoría
async function eliminarCategoria(id) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
        try {
            await deleteData(`/categorias/${id}`);
            mostrarAlerta('Categoría eliminada correctamente', 'success');
            cargarCategorias();
        } catch (error) {
            mostrarAlerta('Error al eliminar categoría', 'danger');
        }
    }
}

// Cargar Usuarios
async function cargarUsuarios() {
    try {
        usuarios = await fetchData('/usuarios');
        const tbody = document.getElementById('tablaUsuarios');
        tbody.innerHTML = '';
        
        usuarios.forEach(usuario => {
            tbody.innerHTML += `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre} ${usuario.apellido}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.empresa || '-'}</td>
                    <td><span class="badge bg-${usuario.rol === 'ADMIN' ? 'danger' : 'primary'}">${usuario.rol}</span></td>
                    <td>
                        <span class="badge bg-${usuario.activo ? 'success' : 'danger'}">
                            ${usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="verUsuario(${usuario.id})">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        mostrarAlerta('Error al cargar usuarios', 'danger');
    }
}

// Ver Usuario
function verUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        alert(`
Nombre: ${usuario.nombre} ${usuario.apellido}
Email: ${usuario.email}
Empresa: ${usuario.empresa || 'N/A'}
Teléfono: ${usuario.telefono || 'N/A'}
Rol: ${usuario.rol}
Estado: ${usuario.activo ? 'Activo' : 'Inactivo'}
        `);
    }
}

// Logout
document.getElementById('btnLogout').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

// Iconos disponibles para categorías
const iconosDisponibles = [
    'bi-truck', 'bi-arrow-up-circle', 'bi-circle-fill', 'bi-tools', 
    'bi-box-seam', 'bi-box-arrow-up', 'bi-gear', 'bi-wrench',
    'bi-hammer', 'bi-cone-striped', 'bi-building', 'bi-bricks',
    'bi-cart', 'bi-speedometer2', 'bi-clipboard-check', 'bi-tag',
    'bi-tags', 'bi-flag', 'bi-star', 'bi-lightning',
    'bi-shield-check', 'bi-cpu', 'bi-diagram-3', 'bi-hdd-rack'
];

// Inicializar selector de iconos
function inicializarSelectorIconos() {
    const iconGrid = document.getElementById('iconGrid');
    const categoriaIcono = document.getElementById('categoriaIcono');
    const selectedIconPreview = document.getElementById('selectedIconPreview');
    const selectedIconName = document.getElementById('selectedIconName');
    const selectedIconDisplay = document.getElementById('selectedIconDisplay');
    
    // Limpiar grid
    iconGrid.innerHTML = '';
    
    // Crear botones de iconos
    iconosDisponibles.forEach(icono => {
        const iconBtn = document.createElement('button');
        iconBtn.type = 'button';
        iconBtn.className = 'icon-option';
        iconBtn.innerHTML = `<i class="bi ${icono}"></i>`;
        iconBtn.title = icono;
        
        // Marcar el icono actual como seleccionado
        if (categoriaIcono.value === icono) {
            iconBtn.classList.add('selected');
        }
        
        iconBtn.addEventListener('click', () => {
            // Remover selección previa
            iconGrid.querySelectorAll('.icon-option').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Marcar como seleccionado
            iconBtn.classList.add('selected');
            
            // Actualizar input hidden y preview
            categoriaIcono.value = icono;
            selectedIconPreview.className = `bi ${icono}`;
            selectedIconName.textContent = icono;
        });
        
        iconGrid.appendChild(iconBtn);
    });
    
    // Toggle del grid al hacer click en el display
    selectedIconDisplay.addEventListener('click', () => {
        iconGrid.classList.toggle('show');
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.icon-selector')) {
            iconGrid.classList.remove('show');
        }
    });
}

// Evento al abrir el modal de producto
document.getElementById('modalProducto').addEventListener('show.bs.modal', function () {
    // Cargar categorías cada vez que se abre el modal
    cargarCategoriasSelect();
});

// Evento al cerrar el modal de producto (limpiar formulario)
document.getElementById('modalProducto').addEventListener('hidden.bs.modal', function () {
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';
});

// Evento al abrir el modal de categoría
document.getElementById('modalCategoria').addEventListener('show.bs.modal', function () {
    inicializarSelectorIconos();
});

// Evento al cerrar el modal de categoría (resetear icono)
document.getElementById('modalCategoria').addEventListener('hidden.bs.modal', function () {
    document.getElementById('formCategoria').reset();
    document.getElementById('categoriaId').value = '';
    document.getElementById('categoriaIcono').value = 'bi-tag';
    document.getElementById('selectedIconPreview').className = 'bi bi-tag';
    document.getElementById('selectedIconName').textContent = 'bi-tag';
    document.getElementById('iconGrid').classList.remove('show');
});

// Cargar dashboard al inicio
cargarDashboard();
