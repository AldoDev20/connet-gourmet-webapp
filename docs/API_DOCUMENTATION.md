# Documentación de Consumo de la API para Frontend - GourmetConnect

Esta documentación describe con precisión cada uno de los endpoints expuestos por la API de **GourmetConnect** para que el equipo de frontend los consuma correctamente.

> [!WARNING]
> **Discrepancia en Documentación Anterior (README.md)**
> Se han detectado varias discrepancias importantes en el `README.md` del proyecto con respecto a la implementación real en el código Java (controladores y DTOs). Esta guía refleja el estado **real y actual** del código del servidor. Por favor, utilicen esta documentación como la única fuente de verdad.

---

## 🌐 Configuración de Servidores (Base URL)

La API cuenta con soporte para dos entornos. Asegúrense de configurar su cliente HTTP (por ejemplo, en Angular `environment.ts`) con la URL correspondiente:

*   **Desarrollo Local:** `http://localhost:8080`
*   **Producción (Render):** `https://gourmetconnect-api.onrender.com`

*Nota: La API tiene habilitado CORS globalmente (`@CrossOrigin(origins = "*", allowedHeaders = "*")`), por lo que no deberían tener problemas de origen cruzado en desarrollo.*

---

## 📌 Resumen de Endpoints Reales vs. README Obsoleto

| Recurso | Ruta Real en Código | Ruta Incorrecta en README | Cambios Clave / Estado |
| :--- | :--- | :--- | :--- |
| **Autenticación** | `/api/auth/login` | *No documentado* | **Nuevo.** Endpoint para iniciar sesión y verificar credenciales. |
| **Usuarios** | `/api/users` | `/api/users` | Correcto. DTO de registro modificado con coordenadas planas. |
| **Seguimientos** | `/api/relationships` | `/api/follows` | **Modificado.** La ruta real usa `/relationships` en lugar de `/follows`. |
| **Publicaciones** | `/api/posts` | `/api/posts` | Estructuras DTO de creación más complejas y anidadas (`PostContent`). |
| **Chats** | `/api/chats` | `/api/chats` | Correcto. Permite crear chats grupales/individuales. |
| **Mensajería** | `/api/chats/{chatId}/messages` | `/api/messages` | **Modificado/Actualizado.** Se pueden enviar y recuperar mensajes a través de la ruta del chat. |
| **Posts Guardados** | `/api/saved-posts` | `/api/saved-items` | **Modificado.** La ruta real usa `/saved-posts` en lugar de `/saved-items`. |
| **Notificaciones** | `/api/notifications` | `/api/notifications` | DTO de creación modificado. No maneja campos como `content` o `expiresAt`. |
| **Historias** | `/api/stories` | *No documentado* | **Nuevo.** Endpoint para historias efímeras (24h de expiración). |

---

## 🔑 Módulo de Autenticación (`/api/auth`)

### 0.1 Iniciar Sesión / Autenticar Usuario
*   **Método:** `POST`
*   **URL:** `/api/auth/login`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
```json
{
  "email": "ramsay@gourmetconnect.com",
  "password": "contraseña_plana"
}
```

#### Respuesta Exitosa (`200 OK`)
Retorna el objeto de usuario completo si las credenciales son correctas.
```json
{
  "id": "64a2b9f38f0e5b2c90c74a01",
  "username": "chef_ramsay",
  "email": "ramsay@gourmetconnect.com",
  "passwordHash": "contraseña_plana",
  "profile": {
    "fullName": "Gordon Ramsay",
    "bio": "Apasionado por la alta cocina y las estrellas Michelin.",
    "avatarUrl": "https://gourmetconnect.com/avatars/ramsay.jpg",
    "location": {
      "type": "Point",
      "coordinates": [-0.1278, 51.5074]
    }
  },
  "stats": {
    "followers_count": 0,
    "following_count": 0,
    "posts_count": 0
  },
  "role": "user",
  "location": null,
  "createdAt": "2026-07-03T04:44:26.123",
  "active": true
}
```

#### Respuestas de Error
*   **`401 Unauthorized`:** Credenciales incorrectas o usuario no registrado.
    *   *Ejemplos de cuerpo:* `"Usuario no encontrado con el correo proporcionado."` o `"Contraseña incorrecta."`
