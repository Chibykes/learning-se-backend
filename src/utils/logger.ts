import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Only allow log entries with level "http"
const onlyHttp = winston.format((info) =>
  info.level === "http" ? info : false
);

// Define a custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  // level: process.env.NODE_ENV === "development" ? "debug" : "info",
  level: "http",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Captures the stack trace for errors
    logFormat
  ),
  transports: [
    // 1. Output to the console with colors
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: "logs/http.log",
      format: combine(onlyHttp(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    }),

    // 2. Save errors to a file
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // 3. Save all logs to a file
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
