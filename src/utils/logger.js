import path from 'path';
import winston from 'winston';

// Resolve the log directory to be one level above `src`
const logDir = path.resolve('src', '..', 'logs');

/**
 * Configures a Winston logger with the following settings:
 * - Logs at the 'info' level or higher
 * - Logs in JSON format
 * - Writes error logs to 'error.log'
 * - Writes combined logs to 'combined.log'
 * - Adds a console transport with color formatting in non-production environments
 */
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ dirname: logDir, filename: 'error.log', level: 'error' }),
    new winston.transports.File({ dirname: logDir, filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.colorize(),
    })
  );
}
