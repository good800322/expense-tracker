const express = require('express')
const router = express.Router()
const Record = require('../models/expenseTracker.js')
const { authenticated } = require('../config/auth.js')

router.get('/', authenticated, (req, res) => {
  res.redirect('/')
})
//新增頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})
//新增
router.post('/new', authenticated, (req, res) => {
  let { name, date, category, amount } = req.body
  amount = parseInt(amount)
  Record.findOne({ name: name, date: date, amount: amount })
    .then(record => {
      //排除重複輸入（資料完全一樣）#############?warning??????
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
          amount,
          userId: req.user._id
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
router.get('/edit/:id', authenticated, (req, res) => {
  Record.findById({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, record) => {
      if (err) console.error(err)
      //###############??????如何顯示種類
      return res.render('update', { record: record })
    })
})
//修改
router.put('/edit/:id', authenticated, (req, res) => {
  // let { name, date, category, amount } = req.body
  // amount = parseInt(amount)
  req.body.amount = parseInt(req.body.amount)
  Record.findById({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) console.error(err)
    //###########################編輯方法
    for (let key in record) {
      if (req.body[key]) {
        record[key] = req.body[key]
      }
    }
    record.save(err => {
      if (err) console.error(err)
      return res.redirect('/')
    })
  })
  // Record.findById({ _id: req.params.id })
  //   .lean()
  //   .exec((err, record) => {
  //     if (err) console.error(err)
  //     //??????如何顯示種類
  //     record = Record({
  //       name,
  //       date,
  //       category,
  //       amount
  //     })
  //     record.save()
  //       .then(record => {
  //         return res.redirect('/')
  //       })
  //       .catch(err => console.error(err))
  //   })
})

//刪除
router.delete('/delete/:id', authenticated, (req, res) => {
  Record.findById({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) console.error(err)
    record.remove(err => {
      if (err) console.error(err)
      return res.redirect('/')
    })
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