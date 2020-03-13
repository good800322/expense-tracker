const express = require('express')
const router = express.Router()
const Record = require('../models/expenseTracker.js')
const { authenticated } = require('../config/auth.js')

router.get('/', authenticated, (req, res) => {
  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) console.error(err)
      //計算總額
      let sum = 0
      records.forEach(record => {
        sum += record.amount
      })
      return res.render('index', { records: records, sum: sum })
    })
})

module.exports = router