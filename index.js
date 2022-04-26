const express = require('express')
const app = express()
const User = require('./models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose
  .connect('mongodb://0.0.0.0:27017/authNoSql')
  .then(() => {
    console.log('MONNGO CONNECTION OPEN!!!')
  })
  .catch((err) => {
    console.log('OH NO MONGO ERROR!!!!')
    console.log(err)
  })

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Home Page!')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const hash = await bcrypt.hash(password, 12)
  const user = new User({
    username: username,
    password: hash,
  })
  await user.save()
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const validPassword = await bcrypt.compare(password, user.password)
  if (validPassword) {
    res.send('YAY Welcome!')
  } else {
    res.send('Try Again!')
  }
})

app.get('/secret', (req, res) => {
  res.send('This is a secret! U cant see it unless logged in.')
})

app.listen(5000, () => {
  console.log('Serving App!')
})