*   **`500 Internal Server Error`:** Error inesperado en el servidor.
    *   *Ejemplo de cuerpo:* `"Ocurrió un error inesperado al intentar iniciar sesión."`

---

## 👥 1. Módulo de Usuarios (`/api/users`)


### 1.1 Registrar un Nuevo Usuario
*   **Método:** `POST`
*   **URL:** `/api/users`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
El frontend debe enviar los datos planos del usuario. La ubicación (longitud y latitud) se envía como números planos y el backend se encarga de estructurarlos en un `GeoJsonPoint`.

```json
{
  "username": "chef_ramsay",
  "email": "ramsay@gourmetconnect.com",
  "passwordHash": "contraseña_encriptada_o_plana",
  "fullName": "Gordon Ramsay",
  "bio": "Apasionado por la alta cocina y las estrellas Michelin.",
  "avatarUrl": "https://gourmetconnect.com/avatars/ramsay.jpg",
  "longitude": -0.1278,
  "latitude": 51.5074
}
```

#### Respuesta Exitosa (`201 Created`)
Retorna el objeto de usuario completo guardado en MongoDB con su `id` (`_id` mapeado), su perfil estructurado y las estadísticas inicializadas.

```json
{
  "id": "64a2b9f38f0e5b2c90c74a01",
  "username": "chef_ramsay",
  "email": "ramsay@gourmetconnect.com",
  "passwordHash": "contraseña_encriptada_o_plana",
  "profile": {
    "fullName": "Gordon Ramsay",
    "bio": "Apasionado por la alta cocina y las estrellas Michelin.",
    "avatarUrl": "https://gourmetconnect.com/avatars/ramsay.jpg",
    "location": {
      "type": "Point",
      "coordinates": [-0.1278, 51.5074]
    }
  },
  "stats": {
    "followers_count": 0,
    "following_count": 0,
    "posts_count": 0
  },
  "role": "user",
  "location": null,
  "createdAt": "2026-07-03T04:44:26.123",
  "active": true
}
```

#### Respuestas de Error
*   **`400 Bad Request`:** Ocurre si el correo electrónico o el nombre de usuario ya existen.
    *   *Ejemplo de cuerpo:* `"El correo electrónico ya está en uso."` o `"El nombre de usuario ya está tomado."`
*   **`500 Internal Server Error`:** Error inesperado en el servidor.
    *   *Ejemplo de cuerpo:* `"Ocurrió un error inesperado al registrar el usuario."`

---

### 1.2 Buscar Usuarios Cercanos (Geolocalización)
Busca usuarios dentro de un radio en kilómetros a partir de unas coordenadas centrales utilizando el índice geoespacial `2dsphere` de MongoDB sobre `profile.location`.
*   **Método:** `GET`
*   **URL:** `/api/users/nearby`
*   **Parámetros de Consulta (Query Params):**
    *   `lng` (Obligatorio, double): Longitud de la ubicación central (e.g. `-76.9562`)
    *   `lat` (Obligatorio, double): Latitud de la ubicación central (e.g. `-12.0483`)
    *   `radius` (Opcional, double, por defecto: `5.0`): Radio máximo de búsqueda en kilómetros.

#### Ejemplo de Petición
```http
GET /api/users/nearby?lng=-76.9562&lat=-12.0483&radius=10.0
```

#### Respuesta Exitosa (`200 OK`)
Retorna un arreglo JSON con todos los usuarios encontrados dentro del rango.
```json
[
  {
    "id": "64a2b9f38f0e5b2c90c74a01",
    "username": "chef_ramsay",
    "email": "ramsay@gourmetconnect.com",
    "passwordHash": "contraseña_encriptada_o_plana",
    "profile": {
      "fullName": "Gordon Ramsay",
      "bio": "Apasionado por la alta cocina y las estrellas Michelin.",
      "avatarUrl": "https://gourmetconnect.com/avatars/ramsay.jpg",
      "location": {
        "type": "Point",
        "coordinates": [-0.1278, 51.5074]
      }
    },
    "stats": {
      "followers_count": 120,
      "following_count": 75,
      "posts_count": 14
    },
    "role": "user",
    "location": null,
    "createdAt": "2026-07-03T04:44:26.123",
    "active": true
  }
]
```

---

