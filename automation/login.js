module.exports = async (browser, page) => {
  await page.goto('https://www.facebook.com')
  await page.waitFor('div[aria-label="Create a post"]', { timeout: 180000 })
  process.kill(process.pid, 'SIGKILL')
}
