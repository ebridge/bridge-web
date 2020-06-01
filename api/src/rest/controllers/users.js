
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../lib/logger')(module);
const knex = require('../../postgres/knex').getKnex();
const isAuthenticated = require('../middleware/isAuthenticated');
const { USERS } = require('../../lib/constants/tables');

const router = express.Router();

router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const [user] = await knex.from(USERS).select('*').where({ id: req.userId });
    if (!user) {
      logger.error('Unable to locate user');
      return res.status(404).send({
        error: 'Unable to locate user',
      });
    }
    return res.status(200).send(user);
  } catch (error) {
    logger.error('There was a problem fetching the user', { error });
    return res.status(500).send({
      error: 'Problem fetching user',
    });
  }
});

router.get('/logout', (req, res) => res
  .status(200)
  .send({ token: null }));

router.post('/register', async (req, res) => {
  const { email, displayName, password } = req.body;
  if (!email || !displayName || !password) {
    logger.error('email, display name, and password fields required to register.');
    return res.status(401).send({
      error: 'email, display name, and password fields required to register.',
    });
  }
  // Check for duplicate user display name
  const [duplicateUserDisplayName] = await knex.from(USERS).select('display_name').where({ display_name: displayName });
  if (duplicateUserDisplayName) {
    logger.error('A user with that email address already exists.');
    return res.status(409).send({
      error: 'Display name is already in use.',
    });
  }
  // Check for duplicate user email
  const [duplicateUserEmail] = await knex.from(USERS).select('email').where({ email });
  if (duplicateUserEmail) {
    logger.error('A user with that email address already exists');
    return res.status(409).send({
      error: 'Email address is already in use.',
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const [userId] = await knex(USERS).insert({
      id: uuidv4(),
      email,
      display_name: displayName,
      password_hash: hashedPassword,
    }).returning('id');
    // create and sign token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res
      .status(200)
      .send({ displayName, token });
  } catch (error) {
    logger.error('There was a problem registering the user', { error });
    return res.status(500).send({
      error: 'Problem registering the user',
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({
      error: 'No credentials passed to login',
    });
  }
  try {
    const [user] = await knex.from(USERS).select('*').where({ email });
    if (!user) {
      logger.error('Invalid email or password');
      return res.status(404).send({
        error: 'Invalid email or password',
      });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordIsValid) {
      return res.status(401).send({
        token: null,
        error: 'Incorrect password',
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res
      .status(200)
      .send({
        email: user.email,
        displayName: user.displayName,
        token,
      });
  } catch (error) {
    logger.error('There was a problem while logging in.', { error });
    return res.status(500).send({
      error: 'Error while logging in',
    });
  }
});

router.put('/validate', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).send({
      error: 'No email sent to validate',
    });
  }
  try {
    const [user] = await knex.from(USERS).select('id', 'email_validated').where({ email });
    if (!user) {
      logger.error('No user was found with that email');
      return res.status(404).send({
        error: 'No user was found with that email',
      });
    }
    if (user.email_validated) {
      logger.warn('User has already validated their email');
      return res.status(409).send({
        error: 'User has already validated their email',
      });
    }
    knex(USERS).where({ id: user.id }).update({ email_validated: true });
    return res.status(200).send({
      message: 'Email address successfully validated.',
    });
  } catch (error) {
    logger.error('Error while validating email address', { error });
    return res.status(500).send({
      error: 'Error while validating email address',
    });
  }
});

module.exports = router;
