# Guía Completa de Endpoints - GourmetConnect API

Esta guía contiene la documentación y ejemplos **de cada uno** de los endpoints de la API, sin omitir ninguno, organizados por módulos. Todos los payloads de entrada y salida corresponden a los modelos de datos corregidos y enlazados a la base de datos MongoDB.

---

## 👥 1. Autenticación (`/api/auth`)

### Iniciar Sesión (Login)
* **URL:** `POST /api/auth/login`
* **Request Body:**
  ```json
  {
    "email": "chef@gourmetconnect.com",
    "password": "password123"
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "id": "60d5ec49f83c5123456789a1",
    "username": "chef_gourmet",
    "email": "chef@gourmetconnect.com",
    "name": "Chef Mateo",
    "avatarUrl": "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1170&auto=format&fit=crop",
    "coverUrl": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop",
    "bio": "Chef ejecutivo apasionado por la cocina fusión nikkei.",
    "role": "creator",
    "location": {
      "type": "Point",
      "coordinates": [-77.0369, -12.0464]
    },
    "followersCount": 1250,
    "followingCount": 5,
    "postsCount": 45,
    "recipesCount": 45,
    "producersCount": 12,
    "createdAt": "2026-07-04T12:00:00",
    "active": true
  }
  ```

---

## 👥 2. Usuarios (`/api/users`)

### Registrar un nuevo usuario
* **URL:** `POST /api/users`
* **Request Body:**
  ```json
  {
    "username": "sofia_sabe_rico",
    "email": "sofia.foodie@outlook.com",
    "passwordHash": "password123",
    "fullName": "Sofía Mendoza",
    "bio": "Explorando los sabores ocultos del Perú. 🇵🇪",
    "avatarUrl": "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=687&auto=format&fit=crop",
    "longitude": -71.5369,
    "latitude": -13.5319
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "60d5ec49f83c5123456789a2",
    "username": "sofia_sabe_rico",
    "email": "sofia.foodie@outlook.com",
    "name": "Sofía Mendoza",
    "avatarUrl": "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=687&auto=format&fit=crop",
    "coverUrl": null,
    "bio": "Explorando los sabores ocultos del Perú. 🇵🇪",
    "role": "user",
    "location": {
      "type": "Point",
      "coordinates": [-71.5369, -13.5319]
    },
    "followersCount": 0,
    "followingCount": 0,
    "postsCount": 0,
    "recipesCount": 0,
    "producersCount": 0,
    "createdAt": "2026-07-04T22:35:00",
    "active": true
  }
  ```

### Buscar usuarios cercanos (Geolocalización)
* **URL:** `GET /api/users/nearby?lng=-77.03&lat=-12.04&radius=5.0`
* **Response (`200 OK`):**
  ```json
  [
    {
      "id": "60d5ec49f83c5123456789a1",
      "username": "chef_gourmet",
      "email": "chef@gourmetconnect.com",
      "name": "Chef Mateo",
      "avatarUrl": "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1170&auto=format&fit=crop",
      "role": "creator",
      "location": {
        "type": "Point",
        "coordinates": [-77.0369, -12.0464]
      },
      "followersCount": 1250,
      "followingCount": 5,
      "postsCount": 45,
      "active": true
    }
  ]
  ```

### Listar todos los usuarios
* **URL:** `GET /api/users`
* **Response (`200 OK`):** Retorna un listado completo de todos los usuarios registrados.

### Obtener usuario por ID
* **URL:** `GET /api/users/{id}`
* **Response (`200 OK`):** Retorna el objeto de usuario correspondiente.

---

## 📝 3. Publicaciones (`/api/posts`)

