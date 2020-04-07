const puppeteer = require('puppeteer')

module.exports = {
  launch: async (options = { headless: true }) => {
    if (!options.headless) {
      options.userDataDir = '.data'
    }

    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 1900,
        height: 800
      },
      ...options
    })

    const page = await browser.newPage()

    return {
      browser,
      page
    }
  }
}
