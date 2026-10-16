/**
 * Automated Test Suite for Task Management Application (Passing Suite)
 * Framework: Node.js native test runner (node:test & node:assert)
 * Student: Daksh Karangiya | Roll: 24CS038
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const TaskService = require('../src/taskService');

describe('Task Management CI Test Suite (Author: Daksh Karangiya / 24CS038)', () => {
  let taskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  it('1. Should create a valid task with pending status and student roll 24CS038', () => {
    const task = taskService.createTask({
      title: 'Configure GitHub Actions CI Workflow',
      priority: 'high',
      description: 'Automate build, lint, and test steps'
    });

    assert.ok(task.id, 'Task ID should be defined');
    assert.strictEqual(task.title, 'Configure GitHub Actions CI Workflow');
    assert.strictEqual(task.status, 'pending');
    assert.strictEqual(task.priority, 'high');
    assert.strictEqual(task.studentRoll, '24CS038');
    assert.strictEqual(taskService.getTasks().length, 1);
  });

  it('2. Should throw a validation error when task title is empty or missing', () => {
    assert.throws(() => {
      taskService.createTask({ title: '' });
    }, /Task title is required/);

    assert.throws(() => {
      taskService.createTask({ title: '   ' });
    }, /Task title is required/);
  });

  it('3. Should reject invalid priority values and enforce allowed enum', () => {
    assert.throws(() => {
      taskService.createTask({
        title: 'Invalid Priority Task',
        priority: 'urgent' // Invalid: only low, medium, high allowed
      });
    }, /Invalid priority/);
  });

  it('4. Should update task status to completed and record completion timestamp', () => {
    const task = taskService.createTask({ title: 'Verify CI pipeline triggers' });
    const completed = taskService.completeTask(task.id);

    assert.strictEqual(completed.status, 'completed');
    assert.ok(completed.completedAt, 'completedAt timestamp should exist');
  });

  it('5. Should delete an existing task successfully', () => {
    const task = taskService.createTask({ title: 'Temporary task to delete' });
    assert.strictEqual(taskService.getTasks().length, 1);

    const deleted = taskService.deleteTask(task.id);
    assert.strictEqual(deleted.id, task.id);
    assert.strictEqual(taskService.getTasks().length, 0);
  });
});
