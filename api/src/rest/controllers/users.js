
const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../postgres/knex').getKnex();
const isAuthenticated = require('../middleware/isAuthenticated');
const signJWToken = require('../../lib/token');
const { USERS } = require('../../lib/constants/tables');
const { USER_SELECTS } = require('../../lib/constants/selects');
const {
  ServerError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../../lib/errors');
const logger = require('../../lib/logger')(module);

const router = express.Router();

router.get('/authenticate', isAuthenticated, async (req, res, next) => {
  try {
    return res.status(200).json({ displayName: req.user.display_name });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.get('/:displayName', async (req, res, next) => {
  const { displayName } = req.params;
  if (!displayName) {
    return next(new NotFoundError(
      'No displayName in query.',
      'Unable to locate that user.'
    ));
  }
  try {
    const [user] = await knex(USERS)
      .select(USER_SELECTS)
      .whereRaw(
        'LOWER(display_name) LIKE \'%\' || LOWER(?) || \'%\' ',
        displayName.toLowerCase()
      );
    if (!user) {
      return next(new NotFoundError(
        'No user found with that displayName.',
        'Unable to locate that user.'
      ));
    }
    return res.status(200).json({ user });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.put('/:displayName', isAuthenticated, async (req, res, next) => {
  const requesteeDisplayName = req.user.display_name;
  const toBeUpdatedDisplayName = req.body.profile.displayName;
  const { bio } = req.body.profile;
  if (!toBeUpdatedDisplayName) {
    return next(new NotFoundError(
      'No displayName in query.',
      'Unable to locate that user.'
    ));
  }
  // TODO: more security?
  if (toBeUpdatedDisplayName !== requesteeDisplayName) {
    return next(new UnauthorizedError(
      'User attempting to update another user\'s profile.',
      'Unable to edit another user\'s profile.'
    ));
  }
  try {
    // Update just bio (for now), return the same user obj expected on a login or auth call
    const [updatedProfile] = await knex(USERS)
      .where({ display_name: requesteeDisplayName })
      .update({ bio }, USER_SELECTS);
    return res.status(200).json({ profile: updatedProfile });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.get('/logout', (req, res) => res.status(200).json({ token: null }));

router.post('/register', async (req, res, next) => {
  const { email, displayName, password } = req.body;
  if (!email || !displayName || !password) {
    return next(new UnauthorizedError(
      'Email, display name, and password were not passed to /register route.',
      'Email, display name and password are required to register new user.'
    ));
  }
  // Check for duplicate user email
  const [duplicateUserEmail] = await knex(USERS)
    .select('email')
    .whereRaw(
      'LOWER(email) LIKE \'%\' || LOWER(?) || \'%\' ',
      email.toLowerCase()
    );
  if (duplicateUserEmail) {
    return next(new ConflictError(
      'Duplicate email found.',
      'Email address is already in use.'
    ));
  }
  // Check for duplicate user display name
  const [duplicateUserDisplayName] = await knex(USERS)
    .select('display_name')
    .whereRaw(
      'LOWER(display_name) LIKE \'%\' || LOWER(?) || \'%\' ',
      displayName.toLowerCase()
    );
  if (duplicateUserDisplayName) {
    return next(new ConflictError(
      'Duplicate display name found.',
      'Display name is already in use.'
    ));
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const [userId] = await knex(USERS)
      .insert({
        id: uuidv4(),
        email,
        display_name: displayName,
        password_hash: hashedPassword,
      })
      .returning('id');
    // create and sign token
    const token = signJWToken(userId);
    return res.status(200).json({ displayName, token });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new UnauthorizedError(
      'Email and password were not passed to /login route.',
      'Email and password are required to login.'
    ));
  }
  try {
    const [user] = await knex(USERS)
      .select('*')
      .where({ email });
    if (!user) {
      return next(new UnauthorizedError(
        'No user found with passed email.',
        'Invalid email or password.'
      ));
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordIsValid) {
      return next(new UnauthorizedError(
        'Incorrect password for user.',
        'Invalid email or password.'
      ));
    }
    const { id } = user;
    const displayName = user.display_name;
    const token = signJWToken(id);
    return res.status(200).json({ displayName, token });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

// TODO: fix confirmation
// router.put('/confirmEmail', async (req, res, next) => {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(401).json({
//       error: 'No email sent to confirm',
//     });
//   }
//   try {
//     const [user] = await knex(USERS).select('id', 'email_confirmed').where({ email });
//     if (!user) {
//       return res.status(404).json({
//         error: 'No user was found with that email',
//       });
//     }
//     if (user.email_confirmed) {
//       return res.status(409).json({
//         error: 'User has already confirmed their email',
//       });
//     }
//     knex(USERS).where({ id: user.id }).update({ email_confirmed: true });
//     return res.status(200).json({
//       message: 'Email address successfully confirmed.',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: 'Error while confirming email address',
//     });
//   }
// });

module.exports = router;
