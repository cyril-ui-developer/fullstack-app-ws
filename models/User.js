const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
// module.exports = mongoose.model('User', {
//     email: String,
//     pwd: String
// })

// module.exports = mongoose.model('User', {
//     email: String,
//     pwd: String,
//     name:String,
//     description: String
// })
const userSchema = new mongoose.Schema({
    email: String,
    pwd: String,
    name:String,
    description: String
})


userSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified('pwd'))
    return next()

    bcrypt.hash(user.pwd, null, null, (err, hash)=>{
        if(err) return next(err)

        user.pwd = hash
        next();
        console.log(hash)
    })
})

module.exports = mongoose.model('User',userSchema )