const browserLauncher = require('./browserLauncher')
const logger = require('./logger')
const update = require('./update')

module.exports = async () => {
  // await update.pullChanges()

  // logger.info('Changes are pulled...')

  const connection = await browserLauncher.launch()

  if (!(await update.isThereNewData(connection.page))) {
    logger.info('There is no any new data')
    await connection.browser.close()
    process.exit()
  }
}
