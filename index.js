const express = require('express')
const app = express()
const User = require('./models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require('express-session')

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
app.use(session({ secret: 'notagoodsecret' }))

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect('login')
  }
  next()
}

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
  req.session.user_id = user._id
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
    req.session.user_id = user._id
    res.redirect('/secret')
  } else {
    res.redirect('/login')
  }
})

app.post('/logout', (req, res) => {
  req.session.user_id = null
  res.redirect('/login')
})

app.get('/secret', requireLogin, (req, res) => {
  res.render('secrets')
})

app.get('/topsecret', requireLogin, (req, res) => {
  res.send('Top Secret!!')
})

app.listen(5000, () => {
  console.log('Serving App!')
})
