# Diseño de la API

## Modelos de datos

### User

| Campo | Tipo | Validaciones | Notas |
|---|---|---|---|
| `name` | String | required | Nombre completo del usuario |
| `username` | String | required, unique, trim | Nombre de usuario público |
| `email` | String | required, unique, trim, lowercase, formato email | Usado para el login |
| `password` | String | required, trim, mínimo 8 caracteres | Hasheado con bcrypt antes de guardar |

**Relaciones:** un User tiene muchos Posts (virtual `posts`, referenciado desde `Post.author`).

```js
const userSchema = new Schema(
  {
    name:     { type: String, required: true },
    username: { type: String, required: true, trim: true, unique: true },
    email:    { type: String, required: true, trim: true, lowercase: true,
                match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] },
    password: { type: String, required: true, trim: true,
                match: [/^.{8,}$/, 'Password must be at least 8 characters'] },
  },
  { timestamps: true }
);

userSchema.virtual('posts', { ref: 'Post', localField: '_id', foreignField: 'author' });
```

---

### Post

| Campo | Tipo | Validaciones | Notas |
|---|---|---|---|
| `title` | String | required, minLength: 3, maxLength: 200 | Título del post |
| `body` | String | required, minLength: 1, maxLength: 1000 | Cuerpo del post |
| `author` | ObjectId | ref: `User`, required | Usuario que creó el post |

**Relaciones:** un Post pertenece a un User (`author`). Un Post tiene muchos Comments (virtual `comments`, referenciado desde `Comment.post`).

```js
const postSchema = new Schema(
  {
    title:  { type: String, required: true, minLength: 3, maxLength: 200 },
    body:   { type: String, required: true, minLength: 1, maxLength: 1000 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

postSchema.virtual('comments', { ref: 'Comment', localField: '_id', foreignField: 'post' });
```

---

### Comment

| Campo | Tipo | Validaciones | Notas |
|---|---|---|---|
| `body` | String | required, minLength: 1, maxLength: 500 | Texto del comentario |
| `author` | ObjectId | ref: `User`, required | Usuario que escribió el comentario |
| `post` | ObjectId | ref: `Post`, required | Post al que pertenece el comentario |

**Relaciones:** un Comment pertenece a un User (`author`) y a un Post (`post`).

```js
const commentSchema = new Schema(
  {
    body:   { type: String, required: true, minLength: 1, maxLength: 500 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post:   { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);
```

---

## Endpoints

Todos los endpoints tienen el prefijo `/api/v0`. Los marcados con 🔒 requieren sesión activa.

### Autenticación y usuarios

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| POST | `/api/v0/users` | Registro de usuario | `{ name, username, email, password }` | `201` — objeto User |
| POST | `/api/v0/sessions` | Inicio de sesión | `{ email, password }` | `200` — objeto User |
| DELETE | `/api/v0/sessions` | 🔒 Cierre de sesión | — | `204` |
| GET | `/api/v0/users/me` | 🔒 Perfil del usuario autenticado con sus posts | — | `200` — objeto User con `posts[]` populado |

### Posts

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v0/posts` | 🔒 Feed global: todos los posts con su autor | — | `200` — array de Posts con `author` populado |
| POST | `/api/v0/posts` | 🔒 Crear un post | `{ title, body }` | `201` — objeto Post con `author` populado |
| GET | `/api/v0/posts/:id` | 🔒 Detalle de un post con autor y comentarios | — | `200` — objeto Post con `author` y `comments[].author` populados |
| PATCH | `/api/v0/posts/:id` | 🔒 Actualizar título o cuerpo de un post | `{ title?, body? }` | `200` — objeto Post actualizado con `author` |
| DELETE | `/api/v0/posts/:id` | 🔒 Eliminar un post | — | `204` |

### Comentarios

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| POST | `/api/v0/posts/:id/comments` | 🔒 Añadir un comentario a un post | `{ body }` | `201` — objeto Comment |
| DELETE | `/api/v0/posts/:id/comments/:commentId` | 🔒 Eliminar un comentario | — | `204` |

---

## Cobertura frontend → API

| Pantalla | Endpoint(s) que consume |
|---|---|
| `/signup` | `POST /api/v0/users` |
| `/login` | `POST /api/v0/sessions` |
| `/feed` | `GET /api/v0/posts` |
| `/posts/new` | `POST /api/v0/posts` |
| `/posts/:id` | `GET /api/v0/posts/:id`, `POST /api/v0/posts/:id/comments`, `DELETE /api/v0/posts/:id/comments/:commentId`, `DELETE /api/v0/posts/:id` |
| `/posts/:id/edit` | `PATCH /api/v0/posts/:id` |
| `/profile` | `GET /api/v0/users/me`, `DELETE /api/v0/sessions` |
