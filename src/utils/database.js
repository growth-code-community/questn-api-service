import dotenv from "dotenv";
import { logger } from "./logger.js";
import mongoose from "mongoose";
dotenv.config();
const { DATABASE_URI } = process.env;


 
/**
 * Connects to the database using the configured DATABASE_URI.
 *
 * This function attempts to establish a connection to the database using the
 * DATABASE_URI environment variable. If the connection is successful, a success
 * message is logged. If there is an error, an error message is logged.
 */
export async function ConnectToDatabase() {
  try {
    await mongoose.connect(DATABASE_URI);
    logger.info("Database connection successfull");
  } catch (err) {
    logger.error("Error connecting to database", err);
  }
}
