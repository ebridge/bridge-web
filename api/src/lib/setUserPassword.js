const bcrypt = require('bcryptjs');
const knex = require('../postgres/knex').getKnex();
const { USERS } = require('./constants/tables');
const { ServerError } = require('./errors');
const logger = require('./logger')(module);

const setUserPassword = async (res, next, id, password) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    await knex(USERS)
      .where({ id })
      .update({ password_hash: hashedPassword });
    return res.status(200).json({
      message: 'Password successfully reset',
    });
  } catch (error) {
    logger.error(error);
    return next(new ServerError());
  }
};

module.exports = setUserPassword;
