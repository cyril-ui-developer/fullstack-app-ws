const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();

const User = require('./models/User.js');

router.post('/register', (req,res) =>{
    const userData = req.body;
    
        const user = new User(userData);
    
        user.save((err, newUser) =>{
            if(err){
                return res.status(500).send({message:"error saving user"})
            }
            createSendToken(res, newUser)
            
        })
})
//saving user id in token
router.post('/login', async (req,res, next)=>{
        const loginData = req.body;
        
            const user = await (User.findOne({email:loginData.email}))
        
            if(!user){
                return res.status(401).send({message:"Email or password invalid"})
            }
            bcrypt.compare(loginData.pwd, user.pwd, (err,isMatch) => {
             if(!isMatch)
             return res.status(401).send({message:"Email or password invalid"})
             const payload={sub:user._id}
             const token = jwt.encode(payload,"123")
                 console.log(loginData);
                 res.status(200).send({token})
            })
    })
// router.post('/login', async (req,res, next)=>{
//     const loginData = req.body;
    
//         const user = await (User.findOne({email:loginData.email}))
    
//         if(!user){
//             return res.status(401).send({message:"Email or password invalid"})
//         }
//         bcrypt.compare(loginData.pwd, user.pwd, (err,isMatch) => {
//          if(!isMatch)
//          return res.status(401).send({message:"Email or password invalid"})
//          const payload={email:user.email}
//          const token = jwt.encode(payload,"123")
//              console.log(loginData);
//              res.status(200).send({token})
//         })
// })

const auth={
    router,
    checkAuthentication: (req,res, next)=>{
        if(!req.header('authorization'))
         return res.status(401).send({message:"unauthorized. Header is missing"})
      
         const token = req.header('authorization').split(' ')[1]
      
         const payload = jwt.decode(token, '123') 
      
         if(!payload)
          return res.status(401).send({message:"unauthorized. auth header invalid "})
      
          req.userId = payload.sub
      
          next()
      
      
      
      }
}

function createSendToken(res, user){
    const payload={sub:user._id}
    const token = jwt.encode(payload,"123")
        //console.log(loginData);
        res.status(200).send({token})

}
module.exports = auth