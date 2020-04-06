/* eslint-disable no-new */

import Chart from 'chart.js'
import testCaseCountsConfig from './test-case-counts.js'
import caseDeathCountsConfig from './case-death-counts.js'
import testCaseRateConfig from './testCaseRate.js'

window.onload = function () {
  new Chart(
    document.getElementById('test-case-statistics').getContext('2d'),
    testCaseCountsConfig
  )

  new Chart(
    document.getElementById('case-death-statistics').getContext('2d'),
    caseDeathCountsConfig
  )

  new Chart(
    document.getElementById('testCaseRate').getContext('2d'),
    testCaseRateConfig
  )
}
