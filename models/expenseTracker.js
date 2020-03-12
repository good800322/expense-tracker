const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema //no ()

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {    //因為會顯示到幾時幾分所以改用string
    type: String,
    // type: Date,
    // default: Date.now,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: false
  },
  userId: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Record', recordSchema)
//(name, Schema)