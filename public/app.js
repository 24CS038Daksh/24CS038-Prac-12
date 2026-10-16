/**
 * Practical 12: GitHub Actions CI/CD Pipeline Simulator
 * Student: Daksh Karangiya | Roll: 24CS038
 */

const YAML_CONTENT = `name: Task Management CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    name: Code Quality & Linting
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install
      - run: npm run lint

  build-and-test:
    name: Build & Automated Tests
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install
      - run: npm run test
      - if: success()
        run: echo "CI Pipeline Status: All tests passed for Student 24CS038!"`;

const PASSING_TEST_CONTENT = `// tests/task.test.js - Author: Daksh Karangiya (24CS038)
const { describe, it } = require('node:test');
const assert = require('node:assert');
const TaskService = require('../src/taskService');

describe('Task Management CI Test Suite', () => {
  it('1. Should create a valid task with pending status and roll 24CS038', () => {
    const task = new TaskService().createTask({ title: 'CI Pipeline Test' });
    assert.strictEqual(task.status, 'pending');
    assert.strictEqual(task.studentRoll, '24CS038');
  });

  it('2. Should throw validation error when title is empty', () => {
    assert.throws(() => new TaskService().createTask({ title: '' }));
  });

  it('3. Should reject invalid priority values', () => {
    assert.throws(() => new TaskService().createTask({ title: 'Task', priority: 'urgent' }));
  });

  it('4. Should update task status to completed', () => {
    const service = new TaskService();
    const task = service.createTask({ title: 'Task 1' });
    assert.strictEqual(service.completeTask(task.id).status, 'completed');
  });
});`;

const BROKEN_TEST_CONTENT = `// tests/broken.test.js - Deliberately Broken Test (Red X Demo)
const { describe, it } = require('node:test');
const assert = require('node:assert');
const TaskService = require('../src/taskService');

describe('Task Management CI Failure Simulation', () => {
  it('DELIBERATELY BROKEN: Expected task to be completed on creation', () => {
    const task = new TaskService().createTask({ title: 'Demo Failing Task' });
    
    // FAILS: Initial status is 'pending', but assertion expects 'completed'
    assert.strictEqual(
      task.status,
      'completed',
      "AssertionError: Expected task status to be 'completed' on creation, but got 'pending'. Pipeline must halt!"
    );
  });
});`;

const PASSING_CONSOLE = `2026-10-16T14:25:01.120Z [INFO] Current runner version: '2.314.1'
2026-10-16T14:25:01.125Z [INFO] Operating System: Ubuntu 22.04.4 LTS
2026-10-16T14:25:01.130Z [INFO] Runner Image: ubuntu-22.04
2026-10-16T14:25:01.140Z [INFO] Author: Daksh Karangiya | Roll: 24CS038
================================================================================
Job: build-and-test (Workflow: .github/workflows/ci.yml)
Triggered by: push to refs/heads/main (commit c3e7d21)
================================================================================
##[group]Run actions/checkout@v4
Syncing repository: dakshkarangiya/task-management-ci
Checking out commit c3e7d21...
##[endgroup]
##[group]Run actions/setup-node@v4
Found in cache: Node.js 20.12.2
Resolved npm cache directory: /home/runner/.npm
##[endgroup]
##[group]Run npm install
added 93 packages in 1.82s
found 0 vulnerabilities
##[endgroup]
##[group]Run npm run lint (Job 1: lint)
> node lint-check.js
✓ [LINT PASS] src/taskService.js: Clean syntax, no violations detected.
✔ All files passed code quality and style checks. (0 errors, 0 warnings)
##[endgroup]
##[group]Run npm run test (Job 2: build-and-test)
> node --test tests/task.test.js

▶ Task Management CI Test Suite (Author: Daksh Karangiya / 24CS038)
  ✔ 1. Should create a valid task with pending status and student roll 24CS038 (1.08ms)
  ✔ 2. Should throw a validation error when task title is empty or missing (0.21ms)
  ✔ 3. Should reject invalid priority values and enforce allowed enum (0.08ms)
  ✔ 4. Should update task status to completed and record completion timestamp (0.11ms)
  ✔ 5. Should delete an existing task successfully (0.39ms)
✔ Task Management CI Test Suite (Author: Daksh Karangiya / 24CS038) (2.38ms)

ℹ tests 5
ℹ suites 1
ℹ pass 5
ℹ fail 0
ℹ duration_ms 37.6ms
##[endgroup]

================================================================================
CI/CD PIPELINE STATUS: BUILD & TESTS PASSED (GREEN)
Author: Daksh Karangiya | Roll Number: 24CS038
Status: Success ✔
================================================================================`;

