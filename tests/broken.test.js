/**
 * Deliberately Broken Test Suite (Demonstrating CI Pipeline Failure & Red X)
 * Student: Daksh Karangiya | Roll: 24CS038
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const TaskService = require('../src/taskService');

describe('Task Management CI Failure Simulation (Deliberately Broken Test)', () => {
  it('DELIBERATELY BROKEN: Expected newly created task to be completed immediately', () => {
    const taskService = new TaskService();
    const task = taskService.createTask({
      title: 'Intentional Flawed Assertion for CI Failure Demo',
      priority: 'high'
    });

    console.log(`\n[TEST EXECUTION] Created task with status: "${task.status}"`);
    console.log(`[TEST ASSERTION] Asserting that status === "completed" (Flawed expectation)...`);

    // This assertion will intentionally FAIL because initial status is 'pending', not 'completed'
    assert.strictEqual(
      task.status,
      'completed',
      `AssertionError: Expected task status to be 'completed' on creation, but got '${task.status}'. Pipeline must halt!`
    );
  });
});
