# Bridge api

API for bridge site.

## Development

- Get an up to date copy of .env
- Run `npm i`
- Run `npm run dev.up` to spin up docker images:
  - api: NodeJS code w hot-reloading on save
  - bridge_db: Postgres database for api
  - bridge_test_db: separate db used for api tests
  - redis
- Run `npm run dev.down` to stop them.
- Run `npm run dev.logs` to debug status of containers

## Custom linting practices to follow

- Use snake_case for database fields and variables in application code that came from database
- Use camelCase for all other variables