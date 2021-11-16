// Import user model
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const key = require('../configs/keys')

// Error handler
const errorHandler = (err)=>{
    let errors = {email: '', password: ''};

    // if email is incorrect
    if(err.message === "incorrect email"){
        errors.email = 'This email is not registered'
        return errors
    }

    // if password is incorrect
    if(err.message === "incorrect password"){
        errors.email = 'This password is incorrect'
        return errors
    }

    // duplicate error code
    if(err.code == 11000){
        errors.email = 'that email is already registered'
        return errors
    }

    // validator error
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })

        return errors;
    }
}

// Membuat waktu untuk cookie dalam detik
const maxAge = 3*24*60*60
const createToken = (id) =>{
    return jwt.sign({id},key.jsonKey,{
        expiresIn: maxAge
    })
}

const signup_page = (req, res, next) =>{
    res.render('SignUp')
}

const login_page = (req, res, next)=>{
    res.render('Login')
}

const signup = async (req, res, next) => {
    // Get data json from request HTTP
    const {email,password} = req.body

    try{
        // create user to database (asynchronous)
        const user = await User.create({email,password})
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({user : user._id})
    }
    catch(err){
        // If there is an error occured
        const errors = errorHandler(err)
        res.status(400).json({ errors })
    }
    
}

const login = async (req, res, next)=>{
    const {email,password} = (req.body)
    
    // Use static method in User model
    try{
        const user = await User.login(email,password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
        res.status(200).json({ user: user._id})
    }
    catch(err){
        const errors = errorHandler(err)
        res.status(400).json({ errors })
    }
}

const logout_page = (req, res, next) =>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/v1/home')
}

module.exports = {signup_page, login_page, signup, login, logout_page}