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

**Despliegue del Esquema y Datos:**
  Ejecuta el script `DBSetup_TeamTasks.sql` incluido en este repositorio. Este script realiza lo siguiente:
  * Crea la base de datos `team_tasks_sample`.
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
   git clone git@github.com:alexisportillodev/TeamTasks.git
   cd TeamTasks/backend
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
   dotnet dev-certs https --trust
   dotnet run --launch-profile "https"
```

La API estará disponible en:
- HTTPS: `https://localhost:7078`
- HTTP: `http://localhost:5141`
- Swagger UI: `https://localhost:7078/swagger`

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
  "dueDate": "2026-02-15"
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

# Team Tasks Dashboard - Frontend

Aplicación web desarrollada en Angular 18 para gestión de proyectos y tareas.

## Características

- ✅ Dashboard interactivo con métricas en tiempo real
- ✅ Gestión de tareas por proyecto con filtros y paginación
- ✅ Formulario de creación de tareas con validaciones
- ✅ Gráficos de distribución de tareas
- ✅ Diseño responsive con Material Design
- ✅ Componentes standalone (sin NgModules)
- ✅ Signals para estado reactivo

## Tecnologías

- Angular 18
- Angular Material 18
- Chart.js + ng2-charts
- RxJS
- TypeScript
- SCSS

### 📦 Instalación

#### Requisitos Previos
- Node.js 18+ y npm
- Angular CLI 18
- Respositorio del proyecto, se descargó en la sección anterior

#### Pasos de Instalación
```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@18

# Navegar al proyecto (estar en la ruta base del proyecto /TeamTasks)
cd frontend

# Instalar dependencias
npm install
```

## Desarrollo
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## Build
```bash
ng build
```

Los archivos de build estarán en `dist/`

## Estructura del Proyecto
```
src/app/
├── core/                 # Servicios singleton y modelos
│   ├── models/
│   ├── services/
│   └── interceptors/
├── shared/               # Componentes, pipes y directivas reutilizables
│   ├── components/
│   ├── pipes/
│   ├── directives/
│   └── animations/
├── features/             # Módulos por funcionalidad
│   ├── dashboard/
│   ├── projects/
│   └── tasks/
└── app.component.ts
```

## Componentes Reutilizables

### DataTable Component
Tabla configurable con las siguientes características:
- Ordenamiento por columnas
- Formato personalizado de valores
- Estilos condicionales
- Resaltado de filas
- Eventos de click

**Uso:**
```typescript
import { DataTableComponent, TableColumn } from '@shared/components/data-table/data-table.component';

columns: TableColumn[] = [
  {
    key: 'name',
    label: 'Nombre',
    sortable: true
  },
  {
    key: 'status',
    label: 'Estado',
    format: (value) => value.toUpperCase(),
    cssClass: (value) => value === 'active' ? 'text-success' : 'text-danger'
  }
];
```

### Paginator Component
Paginación estándar con Material Design:
- Tamaños configurables (5, 10, 25, 50)
- Navegación entre páginas
- Información de totales

### TaskFilters Component
Filtros dinámicos para tareas:
- Filtro por estado (dropdown)
- Filtro por desarrollador (dropdown)
- Debounce de 300ms
- Botón de limpiar filtros

### LoadingSpinner Component
Indicador de carga centralizado con Material Spinner.

### TaskStatusChart Component
Gráfico de pie para distribución de tareas:
- Colores por estado
- Tooltips con porcentajes
- Responsive

### TaskDetail Component
Modal de detalle de tarea con Material Dialog:
- Información completa de la tarea
- Chips con colores para estado y prioridad
- Diseño responsive

### Footer Component
Footer informativo con año actual y tecnologías utilizadas.

## Pipes Personalizados

### StatusLabelPipe
Traduce estados de inglés a español:
```typescript
{{ 'InProgress' | statusLabel }}  // Output: "En Progreso"
```

### PriorityLabelPipe
Traduce prioridades de inglés a español:
```typescript
{{ 'High' | priorityLabel }}  // Output: "Alta"
```

