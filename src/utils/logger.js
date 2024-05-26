const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const logger = createLogger({
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "src/storage/logs/error.log",
      level: "error",
    }),
    new transports.File({ filename: "src/storage/logs/combined.log" }),
  ],
});

module.exports = logger;
