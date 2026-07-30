# Lab: Express Social API

Una API REST para una red social minimalista construida con **Express 5**, **Mongoose 9** y autenticación por sesión con cookie. Los usuarios pueden registrarse, iniciar sesión, publicar posts de texto, comentar las publicaciones de otros y consultar su perfil.

---

## Objetivos de aprendizaje

Al completar este lab, serás capaz de:

- Diseñar y conectar tres modelos de Mongoose con relaciones entre colecciones (`ref`, `populate`, `virtual`).
- Implementar autenticación stateful con `express-session` y `connect-mongo` (sesión persistida en MongoDB).
- Escribir controladores asíncronos con manejo de errores centralizado a través de `next(error)`.
- Aplicar un middleware de autenticación reutilizable que protege rutas de forma selectiva.
- Estructurar una API REST siguiendo las convenciones del proyecto: `*.controller.js`, `*.mid.js`, `*.model.js`.
- Ejecutar tests de integración con **Jest** y **Supertest** sobre una base de datos en memoria.

---

## Prerequisitos

- Node.js >= 20
- MongoDB corriendo en local (`mongodb://127.0.0.1:27017`) **o** una cadena de conexión a MongoDB Atlas
- Postman (opcional, para probar los endpoints manualmente)

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd lab-express-social-api/api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Copia el fichero de plantilla y rellena los valores:

```bash
cp .env.template .env
```

Abre `.env` y ajusta cada variable:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto en el que escucha el servidor | `3000` |
| `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb://127.0.0.1:27017/social-api` |
| `SESSION_SECRET` | Clave para firmar la cookie de sesión | `super secret` |
| `SESSION_SECURE` | `true` solo en producción con HTTPS | `false` |
| `CORS_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |

> **Importante**: nunca subas `.env` al repositorio. El fichero `.gitignore` ya lo excluye.

### 4. Arrancar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor usa `node --watch` (sin nodemon). Al arrancar verás en la consola:

```
{"level":30,"msg":"Connected to MongoDB"}
{"level":30,"msg":"Server listening at port 3000"}
```

---

## Estructura del proyecto

```
api/
├── src/
│   ├── server.js                      # Punto de entrada: arranca el servidor HTTP
│   ├── app.js                         # Crea la app Express y registra middlewares
│   ├── controllers/
│   │   ├── index.js                   # Router principal: declara todas las rutas
│   │   ├── users.controller.js        # Registro, login, logout, perfil
│   │   ├── posts.controller.js        # CRUD de posts
│   │   └── comments.controller.js     # Crear y eliminar comentarios
│   ├── middlewares/
│   │   ├── index.js                   # Exporta { errors }
│   │   ├── auth.mid.js                # Middleware de autenticación por sesión
│   │   └── errors.mid.js             # 404 catch-all y manejador global de errores
│   └── lib/
│       ├── config.js                  # Configuración centralizada con convict
│       ├── db.js                      # Conexión a MongoDB con Mongoose
│       ├── logger.js                  # Instancia de pino
│       ├── session.js                 # Configuración de express-session + MongoStore
│       ├── cors.js                    # Configuración de CORS
│       └── models/
│           ├── user.model.js          # Esquema User con bcrypt y virtual posts
│           ├── post.model.js          # Esquema Post con virtual comments
│           └── comment.model.js       # Esquema Comment
├── tests/
│   ├── users.test.js                  # Tests de registro, login, logout y perfil
│   ├── posts.test.js                  # Tests de CRUD de posts
│   └── comments.test.js              # Tests de comentarios
├── docs/
│   └── api.postman_collection.json    # Colección Postman lista para importar
├── seeds.js                           # Script para poblar la base de datos con datos falsos
├── .env.template                      # Plantilla de variables de entorno
└── package.json
```

### Cadena de middlewares en `app.js`

El orden es obligatorio:

```
pino-http  →  cors  →  express.json  →  session  →  rutas  →  404  →  globalHandler
```

---

## Modelos de datos

### User

| Campo | Tipo | Validaciones |
|---|---|---|
| `name` | String | required |
| `username` | String | required, unique, trim |
| `email` | String | required, trim, lowercase, formato email |
| `password` | String | required, mínimo 8 caracteres — hasheado con bcrypt (salt 10) |
| `posts` | Virtual | reverse-populate desde `Post.author` |

El modelo incluye un hook `pre('save')` que hashea la contraseña automáticamente cuando el campo se modifica, y un método de instancia `checkPassword(plain)` que compara con `bcrypt.compare`.

### Post

| Campo | Tipo | Validaciones |
|---|---|---|
| `title` | String | required, minLength: 3, maxLength: 200 |
| `body` | String | required, minLength: 1, maxLength: 1000 |
| `author` | ObjectId | ref: `User`, required |
| `comments` | Virtual | reverse-populate desde `Comment.post` |

### Comment

| Campo | Tipo | Validaciones |
|---|---|---|
| `body` | String | required, minLength: 1, maxLength: 500 |
| `author` | ObjectId | ref: `User`, required |
| `post` | ObjectId | ref: `Post`, required |

Todos los modelos tienen `timestamps: true` y una transformación `toJSON` que expone `id` (string) y elimina `_id`, `__v` y `password`.

---

## Endpoints de la API

Todos los endpoints tienen el prefijo `/api/v0`. Los marcados con `[AUTH]` requieren una sesión activa (cookie `connect.sid`).

### Autenticación y usuarios

| Método | Ruta | Auth | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/v0/users` | No | `{ name, username, email, password }` | `201` — objeto User |
| `POST` | `/api/v0/sessions` | No | `{ email, password }` | `200` — objeto User |
| `DELETE` | `/api/v0/sessions` | `[AUTH]` | — | `204` |
| `GET` | `/api/v0/users/me` | `[AUTH]` | — | `200` — objeto User con `posts[]` populado |

