# Bridge web client

Frontend client for bridge web app

## Development

It is recommended you use the top-level docker-compose file found in this monorepo and respective `npm` commands found in the top-level [README.md](../README.md) to develop locally.

The following instructions are for bare bones development (running node on local system instead of running through docker).

1. `npm i`
2. Copy [.env.secrets.example](./.env.secrets.example) to a `.env.secrets` file and set any required values.
3. `npm start` to develop locally