### 1.3 Listar Todos los Usuarios
Obtiene la lista completa de usuarios registrados. Principalmente para depuración y pruebas.
*   **Método:** `GET`
*   **URL:** `/api/users`

#### Respuesta Exitosa (`200 OK`)
```json
[
  {
    "id": "64a2b9f38f0e5b2c90c74a01",
    "username": "chef_ramsay",
    ...
  }
]
```

---

### 1.4 Obtener Usuario por ID
Busca los detalles de un usuario específico usando su identificador único.
*   **Método:** `GET`
*   **URL:** `/api/users/{id}`
*   **Parámetro de Ruta (Path Param):** `id` (String de MongoDB ObjectId, e.g. `64a2b9f38f0e5b2c90c74a01`)

#### Respuesta Exitosa (`200 OK`)
Retorna el objeto del usuario solicitado.

#### Respuesta de Fallo (`404 Not Found`)
El usuario no existe.

---

## 👥 2. Módulo de Seguimientos (`/api/relationships`)

### 2.1 Seguir a un Usuario
Crea un lazo de seguimiento entre un usuario seguidor y un usuario seguido.
*   **Método:** `POST`
*   **URL:** `/api/relationships`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
```json
{
  "followerId": "64a2b9f38f0e5b2c90c74a01",
  "followedId": "64a2b9f38f0e5b2c90c74a02"
}
```

#### Respuesta Exitosa (`201 Created`)
```json
{
  "id": "64a2baf58f0e5b2c90c74a05",
  "followerId": "64a2b9f38f0e5b2c90c74a01",
  "followedId": "64a2b9f38f0e5b2c90c74a02",
  "status": "active",
  "createdAt": "2026-07-03T04:45:12.345"
}
```

---

### 2.2 Obtener Relación por ID
*   **Método:** `GET`
*   **URL:** `/api/relationships/{id}`
*   **Respuesta:** `200 OK` (Objeto Relationship) o `404 Not Found`.

---

### 2.3 Obtener Seguidores de un Usuario
Lista los registros de seguimiento donde el usuario especificado es el **seguido** (`followedId`).
*   **Método:** `GET`
*   **URL:** `/api/relationships/followers/{userId}`

#### Respuesta Exitosa (`200 OK`)
```json
[
  {
    "id": "64a2baf58f0e5b2c90c74a05",
    "followerId": "64a2b9f38f0e5b2c90c74a01",
    "followedId": "64a2b9f38f0e5b2c90c74a02",
    "status": "active",
    "createdAt": "2026-07-03T04:45:12.345"
  }
]
```

---

### 2.4 Obtener Usuarios Seguidos por un Usuario
Lista los registros de seguimiento donde el usuario especificado es el **seguidor** (`followerId`).
*   **Método:** `GET`
*   **URL:** `/api/relationships/following/{userId}`

#### Respuesta Exitosa (`200 OK`)
Retorna la lista de relaciones activas iniciadas por este usuario.

---

### 2.5 Dejar de Seguir a un Usuario (Eliminar Relación)
*   **Método:** `DELETE`
*   **URL:** `/api/relationships/{id}`
*   **Parámetro de Ruta:** `id` (El ID de la relación, no del usuario).
*   **Respuesta Exitosa:** `204 No Content` (Cuerpo vacío).

---

## 📝 3. Módulo de Publicaciones (`/api/posts`)

### 3.1 Crear un Nuevo Post
Crea una publicación en la plataforma, la cual puede contener imágenes/videos, recetas asociadas y geolocalización.
*   **Método:** `POST`
*   **URL:** `/api/posts`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
```json
{
  "creatorId": "64a2b9f38f0e5b2c90c74a01",
  "type": "recipe",
  "content": {
    "text": "Preparando el mejor tiramisú casero paso a paso.",
    "media": [
      {
        "type": "image",
        "url": "https://gourmetconnect.com/media/tiramisu.jpg"
      }
    ],
    "tags": ["postres", "italiano", "dulce"]
  },
  "location": {
    "type": "Point",
    "coordinates": [-76.9562, -12.0483]
  },
  "hasRecipe": true,
  "locationLabel": "Pastelería Don Tiramisú, Lima"
}
```

#### Respuesta Exitosa (`201 Created`)
Retorna el post creado con la sección de interacción (`engagement`) y comentarios inicializados por defecto.