const FAILING_CONSOLE = `2026-10-16T14:22:18.040Z [INFO] Current runner version: '2.314.1'
2026-10-16T14:22:18.045Z [INFO] Operating System: Ubuntu 22.04.4 LTS
2026-10-16T14:22:18.050Z [INFO] Author: Daksh Karangiya | Roll: 24CS038
================================================================================
Job: build-and-test (Workflow: .github/workflows/ci.yml)
Triggered by: push to refs/heads/main (commit 9f4a1b8)
================================================================================
##[group]Run actions/checkout@v4
Syncing repository: dakshkarangiya/task-management-ci
Checking out commit 9f4a1b8...
##[endgroup]
##[group]Run actions/setup-node@v4
Found in cache: Node.js 20.12.2
##[endgroup]
##[group]Run npm install
added 93 packages in 1.91s
##[endgroup]
##[group]Run npm run lint (Job 1: lint)
> node lint-check.js
✔ All files passed code quality and style checks. (0 errors, 0 warnings)
##[endgroup]
##[group]Run npm run test (Job 2: build-and-test)
> node --test tests/broken.test.js

[TEST EXECUTION] Created task with status: "pending"
[TEST ASSERTION] Asserting that status === "completed" (Flawed expectation)...
▶ Task Management CI Failure Simulation (Deliberately Broken Test)
  ✖ DELIBERATELY BROKEN: Expected newly created task to be completed immediately (1.89ms)
✖ Task Management CI Failure Simulation (Deliberately Broken Test) (2.20ms)

✖ failing tests:

test at tests/broken.test.js:11:3
✖ DELIBERATELY BROKEN: Expected newly created task to be completed immediately (1.89ms)
  AssertionError [ERR_ASSERTION]: Expected task status to be 'completed' on creation, but got 'pending'. Pipeline must halt!
  + actual - expected

  + 'pending'
  - 'completed'

      at TestContext.<anonymous> (/workspace/tests/broken.test.js:22:12)
      at Test.run (node:internal/test_runner/test:1106:25) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 'pending',
    expected: 'completed',
    operator: 'strictEqual'
  }

ℹ tests 1
ℹ suites 1
ℹ pass 0
ℹ fail 1
ℹ duration_ms 35.1ms
##[endgroup]

##[error]Process completed with exit code 1.
================================================================================
CI/CD PIPELINE STATUS: FAILED (RED X)
Step 'Execute Automated Test Suite' exited with non-zero code (1).
Deployment blocked until bug is resolved!
================================================================================`;

