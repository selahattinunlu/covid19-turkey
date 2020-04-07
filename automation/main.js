const logger = require('./logger')
const login = require('./login')
const update = require('./update')
const checkUpdates = require('./checkUpdates')

const RUN_FOR_LOGIN = process.argv[2] === '--login';

(async () => {
  if (RUN_FOR_LOGIN) {
    return login()
  }

  logger.info('Automation was started...')

  await checkUpdates()
  await update()
})()

// Gracefully close
process.on('exit', () => {
  logger.info(`Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Mb`)

  logger.on('finish', function (info) {
    //
  })
})
