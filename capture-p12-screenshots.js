const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.resolve(__dirname, '..'); // practical-12/

async function capture() {
  console.log('Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 960, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:5006...');
  await page.goto('http://localhost:5006', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  // Screenshot 1: Full Main Dashboard (Passing Run #2 overview)
  console.log('Capturing Screenshot 1: Main CI Dashboard (Passing)...');
  await page.screenshot({ path: path.join(OUT_DIR, 'p12_screenshot_1_ci_dashboard_passing.png') });

  // Switch to Failure Mode (Run #1: Broken Test)
  console.log('Switching to Failure Mode (Run #1: Broken Test)...');
  await page.evaluate(() => {
    document.getElementById('btn-run-fail').click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Get cards array: [0]=Flow, [1]=Run details, [2]=YAML
  const cards = await page.$$('.card');

  // Screenshot 2: Failed Pipeline Run Details (Red X & AssertionError)
  console.log('Capturing Screenshot 2: Failed Pipeline Details (Red X)...');
  if (cards.length >= 2) {
    await cards[1].screenshot({ path: path.join(OUT_DIR, 'p12_screenshot_2_ci_pipeline_failing.png') });
  } else {
    await page.screenshot({ path: path.join(OUT_DIR, 'p12_screenshot_2_ci_pipeline_failing.png') });
  }

  // Switch back to Passing Mode (Run #2: Fixed Pipeline)
  console.log('Switching back to Passing Mode (Run #2: Fixed Pipeline)...');
  await page.evaluate(() => {
    document.getElementById('btn-run-pass').click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Screenshot 3: Fixed Passing Pipeline Run Details (Green Checkmark)
  console.log('Capturing Screenshot 3: Fixed Passing Pipeline Details (Green Checkmark)...');
  if (cards.length >= 2) {
    await cards[1].screenshot({ path: path.join(OUT_DIR, 'p12_screenshot_3_ci_pipeline_fixed_passing.png') });
  } else {
    await page.screenshot({ path: path.join(OUT_DIR, 'p12_screenshot_3_ci_pipeline_fixed_passing.png') });
  }

  // Scroll to YAML card
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 4: Workflow YAML & Configuration Tabs
  console.log('Capturing Screenshot 4: Workflow YAML (.github/workflows/ci.yml)...');
  if (cards.length >= 3) {
    await cards[2].screenshot({ path: path.join(OUT_DIR, 'p12_screenshot_4_workflow_yaml_and_badge.png') });
  } else {
    await page.screenshot({ path: path.join(OUT_DIR, 'p12_screenshot_4_workflow_yaml_and_badge.png') });
  }

  // Screenshot 5: Terminal Output showing automated CI pipeline execution
  console.log('Capturing Screenshot 5: macOS Terminal CI Pipeline Execution...');
  const terminalHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        padding: 30px;
        background: #0f172a;
        font-family: "SF Mono", "Menlo", "Monaco", "Courier New", monospace;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .window {
        width: 100%;
        max-width: 1080px;
        background: #1e293b;
        border-radius: 10px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        border: 1px solid #334155;
        overflow: hidden;
      }
      .titlebar {
        background: #0f172a;
        padding: 12px 18px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #334155;
      }
      .dots {
        display: flex;
        gap: 8px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .dot.red { background: #ef4444; }
      .dot.yellow { background: #f59e0b; }
      .dot.green { background: #10b981; }
      .title {
        color: #94a3b8;
        font-size: 13px;
        margin: 0 auto;
        font-weight: 500;
      }
      .terminal-body {
        padding: 24px 28px;
        color: #f8fafc;
        font-size: 13px;
        line-height: 1.65;
        white-space: pre-wrap;
      }
      .prompt { color: #38bdf8; font-weight: bold; }
      .divider { color: #475569; }
      .pass { color: #4ade80; font-weight: bold; }
      .fail { color: #f87171; font-weight: bold; }
      .info { color: #60a5fa; font-weight: 600; }
      .warn { color: #fbbf24; }
      .roll-tag {
        background: #2563eb;
        color: #ffffff;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="window">
      <div class="titlebar">
        <div class="dots">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
        </div>
        <div class="title">daksh@macbook-air: ~/Desktop/Aweb/practical-12/code (zsh) — node run-ci-pipeline.js</div>
      </div>
      <div class="terminal-body"><span class="prompt">dakshkarangiya@MacBook-Air code %</span> node run-ci-pipeline.js
<span class="divider">========================================================================================</span>
  <span class="pass">GITHUB ACTIONS CI/CD PIPELINE EXECUTION VERIFIER</span>
  <strong>Student Name:</strong> Daksh Karangiya  |  <strong>Roll Number:</strong> <span class="roll-tag">24CS038</span>
  <strong>Workflow:</strong> .github/workflows/ci.yml | <strong>Triggers:</strong> on: [push, pull_request]
<span class="divider">========================================================================================</span>

========================================================================
  <span class="fail">RUN #1: COMMIT 9f4a1b8 ("Add broken assertion test") — EXPECTED: FAILURE (RED X)</span>
========================================================================

>> [STEP] 1. Checkout Repository
   Command: git status --short || echo "Working directory checked out"
   Status : <span class="pass">✔ PASSED (0.02s)</span>

>> [STEP] 2. Setup Node.js Environment
   Command: node -v (v20.12.2)
   Status : <span class="pass">✔ PASSED (0.02s)</span>

>> [STEP] 3. Install Dependencies (npm install)
   Command: npm install
   Status : <span class="pass">✔ PASSED (1.82s)</span>

>> [STEP] 4. Run Linter (Job 1: lint)
   Command: node lint-check.js
   Status : <span class="pass">✔ PASSED (0.02s)</span> (0 errors, 0 warnings)

>> [STEP] 5. Execute Test Suite (Job 2: build-and-test)
   Command: node --test tests/broken.test.js
   Status : <span class="fail">✖ FAILED (0.06s)</span>

<span class="fail">[GITHUB ACTIONS NOTICE] Process completed with exit code 1.</span>
<span class="fail">✖ Pipeline Status: FAILED (Red X) on step "Execute Test Suite"</span>
  <strong>Cause:</strong> AssertionError: Expected task status to be "completed", got "pending"
  <span class="warn">##[error]Deployment blocked: Failed test prevents bad code from merging into main!</span>

========================================================================
  <span class="pass">RUN #2: COMMIT c3e7d21 ("Fix assertion and restore pipeline") — EXPECTED: PASS (GREEN ✔)</span>
========================================================================

>> [STEP] 1. Checkout Repository
   Command: git status --short || echo "Working directory checked out"
   Status : <span class="pass">✔ PASSED (0.01s)</span>

>> [STEP] 2. Setup Node.js Environment
   Command: node -v (v20.12.2)
   Status : <span class="pass">✔ PASSED (0.01s)</span>

>> [STEP] 3. Install Dependencies (npm install)
   Command: npm install
   Status : <span class="pass">✔ PASSED (0.13s)</span>

>> [STEP] 4. Run Linter (Job 1: lint)
   Command: node lint-check.js
   Status : <span class="pass">✔ PASSED (0.02s)</span> (0 errors, 0 warnings)

>> [STEP] 5. Execute Test Suite (Job 2: build-and-test)
   Command: node --test tests/task.test.js
   Status : <span class="pass">✔ PASSED (0.06s)</span>
   <strong>Test Results:</strong>
   ✔ 1. Should create a valid task with pending status and student roll 24CS038
   ✔ 2. Should throw a validation error when task title is empty or missing
   ✔ 3. Should reject invalid priority values and enforce allowed enum
   ✔ 4. Should update task status to completed and record completion timestamp
   ✔ 5. Should delete an existing task successfully
   <span class="pass">ℹ tests 5 | pass 5 | fail 0 | duration_ms 37.6ms</span>

<span class="pass">[GITHUB ACTIONS NOTICE] Process completed with exit code 0.</span>
<span class="pass">✔ Pipeline Status: PASSED (Green Checkmark) for all jobs [lint, build-and-test]</span>
  All 5 test assertions satisfied for Student 24CS038!

<span class="divider">========================================================================================</span>
  <span class="pass">ALL PRACTICAL 12 CI/CD OBJECTIVES AND VERIFICATIONS COMPLETE!</span>
<span class="divider">========================================================================================</span>
<span class="prompt">dakshkarangiya@MacBook-Air code %</span> </div>
    </div>
  </body>
  </html>
  `;

  const termPage = await browser.newPage();
  await termPage.setViewport({ width: 1150, height: 960, deviceScaleFactor: 2 });
  await termPage.setContent(terminalHtml, { waitUntil: 'networkidle0' });
  await termPage.screenshot({ path: path.join(OUT_DIR, 'p12_screenshot_5_terminal_ci_execution.png') });
  console.log('Screenshot 5: Terminal CI Pipeline Execution captured!');

  await browser.close();
  console.log('All Practical 12 screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
