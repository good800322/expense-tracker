const express = require('express')
const mongoose = require('mongoose')
const Record = require('../expenseTracker.js')
const expenseList = require('../../expense.json')

mongoose.connect('mongodb://localhost/expenseTracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('err', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
  Record.create(...expenseList)
})