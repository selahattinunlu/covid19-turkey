const data = require('../data.json')

const getLastData = () => {
  return data.data[data.data.length - 1]
}

/**
 *
 * @param {Date} dateA
 * @param {Date} dateB
 */
const isSameDate = (dateA, dateB) => {
  return formatDate(dateA) === formatDate(dateB)
}

/**
 *
 * @param {Date} date
 */
const formatDate = (date) => {
  const normalize = (val) => String(val).padStart(2, '0')
  return `${normalize(date.getDate())}.${normalize(date.getMonth() + 1)}.${date.getFullYear()}`
}

/**
 *
 * @param {string} date
 */
const unformatDate = date => {
  const splitted = date.split('.')
  return `${splitted[2]}-${splitted[1]}-${splitted[0]}`
}

const calculatePercentage = (numberA, numberB) => Math.round((numberA / numberB) * 100)

module.exports = {
  getLastData,
  unformatDate,
  formatDate,
  isSameDate,
  calculatePercentage
}
