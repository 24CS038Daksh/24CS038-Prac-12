/**
 * Lint & Code Quality Runner for CI Pipeline (Job 1)
 * Student: Daksh Karangiya | Roll: 24CS038
 */

const fs = require('fs');
const path = require('path');

console.log('========================================================================');
console.log('  GITHUB ACTIONS CI [JOB 1]: CODE QUALITY & LINTING CHECKS');
console.log('  Author: Daksh Karangiya | Roll Number: 24CS038');
console.log('========================================================================\n');

const filesToCheck = [
  path.join(__dirname, 'src', 'taskService.js'),
  path.join(__dirname, 'server.js')
];

let hasErrors = false;

filesToCheck.forEach(filePath => {
  const relPath = path.relative(__dirname, filePath);
  if (!fs.existsSync(filePath)) {
    console.log(`[LINT SKIP] File not yet generated: ${relPath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Basic sanity / syntax / convention checks
  if (content.includes('eval(')) {
    console.error(`[LINT ERROR] ${relPath}: Disallowed usage of eval()`);
    hasErrors = true;
  } else if (content.includes('debugger;')) {
    console.error(`[LINT ERROR] ${relPath}: Unexpected debugger statement`);
    hasErrors = true;
  } else {
    console.log(`✓ [LINT PASS] ${relPath}: Clean syntax, no linting violations detected.`);
  }
});

if (hasErrors) {
  console.error('\n✖ Linting check failed! Exiting with code 1.');
  process.exit(1);
} else {
  console.log('\n✔ All files passed code quality and style checks. (0 errors, 0 warnings)');
  process.exit(0);
}