### Crear un post / receta
* **URL:** `POST /api/posts`
* **Request Body:**
  ```json
  {
    "creatorId": "60d5ec49f83c5123456789a1",
    "creatorName": "Chef Mateo",
    "creatorAvatar": "https://...",
    "creatorLocation": "Lima, Perú",
    "type": "recipe",
    "content": "Preparando tiramisú de lúcuma",
    "imageUrl": "https://...",
    "location": {
      "type": "Point",
      "coordinates": [-77.0369, -12.0464]
    },
    "hasRecipe": true,
    "recipeTitle": "Tiramisú de Lúcuma",
    "ingredients": ["Lúcuma", "Mascarpone", "Café"],
    "locationLabel": "Miraflores, Lima"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "70d5ec49f83c5123456789a1",
    "creatorId": "60d5ec49f83c5123456789a1",
    "creatorName": "Chef Mateo",
    "creatorAvatar": "https://...",
    "creatorLocation": "Lima, Perú",
    "type": "recipe",
    "content": "Preparando tiramisú de lúcuma",
    "imageUrl": "https://...",
    "location": {
      "type": "Point",
      "coordinates": [-77.0369, -12.0464]
    },
    "hasRecipe": true,
    "recipeTitle": "Tiramisú de Lúcuma",
    "ingredients": ["Lúcuma", "Mascarpone", "Café"],
    "locationLabel": "Miraflores, Lima",
    "likesCount": 0,
    "commentsCount": 0,
    "sharesCount": 0,
    "timestamp": "2026-07-04T22:36:12",
    "updatedAt": "2026-07-04T22:36:12"
  }
  ```

### Listar todos los posts
* **URL:** `GET /api/posts`
* **Response (`200 OK`):** Listado de todos los posts ordenados cronológicamente de manera descendente.

### Obtener post por ID
* **URL:** `GET /api/posts/{id}`
* **Response (`200 OK`):** Retorna el objeto `Post` solicitado.

### Obtener posts de un usuario
* **URL:** `GET /api/posts/user/{creatorId}`
* **Response (`200 OK`):** Lista con los posts creados por el usuario especificado.

### Actualizar un post
* **URL:** `PUT /api/posts/{id}`
* **Request Body:** Envía el objeto `Post` completo modificado.
* **Response (`200 OK`):** Retorna el objeto `Post` actualizado.

### Eliminar un post
* **URL:** `DELETE /api/posts/{id}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.

---

## 💬 4. Comentarios (`/api/comments`)

### Comentar un post
* **URL:** `POST /api/comments`
* **Request Body:**
  ```json
  {
    "postId": "70d5ec49f83c5123456789a1",
    "userId": "60d5ec49f83c5123456789a2",
    "userName": "Sofía Mendoza",
    "userAvatar": "https://...",
    "content": "¡Delicioso!"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "80d5ec49f83c5123456789a1",
    "postId": "70d5ec49f83c5123456789a1",
    "userId": "60d5ec49f83c5123456789a2",
    "userName": "Sofía Mendoza",
    "userAvatar": "https://...",
    "content": "¡Delicioso!",
    "timestamp": "2026-07-04T22:38:00"
  }
  ```

### Obtener comentario por ID
* **URL:** `GET /api/comments/{id}`
* **Response (`200 OK`):** Retorna el objeto del comentario.

### Obtener comentarios de una publicación
* **URL:** `GET /api/comments/post/{postId}`
* **Response (`200 OK`):** Lista con los comentarios del post ordenados cronológicamente.

### Eliminar un comentario
* **URL:** `DELETE /api/comments/{id}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.

---

## ❤️ 5. Likes (`/api/likes`)

### Dar Like a un post
* **URL:** `POST /api/likes`
* **Request Body:**
  ```json
  {
    "postId": "70d5ec49f83c5123456789a1",
    "userId": "60d5ec49f83c5123456789a2"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "90d5ec49f83c5123456789a1",
    "postId": "70d5ec49f83c5123456789a1",
    "userId": "60d5ec49f83c5123456789a2"
  }
  ```

