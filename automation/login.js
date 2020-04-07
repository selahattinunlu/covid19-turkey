const browserLauncher = require('./browserLauncher')
const logger = require('./logger')

module.exports = async () => {
  logger.info('Login...')
  const connection = await browserLauncher.launch({ headless: false })
  await connection.page.goto('https://www.facebook.com')
  await connection.page.waitFor('div[aria-label="Create a post"]', { timeout: 180000 })
  await connection.browser.close()
  process.exit()
}
