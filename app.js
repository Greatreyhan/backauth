// Third party Library
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

// Custom Middleware to Auth
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

// Local Key
const secret = require('./configs/keys')

// Routes
const authRouter = require('./routes/auth')

// Define  app
const app = express()

//  Middleware to access static file on public folder
app.use(express.static('public'))

// Middleware to get json
app.use(express.json())

// Middleware to access cookie
app.use(cookieParser())

// View Engine
app.set('view engine','ejs')

// Connect to MongoDB atlas
const dbURI = secret.dbURI
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => app.listen(3000))
.catch(err=> console.log(err))

// Router
app.get('*', checkUser)
app.use('/v1/auth',authRouter)
app.get('/v1/home', (req,res)=>{
    res.render('Home')
})
app.get('/v1/product',requireAuth, (req,res)=>{
    res.render('Product')
})

