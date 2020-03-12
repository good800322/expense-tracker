const express = require('express')
const app = express()
const port = 300
const exphb = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/expenseTracker.js')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')

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

//session
app.use(session({
  secret: 'my key',
  resave: false,
  saveUninitialized: true
}))

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
//method-override
app.use(methodOverride('_method'))



//use routes
app.use('/', require('./routes/home.js'))
app.use('/expenses', require('./routes/expenses.js'))
app.use('/user', require('./routes/user.js'))

app.listen(port, () => {
  console.log(`the app is listening on http://localhost:${port}/`)
})