# tasks

Project for helpful project-wide tasks performed via our [Jakefile](./Jakefile.js) using [Jake](https://jakejs.com/).

## Usage

1. `npm i`
2. `npm i -g jake`
3. Set up [Environment](#Environment)
4. Run [commands](#Commands)

You can use `npm start -- <command>` instead of installing Jake globally

## Environment

Copy .env.example to .env and set any missing values to run tasks that require them locally.

Otherwise these tasks will be performed in CircleCi where the proper env vars should already be defined.

## Commands

### Lint (Task)

Lints all or specific projects in repo

Command: `Jake lint[<env>]`

Examples: 
  - `Jake lint[all]`: Lints each project
  - `Jake lint[web]`: Lints web project

Args:
 - <env>: 'all' | 'api' | 'web' | 'tasks'


### Deploy (Task)

Deploys a project

Command: `Jake deploy[<env/branch>,<project>,<option>]`

Examples: 
  - `Jake deploy[web]`: Deploys web project
  - `Jake deploy[api,force]`: Deploys api project on a branch that isn't `master`

Args:
 - <project>: 'api' | 'web'
 - <option>: 'force' (allows deploy from branch other than master)
