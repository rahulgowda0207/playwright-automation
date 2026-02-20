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
// level: 'debug' captures all levels (debug, info, warn, error)
// Console transport: colorized output in terminal
// File transport: writes to logs/test-execution.log (overwritten each run)
const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
    new transports.File({
      filename: 'logs/test-execution.log',
      format: fileFormat,
      options: { flags: 'w' }, // Day 6: Overwrite on each run for clean logs
    }),
  ],
});

export default logger;
