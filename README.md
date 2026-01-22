# Team Tasks Dashboard

Aplicación web para la gestión de proyectos de software, enfocada en la visualización de carga de trabajo, estado de proyectos y predicción de riesgos de retraso en desarrolladores.

## 📋 Descripción del Proyecto

El objetivo es desarrollar un dashboard interactivo que permita a los Project Managers visualizar:
* Estado actual de las tareas y proyectos.
* Carga de trabajo por desarrollador.
* **Predicción de riesgos:** Un algoritmo basado en el historial de tiempos de entrega para predecir si un desarrollador terminará a tiempo sus tareas actuales.

## 🛠️ Stack Tecnológico

* **Base de Datos:** PostgreSQL 16+ (Estándar `snake_case`, Esquema `core`)
* **Backend:** .NET 8 WebAPI
  * Patrón Repository + Unit of Work
  * Entity Framework Core 8 con Npgsql
  * AutoMapper para DTOs
  * FluentValidation para validaciones
  * Swagger/OpenAPI para documentación
* **Frontend:** Angular 18 (Standalone Components, Signals)
* **Herramientas:** pgAdmin, Visual Studio 2022 / VS Code, Postman

---

## 🗄️ Base de Datos

El proyecto utiliza **PostgreSQL**. Se ha optado por separar las tablas del sistema en un esquema personalizado llamado `core`.

### Estructura de Tablas (Esquema `core`)

1.  **developers:** Información de los desarrolladores (activos/inactivos).
2.  **projects:** Proyectos gestionados (Planned, InProgress, Completed).
3.  **tasks:** Tareas asociadas a proyectos y desarrolladores, incluyendo métricas de complejidad y prioridad.

### 🚀 Configuración Inicial (Local)

Para levantar la base de datos, sigue estos pasos estrictos usando tu cliente SQL (pgAdmin):

1.  **Crear la Base de Datos:**
    Ejecuta el siguiente comando conectado a tu servidor local:
```sql
    CREATE DATABASE team_tasks_sample;
```

2.  **Conexión:**
    Cambia tu conexión en pgAdmin para apuntar a la nueva base de datos `team_tasks_sample`.

3.  **Despliegue del Esquema y Datos:**
    Ejecuta el script `DBSetup_TeamTasks.sql` incluido en este repositorio. Este script realiza lo siguiente:
    * Crea el esquema `core`.
    * Establece el `search_path`.
    * Crea las tablas con integridad referencial.
    * Inserta datos semilla (5 devs, 3 proyectos, 20 tareas).

---

## 🧠 Lógica de Negocio (Documentación SQL)

El sistema implementa lógica avanzada directamente validada en base de datos antes de pasar a la capa de aplicación.

### 1. Developer Delay Risk Prediction (Riesgo de Retraso)
Calculamos el riesgo de que un desarrollador no cumpla con sus entregas basándonos en su historial.

**Fórmula:**
* **AvgDelayDays:** Promedio de días de retraso en tareas completadas (`CompletionDate - DueDate`). Si terminó antes, cuenta como 0.
* **PredictedCompletionDate:** `LatestDueDate` (de tareas abiertas) + `AvgDelayDays`.
* **HighRiskFlag (Alerta):** Se activa (1) si:
    * La fecha predicha es mayor a la fecha límite real.
    * O el promedio de retraso histórico es >= 3 días.

### 2. Métricas de Dashboard
* **Carga de Trabajo:** Tareas abiertas y complejidad promedio por desarrollador.
* **Salud de Proyecto:** Comparativa de tareas totales vs. completadas.
* **Próximos Vencimientos:** Tareas que vencen en los próximos 7 días (filtro dinámico `CURRENT_DATE + INTERVAL '7 days'`).

---

## 💻 Backend (.NET 8)

### 🏗️ Arquitectura

El backend sigue el patrón **Clean Architecture** con separación en capas:
```
TeamTasksManager/
├── TeamTasksManager.API/          # Capa de presentación (Controllers, Middleware)
├── TeamTasksManager.Application/  # Lógica de negocio (Services, DTOs, Validators)
├── TeamTasksManager.Domain/        # Entidades de dominio (Entities, Interfaces)
└── TeamTasksManager.Infrastructure/ # Acceso a datos (DbContext, Repositories)
```