## Directivas

### HighlightRiskDirective
Resalta elementos con alto riesgo:
```html
<div [appHighlightRisk]="item.highRiskFlag">Contenido</div>
```

## Servicios HTTP

### DeveloperService
```typescript
getAllDevelopers(): Observable<Developer[]>
getDeveloperById(id: number): Observable<Developer>
```

### ProjectService
```typescript
getAllProjects(): Observable<ProjectWithStats[]>
getProjectById(id: number): Observable<Project>
getProjectTasks(projectId, page, pageSize, status?, assigneeId?): Observable<PagedResult<Task>>
```

### TaskService
```typescript
createTask(taskDto: CreateTaskDto): Observable<Task>
updateTaskStatus(taskId: number, updateDto: UpdateTaskStatusDto): Observable<Task>
```

### DashboardService
```typescript
getDeveloperWorkload(): Observable<DeveloperWorkload[]>
getProjectHealth(): Observable<ProjectHealth[]>
getDeveloperDelayRisk(): Observable<DeveloperDelayRisk[]>
```

## Modelos TypeScript

### Developer
```typescript
interface Developer {
  developerId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isActive: boolean;
}
```

### Task
```typescript
interface Task {
  taskId: number;
  projectId: number;
  projectName: string;
  title: string;
  description?: string;
  assigneeId?: number;
  assigneeName?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedComplexity?: number;
  dueDate: string;
  completionDate?: string;
  createdAt: string;
}
```

### CreateTaskDto
```typescript
interface CreateTaskDto {
  projectId: number;
  title: string;
  description?: string;
  assigneeId?: number;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedComplexity?: number;
  dueDate: string;
}
```

## Configuración del Backend

### Variables de Entorno

