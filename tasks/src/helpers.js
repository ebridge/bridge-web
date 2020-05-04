const { exec, spawn } = require('child_process');
const fs = require('fs');
const request = require('request');
const { promisify } = require('util');

const execSync = promisify(exec);
const readSync = promisify(fs.readFile);
const writeSync = promisify(fs.writeFile);
const requestSync = promisify(request);

function exit(msgOrError, exitCode) {
  if (msgOrError) { console.log(msgOrError); }
  if (msgOrError.exitCode || exitCode) {
    return process.exit(msgOrError.exitCode || exitCode);
  }
  return process.exit(0); // Successful exit
}

async function userPrompt(prompt) {
  return new Promise((resolve) => {
    let userInput = '';
    const child = spawn(`echo "${prompt}"; read $test;`, { shell: true, input: 'str' });
    child.stdout.pipe(process.stdout);
    process.stdin.pipe(child.stdin);
    process.stdin.on('data', (data) => { userInput = data.toString(); });
    child.on('exit', () => {
      child.stdin.end();
      const response = userInput && (userInput.trim().toLocaleLowerCase() === 'yes' || userInput.trim().toLocaleLowerCase() === 'y');
      resolve(response);
    });
  });
}

async function runProcess(process) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(process, {
      stdio: 'inherit', shell: true, cwd: './',
    });
    childProcess.on('close', async (exitCode) => {
      if (exitCode === 0) {
        resolve(0);
      }
      const error = new Error(`Process: "${process}" failed with code: ${exitCode}.`);
      error.exitCode = exitCode;
      reject(error);
    });
  });
}

async function getBranch() {
  const { err, stdout } = await execSync('git rev-parse --abbrev-ref HEAD');
  if (err) { return exit(err); }
  return stdout.trim();
}

module.exports = {
  exit,
  execSync,
  readSync,
  writeSync,
  requestSync,
  getBranch,
  userPrompt,
  runProcess,
}