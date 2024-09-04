import winston from 'winston';
import 'winston-daily-rotate-file';

// Define custom log levels and colors
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
};

// Add custom colors to winston
winston.addColors(logColors);

// Create a daily rotate file transport
const transport = new winston.transports.DailyRotateFile({
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d', // Keep logs for 14 days
    dirname: 'logs', // Directory where logs will be stored
});

// Create a winston logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug', // Use debug level in development
    levels: logLevels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        transport, // Log to file with rotation
    ],
});

export default logger;