**Desarrollo** (`src/environments/environment.development.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: '/api' // Usando proxy
};
```

**Producción** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.teamtasks.com/api'
};
```

### Proxy Configuration

El archivo `proxy.conf.json` redirige las llamadas `/api` al backend:
```json
{
  "/api": {
    "target": "https://localhost:7001",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## Scripts Útiles
```bash
# Desarrollo
npm start

# Desarrollo con proxy
ng serve --proxy-config proxy.conf.json

# Build de producción
npm run build

# Build con análisis de bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/team-tasks-dashboard/stats.json

# Tests unitarios
npm test

# Tests con cobertura
ng test --code-coverage

# Linting
npm run lint

# Formateo de código
npm run format
```

## Rutas de la Aplicación

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Redirect | Redirige a /dashboard |
| `/dashboard` | DashboardComponent | Vista principal con métricas |
| `/projects/:id/tasks` | ProjectTasksComponent | Tareas de un proyecto específico |
| `/tasks/new` | TaskFormComponent | Formulario de nueva tarea |

## Validaciones del Formulario

### CreateTask Form
- **Proyecto**: Requerido
- **Título**: Requerido, máximo 150 caracteres
- **Estado**: Requerido
- **Prioridad**: Requerido
- **Complejidad**: Opcional, entre 1-5
- **Fecha de Vencimiento**: Requerida, debe ser hoy o posterior

## Estilos Globales

### Clases de Utilidad
```scss
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.card { background: white; border-radius: 8px; box-shadow: ...; }
.text-center { text-align: center; }
.mt-1, .mt-2, .mt-3, .mt-4 { margin-top: 8px, 16px, 24px, 32px; }
.mb-1, .mb-2, .mb-3, .mb-4 { margin-bottom: 8px, 16px, 24px, 32px; }
```

### Clases de Estado
```scss
.status-todo { color: #9e9e9e; }
.status-inprogress { color: #2196f3; }
.status-blocked { color: #f44336; }
.status-completed { color: #4caf50; }
```

### Clases de Prioridad
```scss
.priority-low { color: #4caf50; }
.priority-medium { color: #ff9800; }
.priority-high { color: #f44336; }
```

### Clases de Riesgo
```scss
.risk-high { background-color: #ffebee; color: #c62828; }
.risk-normal { background-color: #e8f5e9; color: #2e7d32; }
```

## Interceptores HTTP

### HttpErrorInterceptor
Captura errores HTTP y los formatea:
- Errores del cliente (red, timeout)
- Errores del servidor (4xx, 5xx)
- Extrae mensajes del backend
- Logs en consola para debugging

## Animaciones

### FadeIn Animation
```typescript
import { fadeInAnimation } from '@shared/animations/fade-in.animation';

@Component({
  animations: [fadeInAnimation]
})

// En template:
<div [@fadeIn]>Contenido</div>
```

## Configuración de Path Aliases
```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@environments/*": ["src/environments/*"]
    }
  }
}
```

**Uso:**
```typescript
import { DeveloperService } from '@core/services';
import { DataTableComponent } from '@shared/components/data-table/data-table.component';
```

## Testing

### Ejecutar Tests
```bash
# Tests unitarios
ng test

# Tests con cobertura
ng test --code-coverage

# Tests en CI
ng test --watch=false --browsers=ChromeHeadless
```

### Estructura de Tests
```
src/app/
├── core/
│   └── services/
│       └── developer.service.spec.ts
├── shared/
│   └── components/
│       └── data-table/
│           └── data-table.component.spec.ts
└── features/
    └── dashboard/
        └── dashboard.component.spec.ts
```

## Build y Deploy

### Build de Producción
```bash
ng build --configuration production
```

Genera archivos optimizados en `dist/team-tasks-dashboard/`

### Configuración de Build
- Minificación activada
- Tree-shaking habilitado
- AOT compilation
- Output hashing para cache busting
- Source maps deshabilitados en producción

### Deploy
Los archivos de `dist/` pueden ser desplegados en:
- Firebase Hosting
- Netlify
- Vercel
- Azure Static Web Apps
- AWS S3 + CloudFront
- Nginx / Apache

## Troubleshooting

### Error de CORS
**Síntoma**: Errores de CORS en consola

**Solución**:
1. Verificar que el backend tenga CORS habilitado
2. Usar proxy en desarrollo (`proxy.conf.json`)
3. Verificar que la URL del backend sea correcta

### Error "Cannot find module"
**Síntoma**: Error al importar módulos

**Solución**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Chart.js no renderiza
**Síntoma**: Gráfico no se muestra

**Solución**:
1. Verificar que Chart.js esté registrado en `main.ts`
2. Verificar que los datos no estén vacíos
3. Revisar consola por errores

### Build falla por bundle size
**Síntoma**: Error "budgets exceeded"

**Solución**:
1. Analizar bundle: `ng build --stats-json`
2. Lazy loading de módulos pesados
3. Optimizar imports (usar imports específicos)

## Buenas Prácticas Implementadas

✅ **Standalone Components**: Sin NgModules, usando imports directos
✅ **Signals**: Estado reactivo moderno de Angular
✅ **Dependency Injection**: Usando `inject()` function
✅ **Typed Forms**: FormGroup con tipado fuerte
✅ **Lazy Loading**: Rutas con loadComponent
✅ **Error Handling**: Interceptor global + manejo local
✅ **Responsive Design**: Mobile-first approach
✅ **Accessibility**: Uso de ARIA labels y semántica HTML5
✅ **Performance**: OnPush change detection donde aplica
✅ **Code Organization**: Separación clara de responsabilidades

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feat/nueva-funcionalidad`)
3. Commit tus cambios siguiendo convenciones (`git commit -m "feat(dashboard): agregar nueva métrica"`)
4. Push a la rama (`git push origin feat/nueva-funcionalidad`)
5. Abre un Pull Request

## Convenciones de Commits

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

**Ejemplo:** `feat(tasks): agregar filtro por fecha de creación`

## Licencia

Este proyecto es un ejemplo educativo de arquitectura de software.

## Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

---

**Desarrollado con ❤️ usando Angular 18**

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
