import { createLogger, format, transports } from 'winston';
import * as fs from 'fs';

// Day 6: Ensure logs directory exists before creating file transport
const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// --- Day 6: File format - plain text with timestamps ---
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  })
);

// --- Day 6: Console format - colorized for terminal readability ---
const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level}] ${message}`;
  })
);

// --- Day 6: Winston logger singleton ---
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
    // Use a per-process logfile to avoid multiple workers writing
    // to the same file concurrently. Also explicitly append.
    new transports.File({
      filename: `logs/test-execution-${process.pid}.log`,
      format: fileFormat,
      options: { flags: 'a' },
    }),
  ],
});

export default logger;