### Posts

| Método | Ruta | Auth | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/api/v0/posts` | `[AUTH]` | — | `200` — array de Posts con `author` populado |
| `POST` | `/api/v0/posts` | `[AUTH]` | `{ title, body }` | `201` — objeto Post con `author` populado |
| `GET` | `/api/v0/posts/:id` | `[AUTH]` | — | `200` — Post con `author` y `comments[].author` populados |
| `PATCH` | `/api/v0/posts/:id` | `[AUTH]` | `{ title?, body? }` | `200` — Post actualizado con `author` |
| `DELETE` | `/api/v0/posts/:id` | `[AUTH]` | — | `204` |

### Comentarios

| Método | Ruta | Auth | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/v0/posts/:id/comments` | `[AUTH]` | `{ body }` | `201` — objeto Comment |
| `DELETE` | `/api/v0/posts/:id/comments/:commentId` | `[AUTH]` | — | `204` |

### Respuestas de error

| Código | Situación |
|---|---|
| `400` | Error de validación de Mongoose (`{ message, errors: { campo: "mensaje" } }`) |
| `401` | Sin sesión activa o credenciales incorrectas |
| `404` | Recurso no encontrado (ruta inexistente o ID inválido/inexistente) |
| `409` | `username` ya registrado |
| `500` | Error inesperado del servidor |

---

## Descripción de la implementación (rama `solution`)

Esta es la rama de solución. A continuación se describe qué hace cada parte.

### Middleware de autenticación (`auth.mid.js`)

Comprueba `req.session.userId`. Si no existe, responde `401 "session not found"`. Si existe pero el usuario no está en la base de datos, responde `401 "session user not found"`. En caso contrario, carga el documento User y lo adjunta a `req.user` para que los controladores lo usen directamente.

### Controlador de usuarios (`users.controller.js`)

- **`create`**: verifica que el `username` no esté duplicado (409), luego crea el usuario con `User.create(req.body)`. El hook `pre('save')` hashea la contraseña antes de persistirla.
- **`login`**: busca el usuario por `email`, comprueba la contraseña con `checkPassword()`, guarda `user._id` en `req.session.userId` y devuelve el documento User.
- **`logout`**: destruye la sesión con `req.session.destroy()` y responde `204`.
- **`profile`**: consulta el usuario autenticado y popula el virtual `posts`.

### Controlador de posts (`posts.controller.js`)

- **`list`**: devuelve todos los posts con `author` populado.
- **`create`**: inyecta `author: req.user._id` (el id viene del middleware, no del body) y popula `author` antes de responder.
- **`detail`**: popula `author` y el virtual `comments` con su propio `author` anidado (populate anidado).
- **`update`**: usa `findByIdAndUpdate` con `runValidators: true` para ejecutar las validaciones del esquema en la actualización parcial.
- **`remove`**: elimina el post y responde `204`.

### Controlador de comentarios (`comments.controller.js`)

- **`create`**: extrae `post` de `req.params.id` y `author` de `req.user._id`. El cliente solo envía `body`.
- **`remove`**: usa `req.params.commentId` para eliminar el comentario.

### Manejador global de errores (`errors.mid.js`)

Distingue tres casos antes del manejador genérico:

1. `mongoose.Error.ValidationError` → `400` con el mapa `{ campo: "mensaje" }`.
2. `mongoose.Error.CastError` en `_id` → `404 "Resource not found"` (ID con formato inválido).
3. Cualquier otro error → usa `error.status` si existe, o `500`.

---

## Poblar la base de datos (seeds)

El script `seeds.js` usa `@faker-js/faker` para generar 10 usuarios, 30 posts (3 por usuario) y 90 comentarios (3 por post) con datos realistas. Borra la base de datos antes de insertar.

```bash
npm run seeds
```

Todos los usuarios generados tienen la contraseña `Password1!`.

---

## Probar la API

### Con la colección Postman

