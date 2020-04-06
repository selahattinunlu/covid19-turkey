const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: 'logs.log' })
  ]
})

module.exports = logger