### Quitar Like
* **URL:** `DELETE /api/likes/post/{postId}/user/{userId}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.

### Obtener likes de un post
* **URL:** `GET /api/likes/post/{postId}`
* **Response (`200 OK`):** Retorna la lista de likes vinculados al post.

### Verificar si el usuario dio like al post
* **URL:** `GET /api/likes/post/{postId}/user/{userId}/check`
* **Response (`200 OK`):** `true` o `false`.

---

## 💾 6. Guardados (`/api/saved-items`)

### Guardar un post
* **URL:** `POST /api/saved-items`
* **Request Body:**
  ```json
  {
    "userId": "60d5ec49f83c5123456789a2",
    "postId": "70d5ec49f83c5123456789a1",
    "collectionName": "Postres"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "50d5ec49f83c5123456789a1",
    "userId": "60d5ec49f83c5123456789a2",
    "postId": "70d5ec49f83c5123456789a1",
    "collectionName": "Postres",
    "savedAt": "2026-07-04T22:40:00"
  }
  ```

### Obtener ítem guardado por ID
* **URL:** `GET /api/saved-items/{id}`
* **Response (`200 OK`):** Retorna el ítem guardado.

### Obtener todos los ítems guardados de un usuario
* **URL:** `GET /api/saved-items/user/{userId}`
* **Response (`200 OK`):** Lista con todos los elementos guardados por el usuario.

### Obtener ítems de una colección de un usuario
* **URL:** `GET /api/saved-items/user/{userId}/collection/{collectionName}`
* **Response (`200 OK`):** Lista de ítems guardados que pertenecen a la colección específica del usuario.

### Eliminar ítem guardado
* **URL:** `DELETE /api/saved-items/{id}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.

---

## 🔔 7. Notificaciones (`/api/notifications`)

### Crear notificación
* **URL:** `POST /api/notifications`
* **Request Body:**
  ```json
  {
    "recipientId": "60d5ec49f83c5123456789a1",
    "senderId": "60d5ec49f83c5123456789a2",
    "type": "like",
    "postId": "70d5ec49f83c5123456789a1"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "40d5ec49f83c5123456789a1",
    "recipientId": "60d5ec49f83c5123456789a1",
    "senderId": "60d5ec49f83c5123456789a2",
    "type": "like",
    "postId": "70d5ec49f83c5123456789a1",
    "createdAt": "2026-07-04T22:38:05",
    "read": false
  }
  ```

### Obtener notificación por ID
* **URL:** `GET /api/notifications/{id}`
* **Response (`200 OK`):** Retorna el objeto de la notificación.

### Obtener todas las notificaciones de un usuario
* **URL:** `GET /api/notifications/user/{userId}`
* **Response (`200 OK`):** Lista de todas las notificaciones recibidas por el usuario.

### Obtener notificaciones no leídas de un usuario
* **URL:** `GET /api/notifications/user/{userId}/unread`
* **Response (`200 OK`):** Lista de notificaciones con `read: false`.

### Marcar notificación como leída
* **URL:** `PUT /api/notifications/{id}/read`
* **Response (`200 OK`):** Retorna la notificación modificada con `read: true`.

### Eliminar notificación
* **URL:** `DELETE /api/notifications/{id}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.

---

## 👥 8. Seguimientos (`/api/follows`)

### Seguir a un usuario
* **URL:** `POST /api/follows`
* **Request Body:**
  ```json
  {
    "followerId": "60d5ec49f83c5123456789a2",
    "followedId": "60d5ec49f83c5123456789a1"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "30d5ec49f83c5123456789a1",
    "followerId": "60d5ec49f83c5123456789a2",
    "followedId": "60d5ec49f83c5123456789a1",
    "status": "active",
    "createdAt": "2026-07-04T22:42:00"
  }
  ```

### Obtener seguimiento por ID
* **URL:** `GET /api/follows/{id}`
* **Response (`200 OK`):** Retorna la relación de seguimiento.

### Obtener seguidores de un usuario
* **URL:** `GET /api/follows/followers/{userId}`
* **Response (`200 OK`):** Lista de las relaciones donde el usuario es el seguido (`followedId`).

### Obtener usuarios seguidos
* **URL:** `GET /api/follows/following/{userId}`
* **Response (`200 OK`):** Lista de las relaciones donde el usuario es el seguidor (`followerId`).

### Dejar de seguir (Eliminar relación por ID)
* **URL:** `DELETE /api/follows/{id}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.

---

## 💬 9. Chats (`/api/chats`)