### 📦 Instalación

#### Requisitos Previos
- .NET 8 SDK
- PostgreSQL 16+ instalado y corriendo
- Base de datos `team_tasks_sample` configurada (ver sección anterior)

#### Pasos de Instalación

1. **Clonar el repositorio**
```bash
   git clone <url-del-repositorio>
   cd TeamTasksManager
```

2. **Restaurar paquetes NuGet**
```bash
   dotnet restore
```

3. **Configurar la cadena de conexión**
   
   Edita `TeamTasksManager.API/appsettings.json`:
```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=team_tasks_sample;Username=TU_USUARIO;Password=TU_PASSWORD;SearchPath=core"
     }
   }
```

4. **Compilar la solución**
```bash
   dotnet build
```

5. **Ejecutar la API**
```bash
   cd TeamTasksManager.API
   dotnet run
```

La API estará disponible en:
- HTTPS: `https://localhost:7xxx`
- HTTP: `http://localhost:5xxx`
- Swagger UI: `https://localhost:7xxx/swagger`

### 🔌 Endpoints API

#### Developers

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/developers` | Obtiene todos los desarrolladores activos |
| GET | `/api/developers/{id}` | Obtiene un desarrollador por ID |

#### Projects

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/projects` | Obtiene todos los proyectos con estadísticas |
| GET | `/api/projects/{id}` | Obtiene un proyecto por ID |
| GET | `/api/projects/{id}/tasks` | Obtiene tareas del proyecto (paginado + filtros) |

**Parámetros de Query para `/api/projects/{id}/tasks`:**
- `page` (int, default: 1) - Número de página
- `pageSize` (int, default: 10, max: 100) - Tamaño de página
- `status` (string, opcional) - Filtrar por estado (ToDo, InProgress, Blocked, Completed)
- `assigneeId` (int, opcional) - Filtrar por desarrollador asignado

#### Tasks

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/tasks` | Crea una nueva tarea |
| PUT | `/api/tasks/{id}/status` | Actualiza el estado de una tarea |

**Ejemplo de Request Body para `POST /api/tasks`:**
```json
{
  "projectId": 1,
  "title": "Implementar autenticación",
  "description": "Agregar JWT authentication",
  "assigneeId": 1,
  "status": "ToDo",
  "priority": "High",
  "estimatedComplexity": 4,
  "dueDate": "2025-02-15"
}
```

#### Dashboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard/developer-workload` | Carga de trabajo por desarrollador |
| GET | `/api/dashboard/project-health` | Estado de salud de proyectos |
| GET | `/api/dashboard/developer-delay-risk` | Análisis de riesgo de retraso |

### 🧪 Validaciones Implementadas

El sistema implementa validaciones robustas usando **FluentValidation**:

**CreateTaskDto:**
- `ProjectId`: Debe existir en la base de datos
- `Title`: Requerido, máximo 150 caracteres
- `Status`: Valores permitidos: ToDo, InProgress, Blocked, Completed
- `Priority`: Valores permitidos: Low, Medium, High
- `EstimatedComplexity`: Entre 1 y 5 (si se proporciona)
- `DueDate`: Debe ser hoy o posterior
- `AssigneeId`: Debe existir en la base de datos (si se proporciona)

**UpdateTaskStatusDto:**
- `Status`: Valores permitidos: ToDo, InProgress, Blocked, Completed
- `Priority`: Valores permitidos: Low, Medium, High (si se proporciona)
- `EstimatedComplexity`: Entre 1 y 5 (si se proporciona)

### 🔒 Características de Seguridad

- CORS configurado para localhost:4200 (Angular dev server)
- Manejo global de excepciones con middleware personalizado
- Validación de datos en múltiples capas
- Respuestas API estandarizadas con formato consistente
- Logging de errores con ILogger

### 🛠️ Tecnologías y Patrones Implementados

