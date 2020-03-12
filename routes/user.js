const express = require('express')
const router = express.Router()
const Record = require('../models/expenseTracker.js')

//註冊頁面
router.get('/register', (req, res) => {
  res.send('register page')
})
//註冊
router.post('/register', (req, res) => {
  res.send('register')
})
//登入頁面
router.get('/login', (req, res) => {
  res.send('login page')
})
//登入
router.post('/login', (req, res) => {
  res.send('login')
})
//登出
router.get('/logout', (req, res) => {
  res.send('logout')
})



module.exports = router