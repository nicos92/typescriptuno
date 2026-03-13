# Flujo de Datos del Proyecto

Este documento describe el flujo de datos principal de la aplicación, centrándose en cómo las solicitudes HTTP son procesadas y cómo interactúan con las diferentes capas de la arquitectura.

## Componentes Clave

Basado en `src/server.ts`, los componentes clave que orquestan el flujo de datos son:

1.  **`express`**: Framework web que maneja las rutas y el middleware (como `express.json()`, `morgan`, `compression`).
2.  **`TaskController`**: Responsable de manejar la lógica de negocio relacionada con las tareas. Recibe las solicitudes del `express` y coordina con el repositorio.
3.  **`TypeORMTaskRepository`**: Implementa la interfaz del repositorio de tareas y se encarga de la comunicación directa con la base de datos utilizando TypeORM.
4.  **`AppDataSource`**: Configuración e inicialización de la conexión a la base de datos a través de TypeORM.

## Flujo de Datos General

El flujo de datos sigue un patrón estándar de Clean Architecture:

1.  Una solicitud HTTP llega al servidor.
2.  `express` enruta la solicitud al método apropiado en `TaskController`.
3.  `TaskController` procesa la solicitud, posiblemente validando datos o aplicando lógica de negocio.
4.  `TaskController` invoca métodos en `TypeORMTaskRepository` para interactuar con la base de datos.
5.  `TypeORMTaskRepository` ejecuta operaciones de persistencia utilizando `AppDataSource` y TypeORM.
6.  Los resultados de la base de datos son devueltos a `TypeORMTaskRepository`.
7.  `TypeORMTaskRepository` devuelve los datos a `TaskController`.
8.  `TaskController` prepara la respuesta.
9.  `express` envía la respuesta HTTP al cliente.

## Flujo de Datos por Endpoint

A continuación, se detalla el flujo de datos para cada endpoint definido en `src/server.ts`:

### 1. `GET /tasks` (Obtener todas las tareas)

```d:/Users/n.sandoval/Documents/typescript/clean-architecture-main/src/server.ts#L17
app.get("/tasks", (req, res) => taskController.getAll(req, res));
```

*   **Solicitud**: El cliente envía una solicitud GET a `/tasks`.
*   **Express**: La solicitud es recibida por `express` y enrutada al método `taskController.getAll`.
*   **TaskController.getAll**: Este método llama a `repository.getAll()` (del `TypeORMTaskRepository`).
*   **TypeORMTaskRepository.getAll**: Interactúa con la base de datos a través de TypeORM para recuperar todas las tareas.
*   **Base de Datos**: Retorna la lista de tareas.
*   **TypeORMTaskRepository**: Recibe las tareas y las devuelve al `TaskController`.
*   **TaskController.getAll**: Envía la lista de tareas como respuesta HTTP al cliente.

### 2. `POST /tasks` (Crear una nueva tarea)

```d:/Users/n.sandoval/Documents/typescript/clean-architecture-main/src/server.ts#L18
app.post("/tasks", (req, res) => taskController.create(req, res));
```

*   **Solicitud**: El cliente envía una solicitud POST a `/tasks` con los datos de la nueva tarea en el cuerpo de la solicitud (JSON).
*   **Express**: La solicitud es recibida por `express`, el middleware `express.json()` parsea el cuerpo de la solicitud, y es enrutada al método `taskController.create`.
*   **TaskController.create**: Extrae los datos de la tarea del `req.body` y llama a `repository.create()` (del `TypeORMTaskRepository`) con esos datos.
*   **TypeORMTaskRepository.create**: Persiste la nueva tarea en la base de datos utilizando TypeORM.
*   **Base de Datos**: Guarda la tarea y retorna la tarea creada (posiblemente con un ID).
*   **TypeORMTaskRepository**: Recibe la tarea creada y la devuelve al `TaskController`.
*   **TaskController.create**: Envía la tarea creada como respuesta HTTP al cliente.

### 3. `PATCH /tasks/:id/complete` (Completar una tarea)

```d:/Users/n.sandoval/Documents/typescript/clean-architecture-main/src/server.ts#L19-21
app.patch("/tasks/:id/complete", (req, res) =>
  taskController.complete(req, res),
);
```

*   **Solicitud**: El cliente envía una solicitud PATCH a `/tasks/:id/complete` (donde `:id` es el ID de la tarea a completar).
*   **Express**: La solicitud es recibida por `express` y enrutada al método `taskController.complete`. El ID se extrae de `req.params`.
*   **TaskController.complete**: Extrae el ID de la tarea y llama a `repository.complete()` (del `TypeORMTaskRepository`) con el ID.
*   **TypeORMTaskRepository.complete**: Actualiza el estado de la tarea a "completa" en la base de datos utilizando TypeORM.
*   **Base de Datos**: Actualiza la tarea y retorna la tarea actualizada.
*   **TypeORMTaskRepository**: Recibe la tarea actualizada y la devuelve al `TaskController`.
*   **TaskController.complete**: Envía la tarea actualizada o un mensaje de éxito como respuesta HTTP al cliente.

### 4. `DELETE /tasks/:id` (Eliminar una tarea)

```d:/Users/n.sandoval/Documents/typescript/clean-architecture-main/src/server.ts#L22
app.delete("/tasks/:id", (req, res) => taskController.delete(req, res));
```

*   **Solicitud**: El cliente envía una solicitud DELETE a `/tasks/:id` (donde `:id` es el ID de la tarea a eliminar).
*   **Express**: La solicitud es recibida por `express` y enrutada al método `taskController.delete`. El ID se extrae de `req.params`.
*   **TaskController.delete**: Extrae el ID de la tarea y llama a `repository.delete()` (del `TypeORMTaskRepository`) con el ID.
*   **TypeORMTaskRepository.delete**: Elimina la tarea de la base de datos utilizando TypeORM.
*   **Base de Datos**: Elimina la tarea.
*   **TypeORMTaskRepository**: Confirma la eliminación y la devuelve al `TaskController`.
*   **TaskController.delete**: Envía un mensaje de éxito o estado HTTP 204 (No Content) como respuesta al cliente.

## Inicialización de la Base de Datos

```d:/Users/n.sandoval/Documents/typescript/clean-architecture-main/src/server.ts#L27-33
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
```

Antes de que el servidor comience a escuchar las solicitudes, `AppDataSource.initialize()` se encarga de establecer la conexión con la base de datos. Si la inicialización es exitosa, el servidor Express comienza a escuchar en el puerto `3000`. En caso de error, se registra un mensaje de error. Esta es una fase crítica que asegura que el componente de persistencia esté listo para operar.