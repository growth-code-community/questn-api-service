import { setCookie } from "../../helpers/cookie.js";
import { generateTokens } from "../../helpers/generateToken.js";
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
    const newUser = await repository.create(validatedData);
    respond(res, 201, "Account created successfully.", { user: newUser });
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
    if (!user) return respond(res, 404, "User does not exist");
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) return respond(res, 401, "Invalid credentials");
    const { refreshToken, accessToken } = generateTokens(user.id);
    await repository.createToken(refreshToken);
    setCookie(res, refreshToken.token);
    return respond(res, 200, "Login successfull", { user, accessToken });
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
