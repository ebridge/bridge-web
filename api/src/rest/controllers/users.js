
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendVerifyEmail, sendResetPasswordEmail } = require('../../services/nodemailer');
const knex = require('../../postgres/knex').getKnex();
const isAuthenticated = require('../middleware/isAuthenticated');
const { signJWToken } = require('../../lib/token');
const setUserPassword = require('../../lib/setUserPassword');
const { USERS } = require('../../lib/constants/tables');
const { userView } = require('../views/userViews');
const { getSpacesUrl } = require('../../services/getSpacesUrl');
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
    return res.status(200).json(req.user);
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
    sendVerifyEmail(id, email);
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

router.get('/verifyEmail', isAuthenticated, async (req, res, next) => {
  const { id, email } = req?.user;
  try {
    await sendVerifyEmail(id, email);
    return res.status(200).json({ email });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.put('/verifyEmail', async (req, res, next) => {
  const { emailToken } = req.body;
  if (!emailToken) {
    return next(new ValidationError(
      'No token sent to verifyEmail route',
      'Unable to verify email, please try again'
    ));
  }
  try {
    let decodedToken;
    try {
      decodedToken = jwt.verify(emailToken, process.env.JWT_VERIFY_EMAIL_SECRET);
    } catch (error) {
      logger.error(error);
      return next(new UnauthorizedError(
        'Invalid or expired token',
        'Invalid or expired token'
      ));
    }
    if (decodedToken.exp <= Date.now() / 1000) {
      return res.end();
    }
    const [user] = await knex(USERS)
      .where({ id: decodedToken.id })
      .select('id', 'email_confirmed');
    if (!user) {
      return next(new NotFoundError(
        'No user was found with that email',
        'No user was found with that email'
      ));
    }
    if (user.email_confirmed) {
      return next(new ConflictError(
        'User has already confirmed their email',
        'You\'ve already confirmed your email address'
      ));
    }
    await knex(USERS)
      .where({ id: user.id })
      .update({ email_confirmed: true });
    return res.status(200).json({
      message: 'Email address successfully confirmed.',
    });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

router.get('/resetPassword/:email', async (req, res, next) => {
  const { email } = req.params;
  if (!email) {
    return next(new ValidationError(
      'No email sent to GET resetPassword/:email route.',
      'No email sent to GET resetPassword/:email route.'
    ));
  }

  try {
    const [user] = await knex(USERS)
      .where({ email });
    if (!user) {
      return next(new NotFoundError(
        'No user was found with that email',
        'No user was found with that email'
      ));
    }
    await sendResetPasswordEmail(user.id, user.email);
    return res.status(200).json({ email });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

// User is logged in (reset from profile)
router.put('/resetPassword/authenticated', isAuthenticated, async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next(new ValidationError(
      'No password sent to PUT resetPassword/authenticated route.',
      'No password sent to PUT resetPassword/authenticated route.'
    ));
  }

  let id;
  if (req.user) {
    id = req.user.id;
  }

  if (!id) {
    return next(new UnauthorizedError(
      'No id from req.user',
      'Error when trying to change password. Please log out and back in.'
    ));
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    setUserPassword(id, hashedPassword);
    return res.status(200).json({
      message: 'Password successfully reset!',
    });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

// Reset from email token
router.put('/resetPassword', async (req, res, next) => {
  const { token, password } = req.body;
  if (!password || !token) {
    return next(new ValidationError(
      'No password or token sent to PUT resetPassword route.',
      'Error: No token. To reset your password, use the forgot password form first.'
    ));
  }

  let id;
  if (token) {
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);
      id = decodedToken.id;
    } catch (error) {
      logger.error(error);
      return next(new UnauthorizedError(
        'Invalid or expired token',
        'Invalid or expired token. Send a new reset email.'
      ));
    }
    if (decodedToken.exp <= Date.now() / 1000) {
      return res.end();
    }
  }
  if (!id) {
    return next(new UnauthorizedError(
      'Could not get user id from token',
      'Invalid or expired token. Send a new reset email.'
    ));
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    setUserPassword(id, hashedPassword);
    return res.status(200).json({
      message: 'Password successfully reset!',
    });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
});

// Change password from user account settings
router.put('/changePassword', isAuthenticated, async (req, res, next) => {
  const { id, currentPassword, password } = req.body;
  if (!currentPassword || !password || !id) {
    return next(new ValidationError(
      'Missing required parameters in PUT changePassword route.',
      'Error: missing required fields. Please refresh and try again.'
    ));
  }

  try {
    const [user] = await knex(USERS).where({ id });
    if (!user) {
      return next(new UnauthorizedError(
        'No user found with passed ID.',
        'Invalid user id.'
      ));
    }
    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!passwordIsValid) {
      return next(new UnauthorizedError(
        'Incorrect password.',
        'Incorrect current password.'
      ));
    }
    const hashedPasssword = bcrypt.hashSync(password, 8);
    setUserPassword(id, hashedPasssword);
    return res.status(200).json({
      message: 'Password set succesfully!',
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

// Generate picture upload URL with filename {displayName_#} and send it to the client
router.put('/picture-url/:userId', isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  const { filename } = req.body; // filename of uploaded picture (to get file ext)
  if (!userId) {
    return next(new ValidationError(
      'No id passed in in PUT /picture-url/:userI',
      'Unable to locate that user, no user ID passed.'
    ));
  }
  if (!filename) {
    return next(new ValidationError(
      'No filename passed in PUT /picture-url/:userId',
      'Please try again.'
    ));
  }

  try {
    const [{ display_name: displayName }] = await knex.from(USERS)
      .select('display_name')
      .where({ id: userId });
    const pictureUploadUrl = getSpacesUrl(filename, displayName);
    await knex(USERS)
      .where({ id: userId })
      .update({ profile_picture_status: 'pending' });
    return res.status(200).json({ pictureUploadUrl });
  } catch (err) {
    logger.error(err);
    return next(new ServerError());
  }
});

// Receive uploaded profile picture URL from client and store it in DB
router.put('/picture/:userId', isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  const { pictureUrl } = req.body;
  if (!userId) {
    return next(new ValidationError(
      'No id passed in query.',
      'Unable to locate that user, no user ID passed.'
    ));
  }

  try {
    await knex(USERS)
      .where({ id: userId })
      .update({
        profile_picture_url: pictureUrl,
        profile_picture_status: 'set',
      });
    return res.status(200).json({ message: 'Profile picture updated!' });
  } catch (err) {
    logger.error(err);
    return next(new ServerError());
  }
});

router.put('/:userId', isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  const { profile } = req.body;
  if (!userId) {
    return next(new ValidationError(
      'No id passed in query.',
      'Unable to locate that user, no user ID passed.'
    ));
  }

  const requesteeId = req.user.id;
  if (userId !== requesteeId) {
    return next(new UnauthorizedError(
      'User id mismatch while attempting update.',
      'Unable to edit another user\'s profile.'
    ));
  }
  try {
    const {
      name,
      birthDate,
      birthDateIsPrivate,
      bio,
      conventions,
      location,
    } = profile;
    const [updatedUser] = await knex(USERS)
      .where({ id: userId })
      .update({
        name,
        birth_date: birthDate,
        birth_date_is_private: birthDateIsPrivate,
        bio,
        conventions,
        location,
      }, '*');
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

module.exports = router;
