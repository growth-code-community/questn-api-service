import jwt from "jsonwebtoken";
import repository from "../modules/auth/repository.js";
import dotenv from "dotenv";
import { respond } from "../utils/respond.js";
dotenv.config();
const { JWT_SECRET } = process.env;

/**
 * Middleware function that validates the JWT from the Authorization header.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
export function validateJwt(req, res, next) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) return respond(res, 400, "Access token required!");
  jwt.verify(accessToken, JWT_SECRET, (err, payload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return respond(
          res,
          401,
          "Your session has expired. Please log in again."
        );
      }
      return respond(res, 401, "Unauthorized access. Please log in.");
    }
    req.accessToken = accessToken;
    req.userId = payload.sub;
    next();
  });
}

/**
 * Middleware function that ensures the user being registered is unique by checking their email.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 * @returns {Promise<void>}
 */
export async function ensureUniqueUser(req, res, next) {
  try {
    const existingUser = await repository.fetchUserByEmail(req.body.email);
    if (existingUser) {
      return respond(res, 409, "Account already exist!");
    }
    next();
  } catch (err) {
    next(err);
  }
}


