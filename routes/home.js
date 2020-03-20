const express = require('express')
const router = express.Router()
const Record = require('../models/expenseTracker.js')
const { authenticated } = require('../config/auth.js')

router.get('/', authenticated, (req, res) => {
  Record.find({ userId: req.user._id })
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
//sort
router.get('/sort/:category', authenticated, (req, res) => {
  //重新組合成category格式
  const category = 'fas ' + req.params.category
  Record.find({ category: category, userId: req.user._id })
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