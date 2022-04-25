const express = require('express')
const app = express()
const User = require('./models/user')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/secret', (req, res) => {
  res.send('This is a secret! U cant see it unless logged in.')
})

app.listen(5000, () => {
  console.log('Serving App!')
})
