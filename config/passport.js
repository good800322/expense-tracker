const express = require('express')
const User = require('../models/user.js')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy


module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' },
      (email, password, done) => {
        User.findOne({ email: email })
          .then(user => {
            if (!user) {
              return done(null, false, { message: '無此使用者' })
            }
            //bcrypt檢查密碼
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err
              if (isMatch) {
                return done(null, user)
              } else {
                return done(null, false, { message: 'Email or Password incorrect' })
              }
            })
          })
          .catch(err => {
            if (err) console.error(err)
          })
      }))

  //facebook
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_URL,
    profileFields: ['email', 'displayName'],
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile._json.email })
      .then(user => {
        if (!user) {
          let randomPassword = Math.floor().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) => {
            if (err) console.error(err)
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              if (err) console.error(err)
              randomPassword = hash
              const newUser = new User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              newUser.save()
                .then(user => {
                  return done(null, user)
                })
                .catch(err => { if (err) console.error(err) })
            })
          })

        } else {
          return done(null, user)
        }
      })
      .catch(err => { if (err) console.error(err) })
  }))

  //session
  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .exec((err, user) => {
        if (err) console.error(err)
        return done(null, user)
      })
  })
}