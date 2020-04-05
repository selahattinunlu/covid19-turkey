import testCaseCountsConfig from './test-case-counts.js'
import caseDeathCountsConfig from './case-death-counts.js'
import testCaseRateConfig from './testCaseRate.js'

window.onload = function() {
    var ctx = document.getElementById('test-case-statistics').getContext('2d');
    new Chart(ctx, testCaseCountsConfig);

    var ctx = document.getElementById('case-death-statistics').getContext('2d');
    new Chart(ctx, caseDeathCountsConfig);

    var ctx = document.getElementById('testCaseRate').getContext('2d');
    new Chart(ctx, testCaseRateConfig);
};