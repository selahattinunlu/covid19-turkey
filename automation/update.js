const https = require('https')
const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')

const utils = require('./utils')

const DATA_URL = 'https://covid19.saglik.gov.tr/'
const DATA_FILE_RELATIVE_PATH = '../data.json'
const FILE_RELATIVE_PATH_FOR_UPLOAD = './image.png'
const ROOT_PATH = path.resolve('..')

const pullChanges = () => new Promise(resolve => {
  const process = exec('git pull', { cwd: ROOT_PATH })
  process.on('exit', () => resolve(true))
})

const isThereNewData = () => new Promise((resolve) => {
  const req = https.get(DATA_URL, { method: 'HEAD' })

  req.on('response', res => {
    if (res.statusCode !== 200) {
      // TODO: log that we can't response from the site
    }

    req.abort()

    resolve(
      !utils.isSameDate(
        new Date(utils.unformatDate(utils.getLastData().date)),
        new Date(`${res.headers.date}+03:00`)
      )
    )
  })
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
  const buildProcess = exec('npm run build', { cwd: '../' })
  buildProcess.on('exit', () => resolve(true))
})

const takeScreenshot = (page) => new Promise(async resolve => {
  await page.goto(`file://${ROOT_PATH}/index.html`)
  const el = await page.$('#test-case-rate-container')
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

  // click submit
  // await page.click('div[aria-label="Create a post"] button[type=submit]');
  // can’t find reliable way to detect that it posted successfully,
  // but if we close too soon it won’t finish the post request
  // await new Promise(res => setTimeout(res, 2000))}
  // await browser.close();

  resolve(true)
})

const deploy = () => new Promise(async resolve => {
  const process = exec('git add . && git commit -m "update" && git push', { cwd: ROOT_PATH })
  process.stdout.on('data', d => console.log(d))
  process.on('exit', () => resolve(true))
})

module.exports = async (browser, page) => {
  await pullChanges()

  console.log('pull changes completed')

  if (!(await isThereNewData())) {
    console.log('yeni data yok')
    return
  }

  const newData = await getNewData(page)
  // await appendData(newData)
  await build()
  // await takeScreenshot(page)
  // await postToFacebook(page)
  await deploy()

  console.log('deploy tamamlandı')

  process.kill(process.pid)
}
