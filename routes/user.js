const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const passport = require('passport')

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})
//註冊
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        console.log('The email has been registered')
        return res.render('register', {
          name,
          email,
          password,
          password2
        })
      } else if (password !== password2) {
        console.log('Passwords not the same')
        return res.render('register', {
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })
        newUser.save()
          .then(user => {
            return res.redirect('/')
          })
          .catch(err => console.error(err))
      }
    })
})
//登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})
//登入
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    FailureRedirect: '/user/login'
  })(req, res, next)
})
//登出
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/user/login')
})



module.exports = router