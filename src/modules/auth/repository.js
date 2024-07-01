import { logger } from "../../utils/logger.js";
import { Token, User } from "./model.js";


async function create(data) {
  try {
    return await User.create({
      email: data.email,
      password: data.password,
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

async function fetchUserByEmail(email) {
  try {
    return await User.findOne({ email: email });
  } catch (err) {
    logger.error(err.stack);
  }
}

async function createToken(data) {
  try {
    return await Token.create({
      user_id: data.userId,
      token_type: data.token_type,
      token: data.token,
    });
  } catch (err) {
    logger.error(err.stack);
  }
}

/**
 * Provides a set of repository functions for the auth module.
 */
const repository = {
  create,
  fetchUserByEmail,
  createToken
};

export default repository;
