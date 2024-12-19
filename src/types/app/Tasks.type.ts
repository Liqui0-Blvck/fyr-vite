// Tipo para los estados de la tarea
type TaskStatus = 'pending' | 'inProgress' | 'completed' | 'canceled' | 'onHold';

// Tipo para las prioridades de la tarea
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

// Tipo para los roles de los usuarios asignados a una tarea
type TaskAssigneeRole = 'admin' | 'manager' | 'executive' | 'guest';

// Tipo para los comentarios en una tarea
export interface TaskComment {
  id: string; // ID único del comentario
  userId: string; // ID del usuario que hizo el comentario
  text: string; // Texto del comentario
  createdAt: string; // Fecha de creación del comentario
}

// Tipo para el historial de cambios en una tarea
export interface TaskHistory {
  changedBy: string; // ID del usuario que realizó el cambio
  field: string; // Campo que fue modificado
  oldValue: string | number | boolean | null; // Valor anterior
  newValue: string | number | boolean | null; // Nuevo valor
  changedAt: string ; // Fecha del cambio
}

// Tipo para una subtarea
export interface SubTask {
  id: string; // ID único de la subtarea
  title: string; // Título de la subtarea
  status: TaskStatus; // Estado de la subtarea
  assignedTo: {
    userId: string; // ID del usuario asignado
    role: TaskAssigneeRole; // Rol del usuario asignado
  } | null; // Puede no estar asignada inicialmente
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de última actualización
}

// Tipo principal para la tarea
export interface Task {
  id: string; // Identificador único de la tarea
  title: string; // Título de la tarea
  description?: string; // Descripción detallada (opcional)
  status: TaskStatus; // Estado actual de la tarea
  priority: TaskPriority; // Prioridad de la tarea
  dueDate: string |  null; // Fecha límite para completar la tarea
  createdAt: string ; // Fecha de creación
  updatedAt: string; // Fecha de última actualización
  assignedTo: {
    userId: string; // ID del usuario asignado
    role?: TaskAssigneeRole; // Rol del usuario asignado
  } | null; // Puede no estar asignada inicialmente
  relatedTo?: 'prospect' | 'client' | null; // Relación con un prospecto o cliente (opcional)
  tags?: string[]; // Etiquetas para clasificar la tarea
  comments?: TaskComment[]; // Lista de comentarios en la tarea
  history?: TaskHistory[]; // Historial de cambios en la tarea
  subtasks?: SubTask[]; // Lista de subtareas
  attachments?: string[]; // Archivos adjuntos relacionados con la tarea
  reminders?: {
    reminderAt: string ; // Fecha y hora del recordatorio
    notifiedUsers: string[]; // IDs de usuarios notificados
  }[]; // Lista de recordatorios
  columnId?: string; // ID de la columna a la que pertenece la tarea
}
