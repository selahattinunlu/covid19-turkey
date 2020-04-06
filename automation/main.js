const puppeteer = require('puppeteer')

const logger = require('./logger')
const login = require('./login')
const update = require('./update')

const RUN_FOR_LOGIN = process.argv[2] === '--login'

const launchBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: '.data',
    defaultViewport: {
      width: 1900,
      height: 800
    }
  })

  const page = (await browser.pages())[0]

  return [browser, page]
}

(async () => {
  logger.info('Automation was started...')

  if (RUN_FOR_LOGIN) {
    const [browser, page] = await launchBrowser()
    await login(browser, page)
    process.kill(process.pid)
  }

  await update.pullChanges()

  logger.info('Changes are pulled...')

  if (!(await update.isThereNewData())) {
    logger.info('There is no any new data')
    process.kill(process.pid)
  }

  logger.info('Updating...')

  const [browser, page] = await launchBrowser()
  await update(browser, page)

  logger.info('Update was completed.')
  process.kill(process.pid)
})()
