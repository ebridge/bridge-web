# Bridge web client

Frontend client for bridge web app

## Development

It is recommended you use the top-level docker-compose file found in this monorepo and respective `npm` commands found in the top-level [README.md](../README.md) to develop locally.

The following instructions are for bare bones development (running node on local system instead of running through docker).

1. Install and use Node.js version `14.1.x`. [nvm](https://github.com/nvm-sh/nvm) is recommended for this.
2. Set up and start the web [api](../api)
3. Run `npm i`
2. Copy [.env.secrets.example](./.env.secrets.example) to a `.env.secrets` file and set any required values. NOTE: At time of writing this doesn't need to be done as there are no front end secrets.
3. `npm start` to develop locally
