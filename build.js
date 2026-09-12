const { execSync } = require('child_process');
const path = require('path');

function run(cmd, dir) {
  console.log(`\n> cd ${dir} && ${cmd}`);
  execSync(cmd, { cwd: path.join(__dirname, dir), stdio: 'inherit' });
}

run('npm install', 'backend');
run('npm install', 'frontend');
run('npm run build', 'frontend');
