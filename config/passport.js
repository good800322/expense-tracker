const express = require('express')
const User = require('../models/user.js')
const LocalStrategy = require('passport-local').Strategy


module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' },
      (email, password, done) => {
        User.findOne({ email: email })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'no this user' })
            }
            if (user.password !== password) {
              return done(null, false, { message: 'email or password incorrect' })
            }
            return done(null, user)
          })
          .catch(err => {
            if (err) console.error(err)
          })
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