```json
{
  "id": "64a2c0f28f0e5b2c90c74a10",
  "creatorId": "64a2b9f38f0e5b2c90c74a01",
  "type": "recipe",
  "content": {
    "text": "Preparando el mejor tiramisú casero paso a paso.",
    "media": [
      {
        "type": "image",
        "url": "https://gourmetconnect.com/media/tiramisu.jpg"
      }
    ],
    "tags": ["postres", "italiano", "dulce"]
  },
  "location": {
    "type": "Point",
    "coordinates": [-76.9562, -12.0483]
  },
  "hasRecipe": true,
  "locationLabel": "Pastelería Don Tiramisú, Lima",
  "engagement": {
    "likesCount": 0,
    "commentsCount": 0,
    "sharesCount": 0
  },
  "comments": [],
  "timestamp": "2026-07-03T04:46:00.123",
  "updatedAt": "2026-07-03T04:46:00.123"
}
```

---

### 3.2 Listar Todos los Posts
Obtiene una lista global de publicaciones ordenada de forma descendente por fecha (`timestamp`).
*   **Método:** `GET`
*   **URL:** `/api/posts`

#### Respuesta Exitosa (`200 OK`)
Retorna un arreglo de objetos `Post`.

---

### 3.3 Obtener Post por ID
*   **Método:** `GET`
*   **URL:** `/api/posts/{id}`
*   **Respuesta:** `200 OK` (Objeto Post) o `404 Not Found`.

---

### 3.4 Obtener Publicaciones de un Usuario
Obtiene todos los posts creados por un usuario específico, ordenados del más reciente al más antiguo.
*   **Método:** `GET`
*   **URL:** `/api/posts/user/{creatorId}`

#### Respuesta Exitosa (`200 OK`)
Retorna una lista de posts del usuario solicitado.

---

### 3.5 Actualizar Publicación
Actualiza todos los campos de una publicación existente.
*   **Método:** `PUT`
*   **URL:** `/api/posts/{id}`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición y Respuesta (`200 OK`)
Se debe enviar el objeto `Post` completo modificado. Retorna el post modificado y persistido.

---

### 3.6 Eliminar Publicación
*   **Método:** `DELETE`
*   **URL:** `/api/posts/{id}`
*   **Respuesta Exitosa:** `204 No Content`.

---

## 💬 4. Módulo de Chats y Mensajería (`/api/chats`)

### 4.1 Crear un Nuevo Chat (Conversación)
Inicia una conversación entre dos o más usuarios. Puede ser un chat directo individual o un chat grupal.
*   **Método:** `POST`
*   **URL:** `/api/chats`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
```json
{
  "participants": ["64a2b9f38f0e5b2c90c74a01", "64a2b9f38f0e5b2c90c74a02"],
  "group": false
}
```

#### Respuesta Exitosa (`201 Created`)
```json
{
  "id": "64a2d3e18f0e5b2c90c74a30",
  "participants": [
    "64a2b9f38f0e5b2c90c74a01",
    "64a2b9f38f0e5b2c90c74a02"
  ],
  "lastMessageTime": "2026-07-03T04:47:05.123",
  "group": false
}
```

---

### 4.2 Enviar Mensaje en un Chat
Envía un mensaje de texto dentro de una conversación existente. Este mensaje es guardado en la colección `messages` y actualiza la fecha del último mensaje en el chat (`lastMessageTime`).
*   **Método:** `POST`
*   **URL:** `/api/chats/{chatId}/messages`
*   **Parámetro de Ruta:** `chatId` (ID de la conversación)
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
```json
{
  "senderId": "64a2b9f38f0e5b2c90c74a01",
  "text": "Hola, ¿tienes la receta completa del tiramisú?"
}
```

#### Respuesta Exitosa (`200 OK`)
Retorna el objeto **`Chat`** actualizado (con la nueva fecha de `lastMessageTime`).
```json
{
  "id": "64a2d3e18f0e5b2c90c74a30",
  "participants": [
    "64a2b9f38f0e5b2c90c74a01",
    "64a2b9f38f0e5b2c90c74a02"
  ],
  "lastMessageTime": "2026-07-03T04:48:15.980",
  "group": false
}
```
*Si la conversación `chatId` no existe, retorna `404 Not Found`.*

