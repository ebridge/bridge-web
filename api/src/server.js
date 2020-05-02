const path = require('path');
const fs = require('fs');
const dotEnv = require('dotenv');
require('reflect-metadata');

const localPath = path.join(__dirname, '..', '.env.local');
const devPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(localPath)) {
  dotEnv.config({ path: localPath });
} else if (devPath) {
  dotEnv.config({ path: devPath });
}

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const uuid = require('uuid');

const logger = require('./lib/logger')(module);


logger.info('Initalizing server with environments.', { NODE_ENV: process.env.NODE_ENV });

// Use an async entry point
async function entryPoint() {
  // Config
  // Initialization
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Express route handlers
  app.get('/test', (req, res) => {
    res.send('Working!');
  });
  // Get all to do list items
  app.get('/v1/items', async (req: Request, res: Response) => {
    const items = await pgClient.query('SELECT * FROM items');
    res.status(200).send(items.rows);
  });
  // Get a single todo item
  app.get('/v1/items', async (req, res) => {
    const id = req.params.id;
    const items = await pgClient
      .query('SELECT * FROM items WHERE id = $1', [id])
      .catch(e => {
        res
          .status(500)
          .send(`Encountered an internal error when fetching item with ID ${id}`);
      });
    res.status(200).send(items.rows);
  });
  // Create a todo item
  app.post('/v1/items', async (req, res) => {
    const { item_name } = req.body;
    const id = uuid();
    const item = await pgClient
      .query(
        `INSERT INTO items (id, item_name, complete) VALUES 
      ($1, $2, $3)`,
        [id, item_name, false]
      )
      .catch(e => {
        res
          .status(500)
          .send('Encountered an internal error when creating an item');
      });
    res.status(201).send(`Item created with ID: ${id}`);
  });
  // Update a todo item
  app.put('/v1/items/:id', async (req, res) => {
    const { id } = req.params.id;
    const { item_name, complete } = req.body;
    await pgClient
      .query(
        `
      UPDATE items SET item_name = $1, complete = $2 WHERE id = $3
    `,
        [item_name, complete, id]
      )
      .catch(e => {
        res
          .status(500)
          .send('Encountered an internal error when updating an item');
      });
    res.status(200).send(`Item updated with ID: ${id}`);
  });
  // Delete a todo item
  app.delete('/v1/items/:id', async (req, res) => {
    const { id } = req.params.id;
    await pgClient.query('DELETE FROM items WHERE id = $1', [id]).catch(e => {
      res.status(500).send('Encountered an internal error when deleting an item');
    });
    res.status(200).send(`Item deleted with ID: ${id}`);
  });

  // Start Server
  const port = process.env.API_PORT || 3001;
  const server = http.createServer(app);
  server.listen(port, () => logger.info(`Server up and running on port ${port}`));
}

// Start server
entryPoint();
