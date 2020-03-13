const express = require('express')
const app = express()
const port = 300
const exphb = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/expenseTracker.js')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
//判別開發環境是否引入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect('mongodb://localhost/expenseTracker', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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
//passport
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport.js')(passport)
//取得並儲存現在登入之user
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated
  next()
})


//bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
//method-override
app.use(methodOverride('_method'))




//use routes
app.use('/', require('./routes/home.js'))
app.use('/expenses', require('./routes/expenses.js'))
app.use('/user', require('./routes/user.js'))
//facebook auth
app.use('/auth', require('./routes/auths.js'))

app.listen(port, () => {
  console.log(`the app is listening on http://localhost:${port}/`)
})