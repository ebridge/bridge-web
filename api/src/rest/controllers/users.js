
const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../postgres/knex').getKnex();
const isAuthenticated = require('../middleware/isAuthenticated');
const signJWToken = require('../../lib/token');
const { USERS } = require('../../lib/constants/tables');
const { userView } = require('../views/userViews');
const {
  ServerError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../../lib/errors');
const logger = require('../../lib/logger')(module);

const router = express.Router();

router.get('/authenticate', isAuthenticated, async (req, res, next) => {
  try {
    return res.status(200).json({
      displayName: req.user.displayName,
      id: req.user.id,
    });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.get('/:idOrDisplayName', isAuthenticated, async (req, res, next) => {
  const { idOrDisplayName } = req.params;
  if (!idOrDisplayName) {
    return next(new ValidationError(
      'No id or displayName in query.',
      'Unable to locate that user.'
    ));
  }
  let user;
  try {
    // If idOrDisplayName is a valid uuidv4, try to get by ID
    [user] = await knex(USERS)
      .select('*')
      .where({ id: idOrDisplayName })
      .orWhereRaw(
        'LOWER(display_name) LIKE \'%\' || LOWER(?) || \'%\' ',
        idOrDisplayName.toLowerCase()
      );
    if (user) {
      return res.status(200).json(userView(user));
    }
    return next(new NotFoundError(
      'No user found with that id or displayName.',
      'Unable to locate that user.'
    ));
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.put('/:idOrDisplayName', isAuthenticated, async (req, res, next) => {
  const { idOrDisplayName } = req.params;
  if (!idOrDisplayName) {
    return next(new ValidationError(
      'No id or displayName in query.',
      'Unable to locate that user.'
    ));
  }

  const requesteeId = req.user.id;
  const toBeUpdatedId = req.body.id;
  const { bio } = req.body.profile;
  if (!toBeUpdatedId) {
    return next(new ValidationError(
      'No id found in query.',
      'Unable to locate that user.'
    ));
  }
  if (toBeUpdatedId !== requesteeId) {
    return next(new UnauthorizedError(
      'User id mismatch while attempting update.',
      'Unable to edit another user\'s profile.'
    ));
  }
  try {
    // Update just bio (for now), return the same user obj expected on a login or auth call
    const [updatedUser] = await knex(USERS)
      .where({ id: idOrDisplayName })
      .orWhereRaw(
        'LOWER(display_name) LIKE \'%\' || LOWER(?) || \'%\' ',
        idOrDisplayName.toLowerCase()
      )
      .update({ bio }, '*');
    if (updatedUser) {
      return res.status(200).json(userView(updatedUser));
    }
    return next(new NotFoundError(
      'No user found with that id or displayName.',
      'Unable to locate that user.'
    ));
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.get('/logout', (req, res) => res.status(200).json({ token: null }));

router.post('/register', async (req, res, next) => {
  const { email, displayName, password } = req.body;
  if (!email || !displayName || !password) {
    return next(new ValidationError(
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
    const [id] = await knex(USERS)
      .insert({
        id: uuidv4(),
        email,
        display_name: displayName,
        password_hash: hashedPassword,
      })
      .returning('id');
    // TODO: Return user view
    return res.status(200).json({
      id,
      displayName,
      email,
    });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password, remember } = req.body;
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
    const token = signJWToken(id, remember);
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
