# Lab | Express Social API

## Objetivos de aprendizaje

- Definir modelos Mongoose con validaciones, relaciones, virtuals y hooks
- Implementar un middleware de autenticación basado en sesiones (express-session)
- Construir endpoints CRUD protegidos con autenticación
- Usar `populate()` y virtual populate para gestionar relaciones entre documentos
- Validar el progreso con tests automatizados ejecutando `npm test`

## Introducción

En este lab vas a construir una API REST para una mini red social. Los usuarios pueden registrarse, iniciar sesión, publicar posts y comentar los posts de otros.

El proyecto ya viene con la infraestructura montada: el servidor Express, la conexión a la base de datos, el middleware de errores y la suite de tests. Tu trabajo es implementar los modelos, el middleware de autenticación, los controladores y las rutas.

Usa `npm test` cada vez que termines una iteración para ver cuántos tests pasan. El objetivo es llegar a todos en verde.

## Requisitos previos

- Node.js >= 20
- MongoDB instalado y ejecutándose localmente (solo para desarrollo)
- Conocimientos de Express, Mongoose y express-session

## Setup inicial

```bash
# 1. Clona el repositorio
git clone https://github.com/IronPTSolutions/lab-express-social-api.git
cd lab-express-social-api

# 2. Instala las dependencias
npm install

# 3. Crea el fichero de entorno
cp .env.template .env
# Edita .env y rellena los valores (MONGODB_URI, SESSION_SECRET, etc.)

# 4. Ejecuta los tests para ver el punto de partida
npm test
```

Verás que todos los tests fallan. Tu objetivo es hacerlos pasar iteración a iteración.

## Colección Postman

El proyecto incluye una colección Postman en `docs/api.postman_collection.json` con todas las peticiones del API organizadas por recurso (Users & Sessions, Posts, Comments).

**Cómo importarla:**

1. Abre Postman y haz clic en **Import**.
2. Selecciona el archivo `docs/api.postman_collection.json`.
3. La colección aparecerá con una variable `baseUrl` apuntando a `http://localhost:3000`.

**Flujo de uso:**

1. Arranca el servidor con `npm run dev`.
2. Ejecuta **Registrar usuario** para crear tu cuenta.
3. Ejecuta **Iniciar sesión** — Postman guarda la cookie de sesión automáticamente.
4. Ya puedes usar el resto de peticiones sin configurar nada más.
5. Después de crear un post, copia el campo `id` de la respuesta y pégalo en la variable `postId` de la colección para usar las peticiones de detalle, actualización y comentarios.

## Entrega

Cuando hayas terminado, sube tu código a GitHub y entrega el enlace a tu repositorio.

---

## Instrucciones

### Iteración 1 — Modelos

Implementa los tres modelos en `src/lib/models/`. Todos deben tener `timestamps: true` y un `toJSON` transform que exponga `id` (como string), y elimine `_id` y `__v` del JSON de respuesta.

---

**`user.model.js`**

Campos del esquema:

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `name` | String | required |
| `username` | String | required, trim, unique |
| `email` | String | required, trim, lowercase, formato email |
| `password` | String | required, trim, mínimo 8 caracteres |

Además del esquema básico, implementa:

**1. Virtual `posts`**
Devuelve todos los documentos `Post` cuyo campo `author` sea igual al `_id` de este usuario. Necesario para poder hacer `.populate("posts")` en el perfil.

**2. Hook `pre("save")`**
Antes de guardar el documento, si el campo `password` fue modificado (`this.isModified("password")`), hashea la contraseña con `bcrypt.hash(this.password, 10)` y sobreescribe `this.password`.

**3. Método de instancia `checkPassword(plain)`**
Compara la contraseña en texto plano con la almacenada. Devuelve `bcrypt.compare(plain, this.password)`.

Para que el virtual aparezca en la respuesta JSON, añade `virtuals: true` en la opción `toJSON`.

<details>
<summary>Pista — toJSON transform</summary>

```js
toJSON: {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
},
```

</details>

<details>
<summary>Pista — Pre-save hook</summary>

```js
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
```

</details>

---

**`post.model.js`**

Campos del esquema:

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `title` | String | required, minLength: 3, maxLength: 200 |
| `body` | String | required, minLength: 1, maxLength: 1000 |
| `author` | ObjectId → User | required |

Añade también un **virtual `comments`** que devuelva todos los `Comment` cuyo campo `post` sea igual al `_id` de este post. Añade `virtuals: true` en `toJSON`.

---

**`comment.model.js`**

Campos del esquema:

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `body` | String | required, minLength: 1, maxLength: 500 |
| `author` | ObjectId → User | required |
| `post` | ObjectId → Post | required |

---

