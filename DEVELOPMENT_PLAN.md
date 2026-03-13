# Plan de Desarrollo: Usuario + Auth JWT + Soft Delete

## Visión General

Agregar sistema de autenticación/autorización con JWT y entidad Usuario con soft delete, migrando también Task a soft delete.

---

## 1. Estructura de Archivos

### Nuevos Archivos
```
src/
├── domain/
│   ├── entities/
│   │   └── user.ts              # Nueva entidad
│   ├── repositories/
│   │   └── user.repository.ts   # Nueva interfaz
│   └── use-cases/
│       └── user/
│           ├── create-user.use-case.ts
│           ├── authenticate.use-case.ts
│           ├── get-user.use-case.ts
│           ├── get-all-users.use-case.ts
│           ├── update-user.use-case.ts
│           └── delete-user.use-case.ts
│
├── infrastructure/
│   └── persistence/
│       ├── models/
│       │   └── user.schema.ts   # Schema con soft delete
│       └── repositories/
│           └── typeorm-user.repository.ts
│
├── controllers/
│   └── user.controller.ts      # CRUD + Auth
│
├── middleware/
│   ├── auth.middleware.ts       # Verificar JWT
│   └── role.middleware.ts       # Verificar rol
│
└── utils/
    └── jwt.util.ts              # Generar/verificar JWT
```

### Archivos a Modificar
```
src/
├── domain/
│   ├── entities/
│   │   └── task.ts              # + soft delete
│   └── repositories/
│       └── task.repository.ts   # + soft delete methods
│
├── infrastructure/
│   └── persistence/
│       ├── models/
│       │   └── task.schema.ts   # + deletedAt, userId
│       └── repositories/
│           └── typeorm-task.repository.ts
│
├── controllers/
│   └── task.controller.ts      # + auth + userId
│
└── server.ts                   # + rutas users/auth
```

---

## 2. Entidades

### User (nuevo)

| Campo | Tipo | Notas |
|-------|------|-------|
| id | number | PrimaryGeneratedColumn |
| username | string | unique, obligatorio |
| password | string | hasheado (bcrypt) |
| rol | string | "admin" \| "encargado" \| "operario" \| "vista" |
| createdAt | datetime | default CURRENT_TIMESTAMP |
| modifiedAt | datetime | se actualiza en cada update |
| deletedAt | datetime | nullable, soft delete |

### Task (actualizar - agregar soft delete)

| Campo | Tipo | Notas |
|-------|------|-------|
| id | number | ya existe |
| title | string | ya existe |
| completed | boolean | ya existe |
| createdAt | datetime | ya existe |
| userId | number | **NUEVO** - FK a User |
| deletedAt | datetime | **NUEVO** - soft delete |

---

## 3. Repositorios

### UserRepository (nuevo)

```typescript
interface UserRepository {
    findAll(): Promise<User[]>
    findAllWithDeleted(): Promise<User[]>
    findById(id: number): Promise<User | null>
    findByUsername(username: string): Promise<User | null>
    create(user: User): Promise<User>
    update(user: User): Promise<User>
    softDelete(id: number): Promise<void>
}
```

### TaskRepository (actualizar)

```typescript
interface TaskRepository {
    findAll(): Promise<Task[]>
    findAllByUserId(userId: number): Promise<Task[]>
    findById(id: number): Promise<Task | null>
    create(task: Task): Promise<Task>
    update(task: Task): Promise<Task>
    softDelete(id: number): Promise<void>
}
```

---

## 4. Use Cases

### Auth
- **AuthenticateUseCase**: validar credentials, retornar JWT

### User
- **CreateUserUseCase**: crear usuario (solo admin)
- **GetUserUseCase**: obtener por ID
- **GetAllUsersUseCase**: listar todos (solo admin)
- **UpdateUserUseCase**: actualizar usuario
- **DeleteUserUseCase**: soft delete (solo admin)

### Task
- **CreateTaskUseCase**: crear tarea (asociar a usuario autenticado)
- **GetTaskUseCase**: obtener tarea
- **GetAllTasksUseCase**: listar tareas
- **CompleteTaskUseCase**: completar tarea
- **DeleteTaskUseCase**: soft delete

