const express = require('express')
const app = express()
const port = 300
const exphb = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/expenseTracker.js')
const bodyParser = require('body-parser')

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

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) console.error(err)
      //計算總額
      let sum = 0
      records.forEach(record => {
        sum += record.amount
      })
      return res.render('index', { records: records, sum: sum })
    })
})
//use routes for /expense
app.use('/expenses', require('./routes/expenses.js'))

app.listen(port, () => {
  console.log(`the app is listening on http://localhost:${port}/`)
})