# Bridge api

API for bridge web app.

## Development
It is recommended you use the top-level docker-compose file found in this monorepo and respective `npm` commands found in the top-level [README.md](../README.md) to develop locally.

The following instructions are for bare bones development (running node on local system instead of running through docker).

1. Install and use Node.js version `12.16.x`. [nvm](https://github.com/nvm-sh/nvm) is recommended for this.
2. Copy [.env.secrets.example](./.env.secrets.example) to a `.env.secrets` file and set any required values.
3. Set up local servers: postgres, mongo, & redis instances (you can use Docker) and set their connection info in [.env](./env).
4. Seed local database with existing data, or run migrations in your clean database with `npm run migrate`
5. Run `npm i`
6. Run `npm start`

## Custom linting practices to follow

- Use snake_case for database fields and variables in application code that came from database
- Use camelCase for all other variables