# Sistema de Ventas - Maquinaria Industrial

Sistema completo de venta de maquinaria industrial con frontend y backend integrados.

## 🚀 Tecnologías

### Backend
- Node.js + Express
- SQLite3
- CORS

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Bootstrap Icons

## 📁 Estructura del Proyecto

```
ventas/
├── backend/
│   ├── config/
│   │   └── basededatos.js
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── controllers/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── app.js
    │   ├── auth.js
    │   ├── admin.js
    │   ├── cliente.js
    │   └── main.js
    ├── index.html
    ├── login.html
    ├── admin.html
    └── cliente.html
```

## 🔧 Instalación y Configuración

### 1. Backend

```bash
cd backend
npm install
npm start
```

El servidor estará disponible en: `http://localhost:8080`

### 2. Frontend

Abre `frontend/index.html` en tu navegador o usa un servidor local:

```bash
cd frontend
# Opción 1: Python
python -m http.server 3000

# Opción 2: Node.js (http-server)
npx http-server -p 3000

# Opción 3: Live Server (VS Code)
# Click derecho en index.html > "Open with Live Server"
```

El frontend estará disponible en: `http://localhost:3000`

## 👥 Usuarios del Sistema

### Roles

1. **ADMIN** - Administrador del sistema
   - Acceso al panel de administración
   - Gestión completa de productos, categorías y usuarios
   - Visualización de estadísticas

2. **CLIENTE** - Usuario cliente
   - Acceso al panel de cliente
   - Ver catálogo de productos
   - Solicitar cotizaciones
   - Gestionar favoritos

## 📋 Funcionalidades

### Panel de Administración (`admin.html`)
- ✅ Dashboard con estadísticas
- ✅ CRUD de Productos
- ✅ CRUD de Categorías
- ✅ Gestión de Usuarios
- ✅ Actualización de stock

### Panel de Cliente (`cliente.html`)
- ✅ Ver perfil personal
- ✅ Mis cotizaciones
- ✅ Productos favoritos

### Página Principal (`index.html`)
- ✅ Catálogo de productos conectado a la API
- ✅ Categorías dinámicas
- ✅ Formulario de contacto
- ✅ Sistema de autenticación

## 🔐 Autenticación

### Registro de Usuario
1. Ir a `login.html`
2. Seleccionar pestaña "Registro"
3. Completar formulario
4. El usuario se crea con rol "CLIENTE" por defecto

### Crear Usuario Admin
Para crear un administrador, debes:

1. Registrar un usuario normal
2. Acceder a la base de datos SQLite (`maquinaria.db`)
3. Ejecutar:
```sql
UPDATE usuarios SET rol = 'ADMIN' WHERE email = 'admin@example.com';
```

O usar un cliente SQL como DB Browser for SQLite.

## 📡 API Endpoints

### Productos
- `GET /api/productos` - Listar todos
- `GET /api/productos/disponibles` - Productos disponibles
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar
- `DELETE /api/productos/:id` - Eliminar

### Usuarios
- `POST /api/usuarios/registro` - Registrar
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios` - Listar todos

### Categorías
- `GET /api/categorias` - Listar todas
- `GET /api/categorias/activas` - Categorías activas
- `POST /api/categorias` - Crear categoría

## 🎯 Primeros Pasos

1. **Iniciar el backend**
   ```bash
   cd backend
   npm start
   ```

2. **Abrir el frontend**
   - Abrir `frontend/index.html` en el navegador
   - O usar un servidor local en el puerto 3000

3. **Crear un usuario**
   - Ir a "Iniciar Sesión"
   - Registrarse como nuevo usuario

4. **Crear productos y categorías** (como admin)
   - Cambiar el rol del usuario a ADMIN en la base de datos
   - Acceder al panel de administración
   - Agregar categorías y productos

## 🛠️ Configuración Adicional

### Puerto del Backend
Editar `backend/server.js`:
```javascript
const PORT = process.env.PORT || 8080;
```

### URL de la API en Frontend
Editar `frontend/js/app.js`:
```javascript
const API_URL = 'http://localhost:8080/api';
```

## 📝 Notas Importantes

- ⚠️ Las contraseñas se almacenan en texto plano. En producción, usa bcrypt.
- ⚠️ No hay JWT implementado. Para producción, implementa autenticación segura.
- ⚠️ CORS está habilitado para todos los orígenes. Restringe en producción.
- ✅ La base de datos SQLite se crea automáticamente al iniciar el servidor.

## 🐛 Solución de Problemas

### Error de CORS
Verifica que el backend esté ejecutándose en `http://localhost:8080`

### No se cargan los productos
1. Verifica que el backend esté funcionando
2. Abre la consola del navegador (F12)
3. Revisa los errores de red

### No puedo iniciar sesión
1. Verifica que el usuario esté registrado
2. Verifica las credenciales
3. Revisa la consola del backend para errores

## 📄 Licencia
Este proyecto es de uso educativo y demostrativo.
