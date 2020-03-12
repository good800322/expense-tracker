const express = require('express')
const app = express()
const port = 300
const exphb = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/expenseTracker.js')

mongoose.connect('mongodb://localhost/expenseTracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

//連線異常
db.on('error', () => {
  console.log('Mongodb error!')
})
//連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//template engine
app.engine('handlebars', exphb({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('index')
})
app.get('/new', (req, res) => {
  res.render('new')
})

app.listen(port, () => {
  console.log(`the app is listening on http://localhost:${port}/`)
})