const express = require('express')
const app = express()
const port = 300
const exphb = require('express-handlebars')

//template engine
app.engine('handlebars', exphb({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`the app is listening on http://localhost:${port}/`)
})