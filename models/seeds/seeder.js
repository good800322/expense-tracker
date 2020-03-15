const express = require('express')
const mongoose = require('mongoose')
const Record = require('../expenseTracker.js')
const User = require('../user.js')
const expenseList = require('../../expense.json')
const userList = require('../../user.json')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/expenseTracker', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('err', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
  let users = []
  userList.forEach(user => {
    const newUser = new User(user)
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        newUser.password = hash
        newUser.save()
      })
    })
    users.push(newUser)
  })
  for (let i = 0; i < 3; i++) {
    expenseList[i].userId = users[0]._id
  }
  for (let i = 3; i < 5; i++) {
    expenseList[i].userId = users[1]._id
  }
  Record.create(...expenseList)
})