# tasks

Project for helpful project-wide tasks performed via our [Jakefile](./Jakefile.js) using [Jake](https://jakejs.com/).

## Usage

1. `npm i`
2. `npm i -g jake`
3. Set up [Environment](#Environment)
4. Run [commands](#Commands)

You can use `npm start -- <command>` instead of installing Jake globally

## Commands

### Lint (Task)

Lints all or specific projects in repo

Command: `Jake lint[<env>]`

Examples: 
  - `Jake lint[all]`: Lints each project
  - `Jake lint[web]`: Lints web project

Args:
 - <env>: 'all' | 'api' | 'web' | 'tasks'
