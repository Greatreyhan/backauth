const jwt = require('jsonwebtoken')
const key = require('../configs/keys')
const User = require('../models/user')

const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt

    // Check if token available
    if(token){

        // verify the token
        jwt.verify(token, key.jsonKey, (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }
            else{
                console.log(decodedToken)
                next()
            }
        })

    }
    else{
        res.redirect('/v1/auth/login')
    }
}

// Check current User
const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, key.jsonKey, async (err,decodedToken) => {
            if(err){
                console.log(err.message)
                res.locals.user = null
                next()
            }
            else{
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }
    else{
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkUser}