const winston = require('winston');
const { format } = require('winston');
const { combine, timestamp, printf } = format;
require('winston-daily-rotate-file');

const consoleFormat = printf(info => {
  return `${info.timestamp} [${info.level}] ${info.message}`;
});

const logTransport = new winston.transports.DailyRotateFile({
  filename: './logs/mdstbooks-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '30m',
  maxFiles: '14d'
});

const execptionTransport = new winston.transports.File({
  filename: './logs/exceptions.log'
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), format.splat(), winston.format.json()),
  transports: [logTransport],
  exceptionHandlers: [execptionTransport],
  // exitOnError: false
});

logger.add(
  new winston.transports.Console({
    format: combine(winston.format.colorize(), consoleFormat, format.splat())
  })
);

module.exports = logger;
