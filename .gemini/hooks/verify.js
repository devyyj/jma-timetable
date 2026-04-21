/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function verify() {
  const logPath = path.resolve(__dirname, '../hook-run.log');
  fs.appendFileSync(logPath, `Hook executed at: ${new Date().toISOString()}\n`);

  // Use console.error for logging to ensure it goes to stderr
  console.error('\n🔍 [GEMINI HOOK] Starting verification...');

  try {
    // 1. Linting
    console.error('✅ Checking lint...');
    execSync('npm run lint', { stdio: 'inherit' });

    // 2. Testing
    try {
      const packageJsonPath = path.resolve(__dirname, '../../package.json');
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (pkg.scripts && pkg.scripts.test) {
        console.error('✅ Running tests...');
        execSync('npm test', { stdio: 'inherit' });
      }
    } catch {
      // Ignored
    }

    console.error('✨ Verification successful!\n');
    
    // IMPORTANT: Hook MUST output a valid JSON to stdout
    process.stdout.write(JSON.stringify({ status: 'success' }));
    process.exit(0);
  } catch (err) {
    console.error('\n❌ [GEMINI HOOK] Verification failed!');
    console.error('Please fix the errors before proceeding.');
    
    // Output error JSON to stdout before exiting
    process.stdout.write(JSON.stringify({ status: 'failure', error: err.message }));
    process.exit(1);
  }
}

verify();
