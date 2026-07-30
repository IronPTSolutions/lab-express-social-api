# Wireframes del MVP

Los wireframes se describen por pantalla indicando los datos que muestra y las acciones disponibles.

## Pantallas del MVP

- `/` — Landing page con descripción de la app y enlaces a registro e inicio de sesión.
- `/signup` — Formulario de registro (`name`, `username`, `email`, `password`).
- `/login` — Formulario de inicio de sesión (`email`, `password`).
- `/feed` — Feed global con todos los posts (título, autor, fecha). Botón para crear un nuevo post. Requiere autenticación.
- `/posts/new` — Formulario para crear un post (`title`, `body`).
- `/posts/:id` — Detalle de un post: título, cuerpo, autor, fecha y lista de comentarios. Formulario para añadir un comentario. Botones de editar y eliminar si el usuario es el autor.
- `/posts/:id/edit` — Formulario para editar un post existente (`title`, `body`).
- `/profile` — Perfil del usuario autenticado: datos de cuenta y lista de sus posts.

## Flujo de navegación

```
/  ──► /signup ──► /login ──► /feed
                               │
                               ├──► /posts/new ──► /feed
                               │
                               └──► /posts/:id ──► /posts/:id/edit ──► /posts/:id
                                          │
                                          └──► (comentario añadido/eliminado → misma página)

/feed ──► /profile
```
