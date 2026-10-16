/**
 * Task Service Module
 * Student: Daksh Karangiya | Roll: 24CS038
 */

class TaskService {
  constructor() {
    this.tasks = [];
  }

  createTask({ title, priority = 'medium', description = '' }) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new Error('Validation Error: Task title is required');
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      throw new Error(`Validation Error: Invalid priority '${priority}'. Allowed: ${validPriorities.join(', ')}`);
    }

    const newTask = {
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      description: description.trim(),
      priority: priority.toLowerCase(),
      status: 'pending',
      studentRoll: '24CS038',
      createdAt: new Date().toISOString()
    };

    this.tasks.push(newTask);
    return newTask;
  }

  getTasks() {
    return [...this.tasks];
  }

  getTaskById(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error(`Task with id '${id}' not found`);
    return task;
  }

  completeTask(id) {
    const task = this.getTaskById(id);
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    return task;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Task with id '${id}' not found`);
    return this.tasks.splice(index, 1)[0];
  }

  clear() {
    this.tasks = [];
  }
}

module.exports = TaskService;