### 4.3 Obtener Historial de Mensajes de un Chat
Recupera todos los mensajes correspondientes a una conversación ordenados cronológicamente.
*   **Método:** `GET`
*   **URL:** `/api/chats/{chatId}/messages`
*   **Parámetro de Ruta:** `chatId` (ID de la conversación)

#### Respuesta Exitosa (`200 OK`)
Retorna una lista de mensajes.
```json
[
  {
    "id": "64a2d4b98f0e5b2c90c74a35",
    "chatId": "64a2d3e18f0e5b2c90c74a30",
    "senderId": "64a2b9f38f0e5b2c90c74a01",
    "text": "Hola, ¿tienes la receta completa del tiramisú?",
    "timestamp": "2026-07-03T04:48:15.980"
  }
]
```

---

### 4.4 Obtener Chat por ID
*   **Método:** `GET`
*   **URL:** `/api/chats/{id}`
*   **Respuesta:** `200 OK` (Objeto Chat) o `404 Not Found`.

---

### 4.5 Obtener Chats de un Usuario
Lista de forma descendente (por fecha del último mensaje) todas las conversaciones activas donde participa el usuario.
*   **Método:** `GET`
*   **URL:** `/api/chats/user/{userId}`

#### Respuesta Exitosa (`200 OK`)
Retorna un arreglo de conversaciones.

---

### 4.6 Actualizar y Eliminar Chat
*   **Actualizar (`PUT /api/chats/{id}`):** Reemplaza participantes o metadatos del chat. Retorna el chat modificado.
*   **Eliminar (`DELETE /api/chats/{id}`):** Elimina la conversación de la base de datos. Retorna `204 No Content`.

---

## 💾 5. Módulo de Posts Guardados (`/api/saved-posts`)

### 5.1 Guardar un Post
Guarda un post en la colección personal de un usuario, pudiendo agruparlo dentro de carpetas/colecciones personalizadas.
*   **Método:** `POST`
*   **URL:** `/api/saved-posts`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
```json
{
  "userId": "64a2b9f38f0e5b2c90c74a01",
  "postId": "64a2c0f28f0e5b2c90c74a10",
  "collectionName": "Recetas Favoritas"
}
```
*Si `collectionName` es nulo o no se provee, el backend lo guardará automáticamente con el valor `"default"`.*

#### Respuesta Exitosa (`201 Created`)
```json
{
  "id": "64a2e5d18f0e5b2c90c74a45",
  "userId": "64a2b9f38f0e5b2c90c74a01",
  "collectionName": "Recetas Favoritas",
  "postId": "64a2c0f28f0e5b2c90c74a10",
  "savedAt": "2026-07-03T04:49:10.123"
}
```

---

### 5.2 Obtener Post Guardado por ID
*   **Método:** `GET`
*   **URL:** `/api/saved-posts/{id}`
*   **Respuesta:** `200 OK` o `404 Not Found`.

---

### 5.3 Obtener Todos los Posts Guardados de un Usuario
*   **Método:** `GET`
*   **URL:** `/api/saved-posts/user/{userId}`

#### Respuesta Exitosa (`200 OK`)
Retorna una lista conteniendo todas las publicaciones guardadas por el usuario sin filtrar por colección.

---

### 5.4 Obtener Posts Guardados de un Usuario por Colección
*   **Método:** `GET`
*   **URL:** `/api/saved-posts/user/{userId}/collection/{collectionName}`

#### Ejemplo de Petición
```http
GET /api/saved-posts/user/64a2b9f38f0e5b2c90c74a01/collection/Recetas%20Favoritas
```

#### Respuesta Exitosa (`200 OK`)
Retorna los posts guardados que coinciden exactamente con el nombre de la colección.

---

### 5.5 Eliminar un Post Guardado
*   **Método:** `DELETE`
*   **URL:** `/api/saved-posts/{id}`
*   **Respuesta Exitosa:** `204 No Content`.

---

## 🔔 6. Módulo de Notificaciones (`/api/notifications`)

### 6.1 Crear una Notificación
Registra una notificación dirigida a un usuario destinatario.
*   **Método:** `POST`
*   **URL:** `/api/notifications`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
```json
{
  "recipientId": "64a2b9f38f0e5b2c90c74a02",
  "senderId": "64a2b9f38f0e5b2c90c74a01",
  "type": "like",
  "postId": "64a2c0f28f0e5b2c90c74a10"
}
```

