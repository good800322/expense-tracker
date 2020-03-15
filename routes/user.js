const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const passport = require('passport')
const bcrypt = require('bcryptjs')

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})
//註冊
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  let errors = []
  if (!name || !email || !password || !password2) {
    errors.push({ message: '所有資料必須填妥' })
  }
  if (password !== password2) {
    errors.push({ message: '密碼填入錯誤' })
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ message: 'Email已被註冊' })
          return res.render('register', {
            errors,
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
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash
              newUser.save()
                .then(user => {
                  return res.redirect('/')
                })
                .catch(err => console.error(err))
            })
          })

        }
      })
  }
})
//登入頁面
router.get('/login', (req, res) => {
  console.log(req.session)
  res.render('login')
})
//登入
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureFlash: true,
    failureRedirect: '/user/login',
  })(req, res, next)
})
//登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已登出！')
  res.redirect('/user/login')
})



module.exports = router