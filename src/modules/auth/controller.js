import { setCookie } from "../../helpers/cookie.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/generateToken.js";
import { respond } from "../../utils/respond.js";
import repository from "./repository.js";
import { loginSchema, signUpSchema } from "./schema.js";
import bcrypt from "bcrypt";

/**
 * Signs up a new user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the signup request.
 * @throws {Error} - Any error that occurs during signup.
 */
export async function signup(req, res, next) {
  try {
    const validatedData = await signUpSchema.validateAsync(req.body);
    await repository.create(validatedData);
    respond(res, 201, "Account created successfully.");
  } catch (err) {
    next(err);
  }
}

/**
 * Logs in a user using email and password.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the login request.
 * @throws {Error} - Any error that occurs during login.
 */
export async function login(req, res, next) {
  try {
    const validatedData = await loginSchema.validateAsync(req.body);
    const user = await repository.fetchUserByEmail(validatedData.email);
    if (!user || !(await bcrypt.compare(validatedData.password, user.password)))
      return respond(res, 401, "Invalid credentials");
    const { access_token } = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await repository.createToken(refreshToken);
    setCookie(res, refreshToken.token);
    return respond(res, 200, "Login successfull", { access_token });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles Google login flow.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A promise that resolves after handling the Google login flow.
 * @throws {Error} - Any error that occurs during Google login flow handling.
 */
export async function google(req, res, next) {
  try {
    const refreshToken = generateRefreshToken(req.user.userId);
    const access_token = req.user.access_token;
    await repository.createToken(refreshToken);
    setCookie(res, refreshToken.token);
    return respond(res, 200, "Login successfull", { access_token });
  } catch (err) {
    next(err);
  }
}