- **Repository Pattern + Unit of Work**: Abstracción del acceso a datos
- **Dependency Injection**: Inyección de dependencias nativa de .NET
- **AutoMapper**: Mapeo automático entre entidades y DTOs
- **FluentValidation**: Validaciones declarativas y expresivas
- **EFCore.NamingConventions**: Conversión automática PascalCase <-> snake_case
- **Middleware Pipeline**: Manejo centralizado de errores
- **Async/Await**: Operaciones asíncronas para mejor rendimiento

---

## 🎨 Frontend (Angular 18)

### 📦 Instalación

*(Próximamente - En desarrollo)*

#### Requisitos Previos
- Node.js 18+ y npm
- Angular CLI 18

#### Pasos de Instalación
```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@18

# Crear el proyecto
ng new team-tasks-dashboard --standalone --routing --style=scss

# Navegar al proyecto
cd team-tasks-dashboard

# Instalar dependencias
npm install
```

### 🧩 Características Planificadas

- Standalone Components (sin NgModules)
- Signals para manejo de estado reactivo
- Angular Material para componentes UI
- Reactive Forms para formularios
- HttpClient con interceptors
- Componentes reutilizables (tabla, filtros)
- Chart.js para visualizaciones
- Responsive design con CSS Grid/Flexbox

### 📱 Vistas Planificadas

1. **Dashboard (Home)**
   - Tabla de carga por desarrollador
   - Tabla de estado por proyecto
   - Tabla de riesgo de retraso

2. **Tareas por Proyecto**
   - Vista detallada de tareas
   - Filtros por estado y desarrollador
   - Paginación

3. **Formulario de Nueva Tarea**
   - Validación en tiempo real
   - Integración con API

---

## 🧪 Testing

### Backend
```bash
# Ejecutar tests unitarios
dotnet test
```

### Frontend
```bash
# Ejecutar tests unitarios
ng test

# Ejecutar tests end-to-end
ng e2e
```

---

## 📚 Documentación Adicional

### Swagger/OpenAPI
La documentación interactiva de la API está disponible en:
- Desarrollo: `https://localhost:7xxx/swagger`

### Convenciones de Código

#### Git Commits
El proyecto sigue la convención de commits semánticos:

| Tipo | Descripción |
|------|-------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Documentación |
| `style` | Formato (espacios, punto y coma) |
| `refactor` | Refactorización sin cambiar funcionalidad |
| `perf` | Mejora de rendimiento |
| `test` | Agregar o modificar tests |
| `build` | Cambios en build, dependencias |
| `ci` | Cambios en pipelines |
| `chore` | Tareas menores (config, scripts) |
| `revert` | Revertir commit |

**Ejemplo:** `feat(api): crear endpoint para registro de usuarios`

---

## 🚀 Roadmap

- [x] Configuración de base de datos PostgreSQL
- [x] Modelo de datos y scripts SQL
- [x] Backend .NET 8 con Repository Pattern
- [x] DTOs y AutoMapper
- [x] Servicios de aplicación
- [x] Controllers y endpoints REST
- [x] Validaciones con FluentValidation
- [x] Manejo global de errores
- [x] Swagger/OpenAPI documentation
- [ ] Frontend Angular 18
- [ ] Componentes reutilizables
- [ ] Dashboard interactivo
- [ ] Gestión de tareas
- [ ] Formularios con validación
- [ ] Gráficos y visualizaciones
- [ ] Testing unitario (backend)
- [ ] Testing unitario (frontend)
- [ ] Testing de integración
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 👥 Contribución

Este proyecto es educativo. Si deseas contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feat/nueva-funcionalidad`)
3. Commit tus cambios siguiendo las convenciones
4. Push a la rama (`git push origin feat/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es un ejemplo educativo de arquitectura de software paso a paso.

---

## 📞 Contacto

Para preguntas o sugerencias sobre el proyecto, abre un issue en el repositorio.

---

## 🙏 Agradecimientos

- Arquitectura basada en Clean Architecture y Domain-Driven Design
- Inspirado en mejores prácticas de desarrollo .NET y Angular
