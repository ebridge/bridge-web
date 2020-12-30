/* eslint-disable no-console */
/* global task */
require('dotenv').config();
const lint = require('./src/lint');

task('default', () => {
  console.log('See README.md for a list of tasks');
});

// Jake deploy[<env>] (e.g. Jake lint[web])
task('lint', { async: true }, async (project) => {
  return lint(project);
});

task('default')
