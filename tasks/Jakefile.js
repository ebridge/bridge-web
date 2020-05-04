/* eslint-disable no-console */
/* global task namespace */
require('dotenv').config();
const lint = require('./src/lint');
const deploy = require('./src/deploy');
const purge = require('./src/purge');
const { updateTickets } = require('./src/pivotal');

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

// TODO: Set up Fastly for purging in v4
// Jake purge[<env>,<project>] (e.g. Jake purge[test,web])
task('purge', { async: true }, async (environment, project) => {
  return purge(environment, project)
});

// TODO: Clarify Pivotal branch storyId logic to get storyId from branch name
// Jake pivotal:update-tickets
namespace('pivotal', () => {
  task('update-tickets', { async: true }, async () => {
    return updateTickets()
  });
});

task('default')