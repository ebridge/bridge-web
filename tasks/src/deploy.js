const {
  execSync,
  exit,
} = require('./helpers');

const PROJECTS = [
  'api',
  'web',
]

module.exports = async (project, option) => {
  console.log(`Args: project: ${project}, option: ${option}`);
  const force = option === 'force';
  if (!project) { return exit('No project specified. Exiting.'); }
  if (!PROJECTS.includes(project)) {
    return exit(`>> Invalid project: ${project}. Exiting.`, 1);
  }
  
  const { err, stdout } = await execSync('git rev-parse --abbrev-ref HEAD');
  if (err) { return exit(err, 1); }
  const branch = stdout.trim();

  if (force) {
    console.log('>> WARNING: You are running in force mode.');
    if (branch !== 'master') {
      console.log(`>> WARNING: Your branch: ${branch} is not master branch. Force deploying.`);
    }
  }
  if (!force && branch !== 'master') {
    return exit(`>> Attempted to deploy branch: ${branch} to production. Use force option if this was intentional. Exiting.`, 1);
  }

  console.log('Deploy logic TODO');
}