#### Respuesta Exitosa (`201 Created`)
Retorna la notificación con el estado `read` inicializado en `false` y la fecha de creación.
```json
{
  "id": "64a2f7c28f0e5b2c90c74a60",
  "recipientId": "64a2b9f38f0e5b2c90c74a02",
  "senderId": "64a2b9f38f0e5b2c90c74a01",
  "type": "like",
  "postId": "64a2c0f28f0e5b2c90c74a10",
  "createdAt": "2026-07-03T04:50:00.123",
  "read": false
}
```

---

### 6.2 Obtener Todas las Notificaciones de un Usuario
*   **Método:** `GET`
*   **URL:** `/api/notifications/user/{userId}`
*   **Respuesta:** `200 OK` (Arreglo con todas las notificaciones).

---

### 6.3 Obtener Notificaciones No Leídas de un Usuario
*   **Método:** `GET`
*   **URL:** `/api/notifications/user/{userId}/unread`
*   **Respuesta:** `200 OK` (Arreglo de notificaciones filtrado por `isRead = false`).

---

### 6.4 Marcar Notificación como Leída
Cambia el estado de lectura de la notificación a `true`.
*   **Método:** `PUT`
*   **URL:** `/api/notifications/{id}/read`

#### Respuesta Exitosa (`200 OK`)
Retorna la notificación modificada.
```json
{
  "id": "64a2f7c28f0e5b2c90c74a60",
  "recipientId": "64a2b9f38f0e5b2c90c74a02",
  "senderId": "64a2b9f38f0e5b2c90c74a01",
  "type": "like",
  "postId": "64a2c0f28f0e5b2c90c74a10",
  "createdAt": "2026-07-03T04:50:00.123",
  "read": true
}
```

---

### 6.5 Eliminar una Notificación
*   **Método:** `DELETE`
*   **URL:** `/api/notifications/{id}`
*   **Respuesta Exitosa:** `204 No Content`.

---

## 🎬 7. Módulo de Historias (`/api/stories`)

Las historias son efímeras y el backend está configurado en MongoDB para expirar automáticamente después de 24 horas usando índices TTL en `expires_at`.

### 7.1 Crear una Nueva Historia
*   **Método:** `POST`
*   **URL:** `/api/stories`
*   **Content-Type:** `application/json`

#### Cuerpo de la Petición (Request JSON)
```json
{
  "creatorId": "64a2b9f38f0e5b2c90c74a01",
  "mediaUrl": "https://gourmetconnect.com/stories/story123.mp4",
  "type": "video"
}
```

#### Respuesta Exitosa (`201 Created`)
El backend calcula automáticamente la fecha de expiración sumando 24 horas a la fecha de creación.
```json
{
  "id": "64a302a48f0e5b2c90c74a75",
  "creatorId": "64a2b9f38f0e5b2c90c74a01",
  "mediaUrl": "https://gourmetconnect.com/stories/story123.mp4",
  "type": "video",
  "createdAt": "2026-07-03T04:51:30.123",
  "expiresAt": "2026-07-04T04:51:30.123"
}
```

---

### 7.2 Obtener Historia por ID
*   **Método:** `GET`
*   **URL:** `/api/stories/{id}`
*   **Respuesta:** `200 OK` (Objeto Story) o `404 Not Found`.

---

### 7.3 Obtener Historias de un Usuario
Retorna la lista de historias creadas por un usuario en particular que aún no han expirado.
*   **Método:** `GET`
*   **URL:** `/api/stories/user/{creatorId}`

#### Respuesta Exitosa (`200 OK`)
```json
[
  {
    "id": "64a302a48f0e5b2c90c74a75",
    "creatorId": "64a2b9f38f0e5b2c90c74a01",
    "mediaUrl": "https://gourmetconnect.com/stories/story123.mp4",
    "type": "video",
    "createdAt": "2026-07-03T04:51:30.123",
    "expiresAt": "2026-07-04T04:51:30.123"
  }
]
```

---

### 7.4 Eliminar Historia
*   **Método:** `DELETE`
*   **URL:** `/api/stories/{id}`
*   **Respuesta Exitosa:** `204 No Content`.
