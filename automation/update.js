const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')

const browserLauncher = require('./browserLauncher')
const logger = require('./logger')
const utils = require('./utils')

const RUN_FOR_PUBLISHING = process.argv[2] === '--publish'
const DATA_URL = 'https://covid19.saglik.gov.tr/'
const DATA_FILE_RELATIVE_PATH = '../data.json'
const FILE_RELATIVE_PATH_FOR_UPLOAD = './image.png'
const ROOT_PATH = path.resolve('..')

//

const evaluateInnerText = node => node.innerText

//

const pullChanges = () => new Promise(resolve => {
  const process = exec('git pull', { cwd: ROOT_PATH })
  process.on('exit', () => resolve(true))
})

const isThereNewData = (page) => new Promise(async (resolve) => {
  await page.goto(DATA_URL)

  const elements = await page.$$('.takvim p')

  const day = await elements[0].evaluate(evaluateInnerText)
  const month = await elements[1].evaluate(evaluateInnerText)
  const year = await elements[2].evaluate(evaluateInnerText)
  const date = `${year}-${utils.getMonthFromString(month)}-${day}`

  logger.info(`Last updated date: ${utils.formatDate(new Date(date))}`)

  resolve(
    !utils.isSameDate(
      new Date(utils.unformatDate(utils.getLastData().date)),
      new Date(date)
    )
  )
})

const getNewData = (page) => new Promise(async resolve => {
  await page.goto(DATA_URL)
  const liElements = await page.$$('.mtop-bosluk.buyuk-bilgi-l > ul > li')
  const testEl = (await liElements[0].$$('span'))[1]
  const caseEl = (await liElements[1].$$('span'))[1]
  const deathEl = (await liElements[2].$$('span'))[1]
  const recoverEl = (await liElements[3].$$('span'))[1]

  resolve({
    test: await testEl.evaluate(node => parseInt(node.innerText.replace('.', ''))),
    case: await caseEl.evaluate(node => parseInt(node.innerText.replace('.', ''))),
    death: await deathEl.evaluate(node => parseInt(node.innerText.replace('.', ''))),
    recover: await recoverEl.evaluate(node => parseInt(node.innerText.replace('.', '')))
  })
})

const appendData = async (newData) => {
  const data = require(DATA_FILE_RELATIVE_PATH)

  data.data.push({
    date: utils.formatDate(new Date()),
    ...newData
  })

  fs.writeFileSync(DATA_FILE_RELATIVE_PATH, JSON.stringify(data, null, 2), { flag: 'w' })
}

const build = () => new Promise(resolve => {
  logger.info('Build process is working now')
  const buildProcess = exec('npm run build', { cwd: '../' })
  buildProcess.stdout.on('data', data => logger.info(data))
  buildProcess.on('exit', () => {
    logger.info('build process was completed')
    resolve(true)
  })
  buildProcess.on('error', (err) => {
    logger.info(err.message)
  })
})

const takeScreenshot = (page) => new Promise(async resolve => {
  // fs.unlinkSync(FILE_RELATIVE_PATH_FOR_UPLOAD)
  await page.goto(`file://${ROOT_PATH}/index.html`)
  const el = await page.$('#test-case-rate-container')
  await page.waitFor(5000)
  await el.screenshot({
    path: FILE_RELATIVE_PATH_FOR_UPLOAD
  })
  resolve(true)
})

const postToFacebook = (page) => new Promise(async resolve => {
  const data = utils.getLastData()

  let message = `${utils.formatDate(new Date())}\n\n`
  message += `Bugün yapılan her 100 testten çıkan pozitif vaka sayısı: ${utils.calculatePercentage(data.case, data.test)}\n\n`
  message += `Test: ${data.test}\n`
  message += `Vaka: ${data.case}\n`
  message += `Vefat: ${data.death}\n`
  message += `İyileşen: ${data.recover}\n\n`
  message += 'https://covid19-turkey.netlify.com'

  await page.goto('https://facebook.com')
  await page.keyboard.press('KeyP')
  await page.keyboard.type(message)
  await page.waitFor(5000)

  const fileInputEl = await page.$('input[type=file]')
  await fileInputEl.uploadFile(FILE_RELATIVE_PATH_FOR_UPLOAD)
  await page.waitFor(15000)

  await page.click('div[aria-label="Create a post"] button[type=submit]')
  await page.waitFor(15000)
  resolve(true)
})

const deploy = () => new Promise(async resolve => {
  const process = exec('git add . && git commit -m "update data.json" && git push', { cwd: ROOT_PATH })
  process.stdout.on('data', d => console.log(d))
  process.on('exit', () => resolve(true))
})

module.exports = async () => {
  const connection = await browserLauncher.launch({ headless: true })

  logger.info('Updating...')

  const newData = await getNewData(connection.page)

  logger.info('New data was fetched...')

  await appendData(newData)

  logger.info('Data was appended into data.json...')

  // await build()

  // logger.info('Build completed...')

  // await takeScreenshot(connection.page)

  // logger.info('Screenshot was saved...')

  // if (RUN_FOR_PUBLISHING) {
  //   await postToFacebook(connection.page)
  //   logger.info('Post was sent to Facebook...')
  //   await deploy()
  //   logger.info('Application was deployed...')
  // }

  await connection.browser.close()

  logger.info('Update was completed.')

  process.exit()
}

module.exports.pullChanges = pullChanges
module.exports.isThereNewData = isThereNewData
