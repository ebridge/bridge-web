
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../postgres/knex').getKnex();
const isAuthenticated = require('../middleware/isAuthenticated');
const { USERS } = require('../../lib/constants/tables');
const {
  ServerError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../../lib/errors');

const router = express.Router();

router.get('/me', isAuthenticated, async (req, res, next) => {
  try {
    const [user] = await knex.from(USERS).select('*').where({ id: req.userId });
    if (!user) {
      return next(new NotFoundError('User not found.'));
    }
    return res.status(200).json(user);
  } catch (error) {
    return next(new ServerError());
  }
});

router.get('/logout', (req, res) => res.status(200).json({ token: null }));

router.post('/register', async (req, res, next) => {
  const { email, displayName, password } = req.body;
  if (!email || !displayName || !password) {
    return next(new UnauthorizedError('Email, display name and password are required to register new user.'));
  }
  // Check for duplicate user display name
  const [duplicateUserDisplayName] = await knex.from(USERS).select('display_name').where({ display_name: displayName });
  if (duplicateUserDisplayName) {
    return next(new ConflictError('Duplicate display name found.', 'Display name is already in use.'));
  }
  // Check for duplicate user email
  const [duplicateUserEmail] = await knex.from(USERS).select('email').where({ email });
  if (duplicateUserEmail) {
    return next(new ConflictError('Duplicate email found.', 'Email address is already in use.'));
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
    return res.status(200).json({ displayName, token });
  } catch (error) {
    return next(new ServerError());
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new UnauthorizedError('Email and password are required to login.'));
  }
  try {
    const [user] = await knex.from(USERS).select('*').where({ email });
    if (!user) {
      return next(new UnauthorizedError('No user found with passed email.', 'No account exists with that email.'));
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordIsValid) {
      return next(new UnauthorizedError('Incorrect password for user.', 'Invalid email or password.'));
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res
      .status(200)
      .json({
        email: user.email,
        displayName: user.displayName,
        token,
      });
  } catch (error) {
    return next(new ServerError());
  }
});

// TODO: fix validation
// router.put('/validate', async (req, res, next) => {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(401).json({
//       error: 'No email sent to validate',
//     });
//   }
//   try {
//     const [user] = await knex.from(USERS).select('id', 'email_validated').where({ email });
//     if (!user) {
//       return res.status(404).json({
//         error: 'No user was found with that email',
//       });
//     }
//     if (user.email_validated) {
//       return res.status(409).json({
//         error: 'User has already validated their email',
//       });
//     }
//     knex(USERS).where({ id: user.id }).update({ email_validated: true });
//     return res.status(200).json({
//       message: 'Email address successfully validated.',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: 'Error while validating email address',
//     });
//   }
// });

module.exports = router;
