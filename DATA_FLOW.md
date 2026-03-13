# Flujo de Datos en Clean Architecture

## Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PRESENTACIÓN (Controllers)                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      TaskController                              │    │
│  │   - Recibe HTTP Request                                          │    │
│  │   - Coordina Use Cases                                           │    │
│  │   - Devuelve HTTP Response                                       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    APLICACIÓN (Use Cases / Casos de Uso)                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ CreateTask   │ │ GetTask      │ │ CompleteTask │ │ DeleteTask   │   │
│  │ UseCase      │ │ UseCase      │ │ UseCase      │ │ UseCase      │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│         │                │                │                │            │
│         └────────────────┴────────────────┴────────────────┘            │
│                          │                                              │
│                    -lgica de negocio                                    │
│                    -orquestar pasos                                     │
│                    -no conoce HTTP/DB                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DOMINIO (Entities + Interfaces)                 │
│  ┌────────────────────────────────┐  ┌────────────────────────────┐     │
│  │           Task                 │  │    TaskRepository          │     │
│  │  - id: number                  │  │    (Interfaz)              │     │
│  │  - title: string              │  │  + findAll(): Promise      │     │
│  │  - completed: boolean          │  │  + findById(): Promise     │     │
│  │  + complete()                 │  │  + create(): Promise       │     │
│  │  + getTitle()                 │  │  + update(): Promise       │     │
│  └────────────────────────────────┘  │  + delete(): Promise       │     │
│                                       └────────────────────────────┘     │
│         │                                    │                           │
│         └────────────────┬───────────────────┘                           │
│                          │                                               │
│                    -entidades puras                                      │
│                    -reglas de negocio                                   │
│                    -interfaces (contratos)                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA (Implementaciones)                    │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    TypeORMTaskRepository                         │    │
│  │  - Implementa TaskRepository (interfaz del dominio)             │    │
│  │  - Usa TypeORM para comunicar con la DB                          │    │
│  │  - Convierte entre Entity <-> Schema DB                          │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                    │                                     │
│                                    ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    AppDataSource (TypeORM)                       │    │
│  │  - Conexin a SQLite                                               │    │
│  │  - Configuracin de entidades                                     │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                           ┌───────────────┐
                           │   SQLite DB   │
                           └───────────────┘
```

## Flujo de una Solicitud (Ejemplo: Crear Tarea)

```
Cliente                 Express              Controller              UseCase              Repository              DB
  │                      │                      │                      │                      │                      │
  │  POST /tasks         │                      │                      │                      │                      │
  │  { title: "..." }    │                      │                      │                      │                      │
  │─────────────────────>│                      │                      │                      │                      │
  │                      │                      │                      │                      │                      │
  │                      │  taskController     │                      │                      │                      │
  │                      │         .create()    │                      │                      │                      │
  │                      │─────────────────────>│                      │                      │                      │
  │                      │                      │                      │                      │                      │
  │                      │                      │ new CreateTask       │                      │                      │
  │                      │                      │     .useCase()       │                      │                      │
  │                      │                      │─────────────────────>│                      │                      │
  │                      │                      │                      │                      │                      │
  │                      │                      │              Crea objeto Task           │                      │
  │                      │                      │              (valida title)             │                      │
  │                      │                      │                      │                      │                      │
  │                      │                      │         repository   │                      │                      │
  │                      │                      │           .create() │                      │                      │
  │                      │                      │─────────────────────>│                      │                      │
  │                      │                      │                      │                      │                      │
  │                      │                      │                      │  INSERT INTO tasks  │                      │
  │                      │                      │                      │─────────────────────>│                      │
  │                      │                      │                      │                      │                      │
  │                      │                      │                      │        [tarea        │                      │
  │                      │                      │                      │         creada]      │                      │
  │                      │                      │                      │<─────────────────────│                      │
  │                      │                      │                      │                      │                      │
  │                      │              [tarea]│                      │                      │                      │
  │                      │              <───────│                      │                      │                      │
  │                      │                      │                      │                      │                      │
  │              [tarea] │                      │                      │                      │                      │
  │              <───────│                      │                      │                      │                      │
  │                      │                      │                      │                      │                      │
  │   201 Created        │                      │                      │                      │                      │
  │   { id: 1, ... }    │                      │                      │                      │                      │
  │<─────────────────────│                      │                      │                      │                      │
```

## Principio de Dependencias

```
El flujo de control va de afuera hacia adentro:
  HTTP Request → Controller → UseCase → Entity

Las dependencias van de afuera hacia adentro (solo hacia capas ms internas):
  Controller依赖UseCase
  UseCase依赖Entity + Repository Interface
  Repository Implementation依赖Repository Interface + TypeORM
```

## Reglas Clave

1. **Las capas internas no conocen las capas externas**
   - Los Use Cases NO saben que existen los Controllers
   - Las Entities NO saben que existe TypeORM o SQLite

2. **Las dependencias van hacia el centro**
   - El Repository concreto depende de la interfaz del dominio
   - El Controller depende de los Use Cases

3. **La infraestructura es un detalle de implementacin**
   - Se puede cambiar SQLite por PostgreSQL sin modificar dominio/use-cases

## Archivos del Proyecto por Capa

```
src/
├── controllers/           # PRESENTACIN
│   └── task.controller.ts
│
├── domain/                # DOMINIO (ncleo, sin dependencias externas)
│   ├── entities/
│   │   └── task.ts       # Entidad con reglas de negocio
│   ├── repositories/
│   │   └── task.repository.ts  # Interfaz (contrato)
│   └── use-cases/
│       └── task/
│           ├── create-task.use-case.ts
│           ├── get-task.use-case.ts
│           ├── complete-task.use-case.ts
│           └── delete-task.use-case.ts
│
├── infrastructure/       # INFRAESTRUCTURA
│   └── persitence/
│       ├── config/
│       │   └── data-source.ts       # TypeORM config
│       ├── models/
│       │   └── task.schema.ts       # Schema DB
│       └── repositories/
│           └── typeorm-task.repository.ts  # Implementacin
│
└── server.ts              # PUNTO DE ENTRADA
```
