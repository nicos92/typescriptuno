# AGENTS.md - Guías de Desarrollo para Este Repositorio

## Visión General del Proyecto

Esta es una API REST TypeScript/Express que sigue principios de Arquitectura Limpia con:
- **Controladores** (`src/controllers/`) - Manejadores de rutas Express
- **Capa de Dominio** (`src/domain/`) - Lógica de negocio, entidades, interfaces de repositorios, casos de uso
- **Infraestructura** (`src/infrastructure/persitence/`) - Implementaciones de base de datos TypeORM
- **Base de datos**: SQLite con TypeORM ORM

## Comandos

```bash
# Instalar dependencias (requiere pnpm - enforced via preinstall)
pnpm install

# Servidor de desarrollo (hot-reload)
pnpm dev

# Compilar TypeScript
pnpm build

# Iniciar servidor de producción
pnpm start
```

**Nota**: Este proyecto usa exclusivamente `pnpm`. El script `preinstall` bloquea otros package managers.

## Guías de Estilo de Código

### TypeScript y Configuración
- Target: ES6, Módulo: CommonJS
- **Modo estricto deshabilitado** (`strict: false` en tsconfig.json)
- Decoradores habilitados para TypeORM (`experimentalDecorators`, `emitDecoratorMetadata`)
- Siempre importar reflect-metadata antes de usar decoradores: `import "reflect-metadata"`

### Convenciones de Importación
- Usar imports relativos (ej., `import { Task } from "../entities/task"`)
- Agrupar imports lógicamente; Express primero, luego dominio, luego infraestructura
- Usar comillas dobles para literales de string

### Convenciones de Nomenclatura
- **Clases**: PascalCase (ej., `TaskController`, `CreateTaskUseCase`)
- **Métodos/Variables**: camelCase (ej., `getAll`, `execute`, `taskRepository`)
- **Archivos**: kebab-case (ej., `task.controller.ts`, `typeorm-task.repository.ts`)
- **Constantes**: SCREAMING_SNAKE_CASE para valores de configuración

### Formato
- Usar **2 espacios** para indentación (sin tabs)
- **Sin punto y coma** al final de sentencias
- Llave de apertura en la misma línea
- Usar punto y coma en propiedades de parámetros del constructor cuando sea necesario
- Una línea en blanco entre grupos de imports y definición de clase

### Estructura de Clase
```typescript
export class TaskController {
    private repository: TaskRepository
    private getTaskUseCase: GetTaskUseCase

    constructor(repository: TaskRepository){
        this.repository = repository
        this.getTaskUseCase = new GetTaskUseCase(repository)
    }

    async getAll(req: Request, res: Response) {
        // implementación
    }
}
```

### Manejo de Errores
- Usar try/catch en controladores
- Mapear errores a códigos de estado HTTP apropiados:
  - `400` - Bad Request (errores de validación)
  - `404` - Not Found (recurso no existe)
  - `500` - Internal Server Error (captura todo)
- Retornar mensajes de error como JSON: `{ message: error.message }`
- Lanzar errores en entidades/casos de uso con mensajes descriptivos en español
- Manejar errores tanto síncronos como asíncronos

### Patrón Repositorio
- Definir interfaces de repositorio en `src/domain/repositories/`
- Implementar repositorios concretos en `src/infrastructure/persitence/repositories/`
- Usar inyección de dependencias vía constructor

### Casos de Uso
- Una clase por caso de uso en `src/domain/use-cases/[entidad]/`
- Método execute toma parámetros de entrada, retorna Promise
- Casos de uso no deben conocer detalles de HTTP/transporte

### Guías de Entidad
- Usar métodos getter en lugar de acceso directo a propiedades
- Validar en constructor, lanzar errores descriptivos
- Métodos de lógica de negocio en la entidad (ej., `task.complete()`)

### Base de Datos (TypeORM)
- Clases de entidad usan decoradores: `@Entity()`, `@PrimaryGeneratedColumn()`, `@Column()`
- Métodos de repositorio deben ser async (retornar Promises)
- Inicializar data source antes de iniciar el servidor

### Convenciones de API
- Endpoints RESTful
- GET `/tasks` - listar todos
- POST `/tasks` - crear
- PATCH `/tasks/:id/complete` - marcar como completado
- DELETE `/tasks/:id` - eliminar

### Middleware
- Usar middleware incorporado de Express: `express.json()`, `morgan("dev")`, `compression()`
- Cuerpo de request parseado vía `req.body`

## Flujo de Desarrollo

1. **Iniciar servidor dev**: `pnpm dev`
2. **Compilar para producción**: `pnpm build && pnpm start`
3. **Base de datos**: Archivo SQLite en raíz del proyecto (`database.sqlite`)

## Patrones Comunes

### Patrón de Método de Controlador
```typescript
async methodName(req: Request, res: Response) {
    try {
        const result = await this.useCase.execute(input);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
```

### Patrón de Caso de Uso
```typescript
export class CreateTaskUseCase {
    private repository: TaskRepository

    constructor(repository: TaskRepository){
        this.repository = repository
    }

    async execute(input: string){
        const entity = new Entity(input)
        return await this.repository.create(entity)
    }
}
```

## Notas

- Esta es una API de tareas mínima - sin autenticación/autorización
- Mensajes de error en español en la capa de dominio
- No hay herramientas de linting o testing configuradas (sientete libre de agregar ESLint/Jest)
