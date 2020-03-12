const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.redirect('/')
})
//新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})
//新增
router.post('/', (req, res) => {
  res.res('creation!')
})
//修改頁面
router.get('/edit/:id', (req, res) => {
  res.render('update')
})
//修改
router.post('/edit/:d', (req, res) => {
  res.res('update!')
})
//刪除
//新增頁面
router.get('/delete', (req, res) => {
  res.send('delete')
})

module.exports = router