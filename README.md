# Bridge Web App
### A free online multiplayer bridge platform. Frontend built with Next.js to provide Server Side Rendering in React. Redux used for state-management. Node.js + Express backend connecting to a PostgreSQL Database through Knex.js.

## Landing Page
![Landing Page](https://i.imgur.com/WK4wuu9.png)

## Profile Customization
Image upload to Digital Ocean Spaces through the AWS SDK. Guide on how I achieved this can be found on my blog! https://ethanbon.com/blog/uploading-cropped-profile-images-to-digital-ocean-spaces-1
![Profile](https://i.imgur.com/jNfXj7o.png)



# Development
## Projects

- [client](./client): Next.js based client
- [api](./api): Express based api server
- [tasks](./tasks): Local task runner for things like linting all projects 
- [deploy](./deploy): Kubernetes configuration and bash scripts used for manually deploying. See README.md in this directory for deploy instructions.



## Development with Docker
See the top-level [package.json](./package.json) for scripts to run and check the logs of each container detailed in [docker-compose.yml](./docker-compose.yml).
 
Simply `npm run start.projects` to start each service.

Or to start each service and follow the logs manually:

1. `npm start` to start the containers
2. Follow the logs of api, cms, and web with `npm run logs.project`
3. Follow the logs of the database, redis, and other services with `npm run logs.services`
4. Alternatively you can open separate terminal windows to follow the last 1000 logs of any container with `docker-compose logs --tail 1000 -f <service_name>`
  - `-f` flag tells docker to follow new logs the container might output
  - `--tail 1000` only shows the last 1000 logs

## Development with bare bone
For each project (api, web):
1. Read through the README in the project for any specific config
2. Copy the `.env.secrets.example` to a `.env.secrets` file and set any required values
3. Run `npm i`
4. Run `npm start`

## Environments
In each project there are two environment files:
- `.env`: default environment for project that is committed to our repo
- `.env.secrets`: (.gitignored) secrets that can't be committed to our repo and are templated in `.env.secrets.example` files that can be committed for reference.

Valid `NODE_ENV` options are 'dev', 'test', or 'production'

### Project level vs Docker top-level variables
When running the projects through docker-compose, some environment variables in each project are overwritten.

These variables are declared in the top-level [.env](.env).

The environment variables injected into each project by Docker are prefixed with `DOCKER_`,
the application code in the `loadEnv.{js, ts}` files in each project prioritizes these top-level `DOCKER_` prefixed variables over local `.env` file project-level variables.

### Build vs Runtime variables

The Next.js [web](./web) project uses build env variables.

All [api](./api) project env variables are run time and set via the server.

Since our builds are done via Circle, all build-time env variables are set from the Circle UI project setting's environment variables during `npm run build`.

Run-time variables however are set within the server that our project is hosted on.

# Reference

## CircleCI
You can test any changes made to [config.yml](./circleci/config.yml) using the [circle cli](https://circleci.com/docs/2.0/local-cli/).

Follow the instructions to install the cli and add a personal api key, then you can run commands.

Examples:
- `circleci config process .circleci/config.yml` to verify your config.yml syntax.
- `circleci local execute --job lint-projects` to execute the lint-projects job locally.

Their [reference on yml](https://circleci.com/docs/2.0/writing-yaml/#section=configuration) is a good place to start if you've never used aliases.

We define a lot of aliases e.g. `node-image: &node-image` and inject them (merge map) e.g. `<<: *[node-image]`
