-- 2. Base de datos
-- 2.1 Script DBSetup_TeamTasks.sql
-- 2.1.1. Crear la base de datos TeamTasksSample.
-- Crear base de datos
CREATE DATABASE team_tasks_sample;

-- Crear esquema personalizado
CREATE SCHEMA IF NOT EXISTS core;

-- Establecer el esquema por defecto para esta sesión
SET search_path TO core;

-- 2.1.2. Crear esquemas y tablas requeridas
CREATE TABLE core.developers (
    developer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE core.projects (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) CHECK (status IN ('Planned', 'InProgress', 'Completed')) NOT NULL
);

CREATE TABLE core.tasks (
    task_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES core.projects(project_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    assignee_id INTEGER REFERENCES core.developers(developer_id),
    status VARCHAR(20) CHECK (status IN ('ToDo', 'InProgress', 'Blocked', 'Completed')) NOT NULL,
    priority VARCHAR(10) CHECK (priority IN ('Low', 'Medium', 'High')) NOT NULL,
    estimated_complexity INTEGER CHECK (estimated_complexity BETWEEN 1 AND 5),
    due_date DATE NOT NULL,
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.1.3. Insertar datos de prueba mínimos.
INSERT INTO core.developers (first_name, last_name, email) VALUES
('Juan', 'Perez', 'juan.perez@dev.com'),
('Maria', 'Garcia', 'maria.garcia@dev.com'),
('Carlos', 'Rodriguez', 'carlos.rod@dev.com'),
('Ana', 'Martinez', 'ana.mtz@dev.com'),
('Luis', 'Sanchez', 'luis.sanchez@dev.com');

INSERT INTO core.projects (name, client_name, start_date, status) VALUES
('E-Commerce Platform', 'Retail Co.', '2025-01-01', 'InProgress'),
('Mobile Banking App', 'Global Bank', '2025-02-15', 'Planned'),
('Internal HR System', 'Our Corp', '2024-11-01', 'InProgress');

-- Tareas de ejemplo con fechas variadas para probar el "Delay Risk" luego
INSERT INTO core.tasks (project_id, title, assignee_id, status, priority, estimated_complexity, due_date, completion_date) VALUES
(1, 'Database Design', 1, 'Completed', 'High', 3, '2025-01-10', '2025-01-08'),
(1, 'API Auth', 2, 'InProgress', 'High', 4, '2025-02-28', NULL),
(1, 'Cart Logic', 1, 'InProgress', 'High', 5, '2025-03-01', NULL),
(3, 'Bug Login', 2, 'Completed', 'High', 2, '2024-11-15', '2024-11-20'), -- Retraso de 5 días
(2, 'Kickoff', 3, 'Completed', 'Low', 1, '2025-02-16', '2025-02-16');

-- 2.2 Consultas requeridas (DML)
-- 2.2.1 Resumen de carga por desarrollador (solo desarrolladores activos)
SELECT 
    d.first_name || ' ' || d.last_name AS developer_name,
    COUNT(t.task_id) AS open_tasks_count,
    ROUND(AVG(t.estimated_complexity), 2) AS average_estimated_complexity
FROM core.developers d
LEFT JOIN core.tasks t ON d.developer_id = t.assignee_id AND t.status <> 'Completed'
WHERE d.is_active = TRUE
GROUP BY d.developer_id, d.first_name, d.last_name;

-- 2.2.2 Resumen de estado por proyecto
SELECT 
    p.name AS project_name,
    COUNT(t.task_id) AS total_tasks,
    COUNT(t.task_id) FILTER (WHERE t.status <> 'Completed') AS open_tasks,
    COUNT(t.task_id) FILTER (WHERE t.status = 'Completed') AS completed_tasks
FROM core.projects p
LEFT JOIN core.tasks t ON p.project_id = t.project_id
GROUP BY p.project_id, p.name;

-- 2.2.3 Tareas próximas a vencer
SELECT 
    t.task_id,
    p.name AS project_name,
    t.title,
    d.first_name || ' ' || d.last_name AS assignee_name,
    t.due_date,
    t.priority
FROM core.tasks t
JOIN core.projects p ON t.project_id = p.project_id
LEFT JOIN core.developers d ON t.assignee_id = d.developer_id
WHERE t.status <> 'Completed' 
  AND t.due_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
ORDER BY t.due_date ASC;

-- 2.2.4 Insertar nueva tarea
CREATE OR REPLACE FUNCTION core.insert_task(
    p_project_id INT,
    p_title VARCHAR,
    p_description TEXT,
    p_assignee_id INT,
    p_status VARCHAR,
    p_priority VARCHAR,
    p_complexity INT,
    p_due_date DATE
) RETURNS VOID AS $$
BEGIN
    -- Validar Proyecto
    IF NOT EXISTS (SELECT 1 FROM core.projects WHERE project_id = p_project_id) THEN
        RAISE EXCEPTION 'El proyecto con ID % no existe.', p_project_id;
    END IF;

    -- Validar Desarrollador
    IF NOT EXISTS (SELECT 1 FROM core.developers WHERE developer_id = p_assignee_id) THEN
        RAISE EXCEPTION 'El desarrollador con ID % no existe.', p_assignee_id;
    END IF;

    INSERT INTO core.tasks (project_id, title, description, assignee_id, status, priority, estimated_complexity, due_date)
    VALUES (p_project_id, p_title, p_description, p_assignee_id, p_status, p_priority, p_complexity, p_due_date);
END;
$$ LANGUAGE plpgsql;

-- 2.3 Developer Delay Risk Prediction (SQL avanzado)
WITH developer_stats AS (
    SELECT 
        d.developer_id,
        d.first_name || ' ' || d.last_name AS developer_name,
        -- Conteo de tareas abiertas
        COUNT(t.task_id) FILTER (WHERE t.status <> 'Completed') AS open_tasks_count,
        -- Promedio de retraso en tareas completadas (en días)
        COALESCE(AVG(
            CASE 
                WHEN t.completion_date > t.due_date THEN t.completion_date - t.due_date 
                ELSE 0 
            END
        ) FILTER (WHERE t.status = 'Completed'), 0) AS avg_delay_days,
        -- Fechas críticas de tareas abiertas
        MIN(t.due_date) FILTER (WHERE t.status <> 'Completed') AS nearest_due_date,
        MAX(t.due_date) FILTER (WHERE t.status <> 'Completed') AS latest_due_date
    FROM core.developers d
    LEFT JOIN core.tasks t ON d.developer_id = t.assignee_id
    WHERE d.is_active = TRUE
    GROUP BY d.developer_id, d.first_name, d.last_name
)
SELECT 
    developer_name,
    open_tasks_count,
    ROUND(avg_delay_days, 1) AS avg_delay_days,
    nearest_due_date,
    latest_due_date,
    (latest_due_date + (avg_delay_days * INTERVAL '1 day'))::DATE AS predicted_completion_date,
    CASE 
        WHEN (latest_due_date + (avg_delay_days * INTERVAL '1 day')) > latest_due_date 
             OR avg_delay_days >= 3 THEN 1 
        ELSE 0 
    END AS high_risk_flag
FROM developer_stats;
