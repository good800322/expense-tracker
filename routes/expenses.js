const express = require('express')
const router = express.Router()
const Record = require('../models/expenseTracker.js')

router.get('/', (req, res) => {
  res.redirect('/')
})
//新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})
//新增
router.post('/new', (req, res) => {
  let { name, date, category, amount } = req.body
  amount = parseInt(amount)
  Record.findOne({ name: name, date: date, amount: amount, })
    .then(record => {
      //排除重複輸入（資料完全一樣）------????????warning??????
      if (record) {
        return res.render('new', {
          name,
          date,
          category,
          amount
        })
      } else {
        const newRecord = new Record({
          name,
          date,
          category,
          amount
        })
        newRecord.save()
          .then(record => {
            return res.redirect('/')
          })
          .catch(err => console.log(err))
      }
    })
})
//修改頁面
router.get('/edit/:id', (req, res) => {
  res.render('update')
})
//修改
router.post('/edit/:id', (req, res) => {
  res.res('update!')
})
//刪除
//新增頁面
router.get('/delete', (req, res) => {
  res.send('delete')
})

module.exports = router