---

## 5. Endpoints

### Auth (público)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/login | Login, retorna JWT |

### Users (solo admin)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /users | Crear usuario |
| GET | /users | Listar todos |
| GET | /users/:id | Obtener por ID |
| PATCH | /users/:id | Actualizar usuario |
| DELETE | /users/:id | Soft delete |

### Tasks (autenticados)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /tasks | Listar tareas |
| POST | /tasks | Crear tarea |
| GET | /tasks/:id | Obtener tarea |
| PATCH | /tasks/:id/complete | Completar tarea |
| DELETE | /tasks/:id | Soft delete |

---

## 6. Permisos por Rol

| Recurso | Admin | Encargado | Operario | Vista |
|---------|-------|-----------|----------|-------|
| Crear usuario | ✓ | ✗ | ✗ | ✗ |
| Listar usuarios | ✓ | ✗ | ✗ | ✗ |
| Ver usuario | ✓ | ✗ | ✗ | ✗ |
| Eliminar usuario | ✓ | ✗ | ✗ | ✗ |
| Crear tarea | ✓ | ✓ | ✓ | ✗ |
| Listar tareas | ✓ | ✓ | ✓ | ✓ |
| Completar tarea | ✓ | ✓ | ✓ | ✗ |
| Eliminar tarea | ✓ | ✓ | ✗ | ✗ |

---

## 7. Dependencias a Instalar

```bash
pnpm add jsonwebtoken bcryptjs
pnpm add -D @types/jsonwebtoken @types/bcryptjs
```

---

## 8. Pasos de Implementación (Orden Sugerido)

### Fase 1: Entidad User + Repository
1. Crear `src/domain/entities/user.ts` ✔
2. Crear `src/domain/repositories/user.repository.ts` ✔
3. Crear `src/infrastructure/persistence/models/user.schema.ts` ✔
4. Crear `src/infrastructure/persistence/repositories/typeorm-user.repository.ts` ✔

### Fase 2: Autenticación JWT
1. Crear `src/utils/jwt.util.ts`
2. Crear `src/middleware/auth.middleware.ts`
3. Crear `src/middleware/role.middleware.ts`
4. Crear `src/domain/use-cases/user/authenticate.use-case.ts`
5. Crear `src/controllers/user.controller.ts` (solo auth)
6. Agregar ruta `/auth/login` en server.ts

### Fase 3: CRUD Users + Auth
1. Crear use cases de usuario
2. Completar controller de usuario
3. Agregar rutas de users en server.ts

### Fase 4: Soft Delete en Task
1. Agregar `deletedAt` a `task.schema.ts`
2. Agregar `userId` a `task.schema.ts`
3. Actualizar `task.repository.ts` (interfaz)
4. Actualizar `typeorm-task.repository.ts`
5. Actualizar entity `task.ts`

### Fase 5: Tasks con Auth
1. Actualizar use cases de task
2. Actualizar controller de task
3. Proteger rutas con middleware

---

## 9. Configuración JWT

- **Expiración**: 12 horas
- **Algoritmo**: HS256
- **Payload**: `{ id, username, rol }`

---

## 10. Consideraciones Técnicas

- Password almacenado con bcrypt (hash + salt)
- JWT con expiración de 12 horas
- Soft delete: actualizar `deletedAt` en lugar de eliminar
- Queries deben filtrar `deletedAt: IsNull()`
- User tiene relación OneToMany con Task
- En tasks, guardar `userId` de quien creó
- Task belongsTo User (ManyToOne)

---

## 11. Migration de Base de Datos

La base de datos actual es SQLite. TypeORM puede crear las tablas automáticamente con las nuevas entidades.

**Tablas nuevas/actualizadas:**
- `user` (nueva)
- `task` (actualizar: agregar deletedAt, userId)

---

## 12. Notas

- El primer usuario admin debe crearse manualmente o via seed
- Las tareas existentes quedan sin userId (asignar a admin posteriormente si es necesario)
- Middleware de auth debe extraer user del token y agregarlo a req.user
