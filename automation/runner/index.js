const cron = require('node-cron')
const { exec } = require('child_process')

const SCRIPT_PATH = '../'

cron.schedule('* * * * *', () => {
  console.log('run')
  const p = exec('node main.js --publish', { cwd: SCRIPT_PATH })

  p.on('exit', () => {
    const mUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    console.log('Program worked...')
    console.log(`Memory Usage: ${mUsage} Mb`)
  })
})