function setPipelineMode(mode) {
  const badge = document.getElementById('pipeline-status-badge');
  const resultIcon = document.getElementById('flow-result-icon');
  const resultText = document.getElementById('flow-result-text');
  const resultSub = document.getElementById('flow-result-sub');
  const runTitle = document.getElementById('run-title');
  const runStatusPill = document.getElementById('run-status-pill');
  const stepsContainer = document.getElementById('steps-container');
  const consoleOutput = document.getElementById('console-output');
  const consoleCommit = document.getElementById('console-commit');
  const btnPass = document.getElementById('btn-run-pass');
  const btnFail = document.getElementById('btn-run-fail');

  if (mode === 'pass') {
    btnPass.classList.add('active');
    btnFail.classList.remove('active');

    badge.className = 'gh-badge badge-passing';
    badge.textContent = 'build | passing';

    resultIcon.className = 'node-icon success';
    resultIcon.textContent = '✔';
    resultText.textContent = 'Status: PASSED';
    resultSub.textContent = 'Green Checkmark';

    runTitle.textContent = 'Workflow Run #2: Commit c3e7d21 ("Fix assertion and restore pipeline")';
    runStatusPill.className = 'pill pill-success';
    runStatusPill.textContent = '✔ Status: Success (All Jobs Completed)';

    consoleCommit.textContent = 'Commit: c3e7d21 | Author: Daksh Karangiya (24CS038)';
    consoleOutput.textContent = PASSING_CONSOLE;

    stepsContainer.innerHTML = `
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Set up job & runner environment</span>
        <span class="step-time">0.2s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Checkout Repository (actions/checkout@v4)</span>
        <span class="step-time">0.3s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Setup Node.js 20 Environment</span>
        <span class="step-time">0.7s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Install Project Dependencies (npm install)</span>
        <span class="step-time">1.8s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Run Linter Checks (Job 1: lint)</span>
        <span class="step-time">0.5s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Execute Automated Test Suite (Job 2: build-and-test) — 5/5 Passing</span>
        <span class="step-time">1.1s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Publish CI Build Summary (Status: GREEN)</span>
        <span class="step-time">0.1s</span>
      </div>
    `;
  } else {
    btnFail.classList.add('active');
    btnPass.classList.remove('active');

    badge.className = 'gh-badge badge-failing';
    badge.textContent = 'build | failing';

    resultIcon.className = 'node-icon failure';
    resultIcon.textContent = '✖';
    resultText.textContent = 'Status: FAILED';
    resultSub.textContent = 'Red X (Blocked)';

    runTitle.textContent = 'Workflow Run #1: Commit 9f4a1b8 ("Add broken status validation test")';
    runStatusPill.className = 'pill pill-failure';
    runStatusPill.textContent = '✖ Status: Failed (Test Suite Error)';

    consoleCommit.textContent = 'Commit: 9f4a1b8 | Author: Daksh Karangiya (24CS038)';
    consoleOutput.textContent = FAILING_CONSOLE;

    stepsContainer.innerHTML = `
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Set up job & runner environment</span>
        <span class="step-time">0.2s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Checkout Repository (actions/checkout@v4)</span>
        <span class="step-time">0.3s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Setup Node.js 20 Environment</span>
        <span class="step-time">0.6s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Install Project Dependencies (npm install)</span>
        <span class="step-time">1.9s</span>
      </div>
      <div class="step-row step-passed">
        <span class="step-name"><span class="step-icon-pass">✔</span> Run Linter Checks (Job 1: lint)</span>
        <span class="step-time">0.5s</span>
      </div>
      <div class="step-row step-failed">
        <span class="step-name"><span class="step-icon-fail">✖</span> Execute Automated Test Suite (Job 2: build-and-test) — AssertionError</span>
        <span class="step-time">0.9s</span>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const yamlViewer = document.getElementById('yaml-viewer');
  yamlViewer.textContent = YAML_CONTENT;

  document.getElementById('btn-run-pass').addEventListener('click', () => setPipelineMode('pass'));
  document.getElementById('btn-run-fail').addEventListener('click', () => setPipelineMode('fail'));

  const tabYamlBtn = document.getElementById('tab-yaml-btn');
  const tabTestBtn = document.getElementById('tab-test-btn');
  const tabBrokenBtn = document.getElementById('tab-broken-btn');

  tabYamlBtn.addEventListener('click', () => {
    tabYamlBtn.classList.add('active');
    tabTestBtn.classList.remove('active');
    tabBrokenBtn.classList.remove('active');
    yamlViewer.textContent = YAML_CONTENT;
  });

  tabTestBtn.addEventListener('click', () => {
    tabTestBtn.classList.add('active');
    tabYamlBtn.classList.remove('active');
    tabBrokenBtn.classList.remove('active');
    yamlViewer.textContent = PASSING_TEST_CONTENT;
  });

  tabBrokenBtn.addEventListener('click', () => {
    tabBrokenBtn.classList.add('active');
    tabYamlBtn.classList.remove('active');
    tabTestBtn.classList.remove('active');
    yamlViewer.textContent = BROKEN_TEST_CONTENT;
  });

  // Default to passing
  setPipelineMode('pass');
});
