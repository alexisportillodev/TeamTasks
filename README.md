# Team Tasks Dashboard

Aplicación web para la gestión de proyectos de software, enfocada en la visualización de carga de trabajo, estado de proyectos y predicción de riesgos de retraso en desarrolladores.

## 📋 Descripción del Proyecto

El objetivo es desarrollar un dashboard interactivo que permita a los Project Managers visualizar:
* Estado actual de las tareas y proyectos.
* Carga de trabajo por desarrollador.
* **Predicción de riesgos:** Un algoritmo basado en el historial de tiempos de entrega para predecir si un desarrollador terminará a tiempo sus tareas actuales.

## 🛠️ Stack Tecnológico

* **Base de Datos:** PostgreSQL (Estándar `snake_case`, Esquema `core`).
* **Backend:** .NET 8 WebAPI (Patrón Repository, Entity Framework Core).
* **Frontend:** Angular 18 (Standalone Components, Signals).
* **Herramientas:** pgAdmin, Visual Studio / VS Code.

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
    * O el promedio de retraso histórico es ≥ 3 días.

### 2. Métricas de Dashboard
* **Carga de Trabajo:** Tareas abiertas y complejidad promedio por desarrollador.
* **Salud de Proyecto:** Comparativa de tareas totales vs. completadas.
* **Próximos Vencimientos:** Tareas que vencen en los próximos 7 días (filtro dinámico `CURRENT_DATE + INTERVAL '7 days'`).

---

## 💻 Instalación y Ejecución (Próximamente)

### Backend (.NET 8)
*(Instrucciones pendientes tras la creación de la API)*

### Frontend (Angular 18)
*(Instrucciones pendientes tras la creación de la SPA)*

---

## 📄 Licencia
Este proyecto es un ejemplo educativo de arquitectura de software paso a paso.
