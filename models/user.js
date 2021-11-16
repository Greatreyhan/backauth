const mongoose = require('mongoose')
// use email validator 
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

// Create Schema for document on MongoDB database
const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true,'Please enter an email'],
        unique: [true,'This email has ben taken'],
        lowercase: true,
        validate : [isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true,'Please enter a password'],
        minlength: [6,'Minimum password length is 6']
    }
})

// Using mongoose hooks that fire after event 'save'
// userSchema.post('save', (doc, next)=>{
//     console.log('after'),
//     next()
// })

// Using mongoose hooks that fire before event 'save
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Static method to login user
userSchema.statics.login =  async function(email,password){
    const user = await this.findOne({email})
    if(user){
        // get True if the password is fit
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            return user;
        }
        throw Error("incorrect password")
    }
    throw Error("incorrect email")
}

// Crete model for collection on Database
const User = mongoose.model('user',userSchema)

module.exports = User