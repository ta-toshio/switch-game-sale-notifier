import createGameRowData from './createGameRawData'
import createGameSaleRawData from './createGameSaleRawData'
import notifySale from './notifySale'
const moment = require('moment')

exports.handler = async (event) => {

  let result
  const m = moment().minute()

  if (0 < m && m < 10) {
    result = await createGameRowData()
  }

  if (10 < m && m < 20) {
    result = await createGameSaleRawData()
  }

  if (21 < m && m < 59) {
    result = await notifySale()
  }

  return result
}