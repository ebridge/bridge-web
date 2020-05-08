
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../lib/logger')(module);
const knex = require('../../postgres/knex').getKnex();
const verifyToken = require('../../lib/verifyToken');
const { USERS } = require('../../lib/constants/tables');

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await knex.from(USERS).select('*').where({ id: req.userId });
    return res.status(200).send(user);
  } catch (error) {
    logger.error('There was a problem fetching the user', { error });
    return res.status(500).send({ error: 'Problem fetching user' });
  }
});

router.get('/logout', (req, res) => res
  .status(200)
  .cookie('token', null, { expires: new Date(0) })
  .send({ auth: false, token: null }));

router.post('/register', async (req, res) => {
  const { email, displayName, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const [userId] = await knex(USERS).insert({
      id: uuidv4(),
      email,
      display_name: displayName,
      password_hash: hashedPassword,
    }).returning('id');
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res
      .status(200)
      .cookie('token', token, { expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_TIME) })
      .send({ auth: true });
  } catch (error) {
    logger.error('There was a problem registering the user', { error });
    return res.status(500).send({ error: 'Problem registering the user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await knex.from(USERS).select('*').where({ email });
    if (!user) {
      logger.error('No user found');
      return res.status(404).send('No user found');
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordIsValid) {
      return res.status(401).send({
        auth: false,
        token: null,
        error: 'Incorrect password',
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res
      .status(200)
      .cookie('token', token, { expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_TIME) })
      .send({ auth: true });
  } catch (error) {
    logger.error('There was a problem while logging in.', { error });
    return res.status(500).send({ error: 'Error while logging in' });
  }
});

module.exports = router;