### Crear un chat
* **URL:** `POST /api/chats`
* **Request Body:**
  ```json
  {
    "participants": ["60d5ec49f83c5123456789a2", "60d5ec49f83c5123456789a1"],
    "group": false
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "20d5ec49f83c5123456789a1",
    "participants": ["60d5ec49f83c5123456789a2", "60d5ec49f83c5123456789a1"],
    "lastMessageTime": "2026-07-04T22:43:00",
    "lastMessageContent": null,
    "group": false
  }
  ```

### Enviar mensaje en un chat (Método alternativo)
* **URL:** `POST /api/chats/{chatId}/messages`
* **Request Body:**
  ```json
  {
    "senderId": "60d5ec49f83c5123456789a2",
    "content": "Hola chef Mateo"
  }
  ```
* **Response (`200 OK`):** Retorna el objeto `Chat` actualizado.

### Obtener chat por ID
* **URL:** `GET /api/chats/{id}`
* **Response (`200 OK`):** Retorna el chat solicitado.

### Obtener chats de un usuario
* **URL:** `GET /api/chats/user/{userId}`
* **Response (`200 OK`):** Lista de chats activos del usuario.

### Obtener historial de mensajes de un chat (Método alternativo)
* **URL:** `GET /api/chats/{chatId}/messages`
* **Response (`200 OK`):** Lista de mensajes ordenados cronológicamente del chat.

### Actualizar chat
* **URL:** `PUT /api/chats/{id}`
* **Request Body:** Envía el objeto `Chat` completo.
* **Response (`200 OK`):** Retorna el chat actualizado.

### Eliminar chat
* **URL:** `DELETE /api/chats/{id}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.

---

## ✉️ 10. Mensajes (`/api/messages`)

### Enviar mensaje individual
* **URL:** `POST /api/messages`
* **Request Body:**
  ```json
  {
    "chatId": "20d5ec49f83c5123456789a1",
    "senderId": "60d5ec49f83c5123456789a2",
    "content": "Hola chef, ¿cómo está?"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "10d5ec49f83c5123456789a1",
    "chatId": "20d5ec49f83c5123456789a1",
    "senderId": "60d5ec49f83c5123456789a2",
    "content": "Hola chef, ¿cómo está?",
    "timestamp": "2026-07-04T22:45:00",
    "read": false
  }
  ```

### Obtener mensaje por ID
* **URL:** `GET /api/messages/{id}`
* **Response (`200 OK`):** Retorna el mensaje.

### Obtener mensajes de un chat
* **URL:** `GET /api/messages/chat/{chatId}`
* **Response (`200 OK`):** Lista completa de mensajes del chat.

### Obtener mensajes no leídos de un chat
* **URL:** `GET /api/messages/chat/{chatId}/unread`
* **Response (`200 OK`):** Lista de mensajes del chat que tienen `read: false`.

### Marcar mensaje como leído
* **URL:** `PUT /api/messages/{id}/read`
* **Response (`200 OK`):** Retorna el mensaje actualizado con `read: true`.

### Eliminar mensaje
* **URL:** `DELETE /api/messages/{id}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.

---

## 📸 11. Historias Efímeras (`/api/stories`)

### Publicar historia
* **URL:** `POST /api/stories`
* **Request Body:**
  ```json
  {
    "creatorId": "60d5ec49f83c5123456789a1",
    "mediaUrl": "https://...",
    "type": "image"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "11d5ec49f83c5123456789a1",
    "creatorId": "60d5ec49f83c5123456789a1",
    "mediaUrl": "https://...",
    "type": "image",
    "createdAt": "2026-07-04T22:46:00",
    "expiresAt": "2026-07-05T22:46:00"
  }
  ```

### Obtener historia por ID
* **URL:** `GET /api/stories/{id}`
* **Response (`200 OK`):** Retorna la historia.

### Obtener historias de un usuario
* **URL:** `GET /api/stories/user/{creatorId}`
* **Response (`200 OK`):** Lista de historias del creador.

### Eliminar historia
* **URL:** `DELETE /api/stories/{id}`
* **Response (`204 No Content`):** Respuesta sin cuerpo.
