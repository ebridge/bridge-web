const path =  require('path');
const {
  exit,
  runProcess,
} = require('./helpers');

const PROJECTS = [
  'api',
  'web',
  'tasks',
];

const getProjectPath = (project) => path.join(__filename, '..', '..', '..', project);

module.exports = async (project) => {
  console.log(`Args: project: ${project}`);
  if (!project) { return exit('No project specified. Exiting.', 1); }
  if (!PROJECTS.includes(project) && project !== 'all') {
    return exit(`>> Invalid project: ${project}. Exiting.`, 1);
  }

  // Lint each project
  if (project === 'all') {
    console.log('>> Linting each project...\n');
    const lintResults = {};
    await Promise.all(PROJECTS.map(async (project) => {
      console.log(`>> Linting ${project} project...\n`);
      try {
        const exitCode = await runProcess(`cd ${getProjectPath(project)} && npm run lint`);
        lintResults[project] = { exitCode };
      } catch (error) {
        lintResults[project] = { exitCode: error.exitCode, msg: error.message };
      }
    }));

    let anyFailed = false;
    Object.entries(lintResults).map(([project, results]) => {
      if (results.exitCode !== 0) {
        anyFailed = true;
        console.log(`Linting failed for ${project}: ${results.msg}`)
      }
    });
    if (anyFailed) {
      return exit('Lint for every project failed.', 1); // At least one project failed
    }
    // Successfully linted every project
    return exit('Successfully linted all projects without errors');

  // Lint just one project
  } else {
    console.log(`>> Linting ${project} project...\n`);
    try {
      await runProcess(`cd ${getProjectPath(project)} && npm run lint --timeout=45`);
      return exit(`Successfully linted ${project} without errors`);
    } catch (error) {
      return exit(error);
    }
  }
}