Cuando termines, ejecuta `npm test`. Los tests empezarán a correr. Verás errores de aserción porque los controladores aún no están implementados, pero la suite no debería fallar por problemas de importación.

---

### Iteración 2 — Middleware de autenticación

Implementa `src/middlewares/auth.mid.js`.

Este middleware protege las rutas que requieren sesión activa. Debe:

1. Comprobar que `req.session.userId` existe. Si no, pasar un error `401` con el mensaje `"session not found"` al siguiente middleware.
2. Buscar el usuario en la base de datos usando `req.session.userId`. Si no existe, pasar un error `401` con el mensaje `"session user not found"`.
3. Asignar el documento del usuario a `req.user` y llamar a `next()`.

El archivo ya importa `http-errors`. Usa `next(createError(401, "mensaje"))` para delegar el error al gestor global.

<details>
<summary>Pista — Estructura básica</summary>

```js
module.exports = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return next(createError(401, "session not found"));
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
      return next(createError(401, "session user not found"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
```

</details>

---

### Iteración 3 — Usuarios

Implementa `src/controllers/users.controller.js` y conecta el router en `src/controllers/index.js`.

**Endpoints a implementar:**

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/users` | No | Registrar nuevo usuario |
| `POST` | `/sessions` | No | Iniciar sesión |
| `DELETE` | `/sessions` | Sí | Cerrar sesión |
| `GET` | `/users/me` | Sí | Ver perfil con posts |

**Detalles de implementación:**

**Registro** (`POST /users`): antes de crear el usuario, comprueba si ya existe uno con el mismo `username`. Si existe, responde `409`. Si no, crea el usuario y responde `201`.

**Login** (`POST /sessions`): busca el usuario por `email`. Verifica la contraseña con `user.checkPassword(password)`. Si las credenciales son incorrectas, responde `401`. Si son correctas, guarda `req.session.userId = user._id` y responde `200` con el objeto usuario.

**Logout** (`DELETE /sessions`): destruye la sesión con `req.session.destroy()` y responde `204` (sin cuerpo).

**Perfil** (`GET /users/me`): busca el usuario por `req.user._id` y hace `.populate("posts")`. Responde `200`.

> **Importante**: declara la ruta `/users/me` **antes** de cualquier ruta con parámetros dinámicos como `/:id`. Express resuelve las rutas en orden de declaración.

No olvides montar el router en `src/controllers/index.js` con `router.use(usersRouter)`.

Ejecuta `npm test`. Los tests de `users.test.js` deberían pasar.

---

### Iteración 4 — Posts

Implementa `src/controllers/posts.controller.js` y móntalo en `src/controllers/index.js`.

**Endpoints a implementar:**

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/posts` | Sí | Listar todos los posts |
| `POST` | `/posts` | Sí | Crear post |
| `GET` | `/posts/:id` | Sí | Detalle de un post |
| `PATCH` | `/posts/:id` | Sí | Actualizar post |
| `DELETE` | `/posts/:id` | Sí | Eliminar post |

**Detalles:**

**Lista** (`GET /posts`): devuelve todos los posts con `author` populado.

**Crear** (`POST /posts`): el campo `author` debe asignarse desde `req.user._id`, no desde el cuerpo de la petición. Popula `author` en la respuesta. Responde `201`.

**Detalle** (`GET /posts/:id`): popula `author` y el virtual `comments`. Para poblar también el `author` de cada comentario, usa populate anidado. Si no existe el post, responde `404`.

<details>
<summary>Pista — Populate anidado para comments</summary>

```js
const post = await Post.findById(req.params.id)
  .populate("author")
  .populate({ path: "comments", populate: { path: "author" } });
```

</details>

**Actualizar** (`PATCH /posts/:id`): usa `findByIdAndUpdate` con `{ runValidators: true, returnDocument: "after" }`. Si no existe, responde `404`.

**Eliminar** (`DELETE /posts/:id`): si no existe, responde `404`. Si existe, responde `204` (sin cuerpo).

Ejecuta `npm test`. Los tests de `posts.test.js` deberían pasar.

---

### Iteración 5 [Bonus] — Comments

Implementa `src/controllers/comments.controller.js` y móntalo en `src/controllers/index.js`.

**Endpoints:**

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/posts/:id/comments` | Sí | Crear comentario en un post |
| `DELETE` | `/posts/:id/comments/:commentId` | Sí | Eliminar comentario |

**Detalles:**

**Crear** (`POST /posts/:id/comments`): el `author` = `req.user._id`, el `post` = `req.params.id`. Responde `201`.

**Eliminar** (`DELETE /posts/:id/comments/:commentId`): elimina por `req.params.commentId`. Si no existe, responde `404`. Si existe, responde `204`.

Ejecuta `npm test` para ver todos los tests en verde.

---

**Happy coding!**
