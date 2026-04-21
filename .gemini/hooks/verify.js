/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Gemini CLI Hook: Verification Script
 * Runs linting, formatting, and tests to ensure code quality.
 */
function verify() {
  console.error('Starting verification checks...');

  try {
    // 1. Linting
    console.error('Running: npm run lint');
    execSync('npm run lint', { stdio: 'inherit' });

    // 2. Testing (only if test script exists)
    try {
      const packageJsonPath = path.resolve(__dirname, '../../package.json');
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (pkg.scripts && pkg.scripts.test) {
        console.error('Running: npm test');
        execSync('npm test', { stdio: 'inherit' });
      } else {
        console.error('Skipping tests: "test" script not found in package.json');
      }
    } catch (e) {
      console.error('Warning: Could not read package.json for test script.', e);
    }

    console.error('Verification successful!');
    process.stdout.write(JSON.stringify({ decision: 'allow' }));
  } catch {
    console.error('\nVerification failed!');
    console.error('Please fix the errors before proceeding.');
    // Exit with code 2 to block the action in Gemini CLI
    process.exit(2);
  }
}

verify();
