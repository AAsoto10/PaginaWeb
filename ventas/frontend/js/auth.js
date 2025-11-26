// Redirigir si ya está autenticado
if (isAuthenticated()) {
    if (isAdmin()) {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'cliente.html';
    }
}

// Manejo del formulario de login
document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const usuario = await login(email, password);
        
        // Redirigir según el rol
        if (usuario.rol === 'ADMIN') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'cliente.html';
        }
    } catch (error) {
        mostrarAlerta('Email o contraseña incorrectos', 'danger');
    }
});

// Manejo del formulario de registro
document.getElementById('formRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nuevoUsuario = {
        nombre: document.getElementById('regNombre').value,
        apellido: document.getElementById('regApellido').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        telefono: document.getElementById('regTelefono').value,
        empresa: document.getElementById('regEmpresa').value,
        rol: 'CLIENTE'
    };
    
    try {
        await postData('/usuarios/registro', nuevoUsuario);
        mostrarAlerta('Registro exitoso. Por favor inicia sesión.', 'success');
        
        // Cambiar al tab de login
        document.querySelector('[href="#login"]').click();
        document.getElementById('formRegistro').reset();
    } catch (error) {
        mostrarAlerta('Error en el registro. El email podría estar en uso.', 'danger');
    }
});

// Función auxiliar para mostrar alertas
function mostrarAlerta(mensaje, tipo) {
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
