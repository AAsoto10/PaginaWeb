// Configuración de la API
const API_URL = 'http://localhost:8080/api';

// Almacenamiento del usuario actual
let usuarioActual = JSON.parse(localStorage.getItem('usuario')) || null;

// Función para hacer peticiones GET
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para hacer peticiones POST
async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para hacer peticiones PUT
async function putData(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para hacer peticiones DELETE
async function deleteData(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error en la petición');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para login
async function login(email, password) {
    try {
        const usuario = await postData('/usuarios/login', { email, password });
        localStorage.setItem('usuario', JSON.stringify(usuario));
        usuarioActual = usuario;
        return usuario;
    } catch (error) {
        throw error;
    }
}

// Función para logout
function logout() {
    localStorage.removeItem('usuario');
    usuarioActual = null;
    window.location.href = 'index.html';
}

// Función para verificar si está autenticado
function isAuthenticated() {
    return usuarioActual !== null;
}

// Función para verificar si es admin
function isAdmin() {
    return usuarioActual && usuarioActual.rol === 'ADMIN';
}

// Función para verificar si es cliente
function isCliente() {
    return usuarioActual && usuarioActual.rol === 'CLIENTE';
}

// Función para obtener usuario actual
function getUsuarioActual() {
    return usuarioActual;
}

// Función para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD'
    }).format(precio);
}

// Función para formatear fecha
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para mostrar alerta
function mostrarAlerta(mensaje, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Función para actualizar el botón de login en el navbar
function actualizarBotonLogin() {
    const btnLogin = document.querySelector('.navbar .btn-primary');
    
    if (!btnLogin) return; // Si no existe el botón, salir
    
    if (isAuthenticated()) {
        const usuario = getUsuarioActual();
        btnLogin.innerHTML = `<i class="bi bi-person-circle"></i> ${usuario.nombre}`;
        
        if (isAdmin()) {
            btnLogin.href = 'admin.html';
        } else {
            btnLogin.href = 'cliente.html';
        }
    } else {
        btnLogin.innerHTML = `<i class="bi bi-person-circle"></i> Iniciar Sesión`;
        btnLogin.href = 'login.html';
    }
}

// Ejecutar al cargar el DOM en todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    actualizarBotonLogin();
});