1. Abre Postman.
2. Haz clic en **Import** y selecciona `api/docs/api.postman_collection.json`.
3. La colección contiene todas las peticiones organizadas por recurso con ejemplos de body.
4. Empieza por **POST /users** para registrarte y luego **POST /sessions** para obtener la cookie de sesión. Postman la guarda automáticamente para las siguientes peticiones.

### Con curl

**Registrar un usuario:**

```bash
curl -s -X POST http://localhost:3000/api/v0/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","username":"ada","email":"ada@example.com","password":"password123"}' \
  | jq
```

**Iniciar sesión (guarda la cookie en `cookies.txt`):**

```bash
curl -s -c cookies.txt -X POST http://localhost:3000/api/v0/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"password123"}' \
  | jq
```

**Ver el feed de posts:**

```bash
curl -s -b cookies.txt http://localhost:3000/api/v0/posts | jq
```

**Crear un post:**

```bash
curl -s -b cookies.txt -X POST http://localhost:3000/api/v0/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi primer post","body":"Hola desde la Social API!"}' \
  | jq
```

**Ver el detalle de un post (sustituye `<id>` por un ID real):**

```bash
curl -s -b cookies.txt http://localhost:3000/api/v0/posts/<id> | jq
```

**Añadir un comentario:**

```bash
curl -s -b cookies.txt -X POST http://localhost:3000/api/v0/posts/<id>/comments \
  -H "Content-Type: application/json" \
  -d '{"body":"Gran post!"}' \
  | jq
```

**Ver el perfil propio:**

```bash
curl -s -b cookies.txt http://localhost:3000/api/v0/users/me | jq
```

**Cerrar sesión:**

```bash
curl -s -b cookies.txt -c cookies.txt -X DELETE http://localhost:3000/api/v0/sessions
```

---

## Tests automatizados

El proyecto usa **Jest** con **Supertest** y **mongodb-memory-server**. La base de datos en memoria se levanta y limpia automáticamente en cada test, por lo que no es necesario tener MongoDB corriendo para ejecutar los tests.

```bash
npm test
```

Los tests cubren:

- Registro de usuario: respuesta `201`, ausencia de `password` en la respuesta, conflicto `409` por `username` duplicado.
- Login y logout: `200` con credenciales válidas, `401` con contraseña incorrecta, `204` al cerrar sesión.
- Perfil: `401` sin sesión, `200` con sesión válida y array `posts` populado.
- CRUD de posts: `200`/`201`/`204` en cada operación, `401` sin sesión, `404` para IDs inexistentes.
- Comentarios: `201` al crear, `204` al eliminar, `404` para comentarios inexistentes.

---

## Criterios de evaluación

### Modelos

- [ ] Los tres modelos (`User`, `Post`, `Comment`) están definidos con los campos y validaciones correctos.
- [ ] El modelo `User` incluye hook `pre('save')` con bcrypt y método `checkPassword()`.
- [ ] Los modelos `User` y `Post` tienen los virtuales de reverse-populate correctamente configurados.
- [ ] Todos los modelos tienen `timestamps: true` y la transformación `toJSON` que oculta `_id`, `__v` y `password`.

### Autenticación

- [ ] `POST /api/v0/users` crea el usuario con la contraseña hasheada y devuelve `201`.
- [ ] `POST /api/v0/sessions` valida credenciales, guarda `userId` en sesión y devuelve el usuario sin `password`.
- [ ] `DELETE /api/v0/sessions` destruye la sesión y devuelve `204`.
- [ ] `GET /api/v0/users/me` devuelve el usuario autenticado con `posts[]` populado.

### Posts

- [ ] `GET /api/v0/posts` devuelve todos los posts con `author` populado (requiere sesión).
- [ ] `POST /api/v0/posts` asigna `author` desde `req.user._id`, no desde el body (requiere sesión).
- [ ] `GET /api/v0/posts/:id` devuelve el post con `author` y `comments[].author` populados (requiere sesión).
- [ ] `PATCH /api/v0/posts/:id` actualiza el post con `runValidators: true` (requiere sesión).
- [ ] `DELETE /api/v0/posts/:id` elimina el post y devuelve `204` (requiere sesión).

### Comentarios

- [ ] `POST /api/v0/posts/:id/comments` crea el comentario con `author` y `post` desde la sesión/params (requiere sesión).
- [ ] `DELETE /api/v0/posts/:id/comments/:commentId` elimina el comentario y devuelve `204` (requiere sesión).

### Calidad del código

- [ ] El middleware `auth.mid.js` es reutilizable y se aplica por ruta, no globalmente.
- [ ] Todos los controladores usan el patrón `try/catch` con `next(error)`.
- [ ] El manejador global de errores distingue `ValidationError` (400), `CastError` (404) y errores genéricos (500).
- [ ] No se accede a `process.env` directamente fuera de `lib/config.js`.
- [ ] Todos los tests pasan con `npm test`.

---

Happy coding!
