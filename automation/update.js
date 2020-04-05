const https = require('https')
const fs = require('fs')
const { exec } = require('child_process')

const utils = require('./utils')

const DATA_URL = 'https://covid19.saglik.gov.tr/'
const FILE_NAME_FOR_UPLOAD = './image.png'

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
  const data = require('../data.json')

  data.data.push({
    date: utils.formatDate(new Date()),
    ...newData
  })

  fs.writeFileSync('../data.json', JSON.stringify(data, null, 2), { flag: 'w' })
}

const build = () => new Promise(resolve => {
  const buildProcess = exec('npm run build', { cwd: '../' })
  buildProcess.on('exit', () => resolve(true))
})

module.exports = async (browser, page) => {
  if (!(await isThereNewData())) {
    console.log('yeni data yok')
    return
  }

  const newData = await getNewData(page)

  await appendData(newData)

  await build()

  return

  // use keyboard shortcut to open and focus on create new post
  await page.keyboard.press('KeyP')
  await page.keyboard.type('Deneme bir yazı')
  await page.waitFor(5000)

  const fileInputEl = await page.$('input[type=file]')
  await fileInputEl.uploadFile('./image.png')

  // // click submit
  // await page.click('div[aria-label="Create a post"] button[type=submit]');
  // // can’t find reliable way to detect that it posted successfully,
  // // but if we close too soon it won’t finish the post request
  // await new Promise(res => setTimeout(res, 2000));
  // }
  // await browser.close();

  console.log('deneme')
}
