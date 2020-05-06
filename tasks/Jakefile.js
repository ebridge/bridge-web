/* eslint-disable no-console */
/* global task */
require('dotenv').config();
const lint = require('./src/lint');
const deploy = require('./src/deploy');

task('default', () => {
  console.log('See README.md for a list of tasks');
});

// Jake deploy[<env>] (e.g. Jake lint[web])
task('lint', { async: true }, async (project) => {
  return lint(project);
});

// Jake deploy[<env>,<project>] (e.g. Jake deploy[test,web]
task('deploy', { async: true }, async (environment, project, option) => {
  return deploy(environment, project, option);
});

task('default')