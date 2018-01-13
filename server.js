const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs')
const app = express();


const User = require('./models/User.js');
const auth = require('./auth.js')
const Post = require('./models/Post.js');
mongoose.Promise = Promise;

// const posts =[
//     {message:'hi'},
//     {message:'hello'}
// ]

app.use(cors());
app.use(bodyParser.json());



app.get('/posts/:id', async (req,res) =>{
    //res.send(posts);
    // get actual post
    const author = req.params.id;
   const posts= await  Post.find({author})
   res.send(posts)
})

// app.post('/register', (req,res) => {
//     const userData = req.body;

//     const user = new User(userData);

//     user.save((err, result) =>{
//         if(err){
//             console.log("Saving user error")
//         }
//         console.log(userData);
//         res.sendStatus(200)
        
//     })

// })

// app.post('/login', async (req, res, next ) => {
//     try {
//     const loginData = req.body;

//     const user = await (User.findOne({email:userData.email}))

//     if(!user){
//         return res.status(401).send({message:"Email or password invalid"})
//     }

//     if(userData.pwd != user.pwd){
//         console.log(userData.pwd);
//         console.log(user);
//         return res.status(401).send({message:"Invalid Email or password"})
//     }

//     const payload={email:user.email}
//     const token = jwt.encode(payload,"123")
//         console.log(userData);
//         res.status(200).send({token})
//     } catch (e) {
//         //this will eventually be handled by your error handling middleware
//         next(e) 
//       }
// })
// app.post('/login', async (req, res, next ) => {

//     const loginData = req.body;

//     const user = await (User.findOne({email:loginData.email}))

//     if(!user){
//         return res.status(401).send({message:"Email or password invalid"})
//     }
//     bcrypt.compare(loginData.pwd, user.pwd, (err,isMatch) => {
//      if(!isMatch)
//      return res.status(401).send({message:"Email or password invalid"})
//      const payload={email:user.email}
//      const token = jwt.encode(payload,"123")
//          console.log(loginData);
//          res.status(200).send({token})
//     })

// })
app.get('/users', async (req,res) =>{
    try{
       // console.log()
        const users = await User.find({}, '-pwd -__v')
        res.send(users);
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }

})


app.get('/profile/:id', async (req,res) =>{
    try{
        const user = await User.findById(req.params.id, '-pwd -__v')
        res.send(user);
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
 // res.sendStatus(200)
})

//associating post to user
app.post('/post',auth.checkAuthentication, (req,res)=>{
    try{
    const postData = req.body
    postData.author=  req.userId;
    const post = new Post(postData)
console.log(req.userId)

    post.save((err, result) =>{
        if(err){
            console.error("posting user error")
            return res.status(500).send({massage:"posting error"})
        }
       
        res.sendStatus(200)
        
    })} catch(error){
        console.error(error)
        res.sendStatus(500)
    }
})
// app.post('/post', (req,res)=>{
    
//     const post = new Post(req.body)


//     post.save((err, result) =>{
//         if(err){
//             console.error("posting user error")
//             return res.status(500).send({massage:"posting error"})
//         }
       
//         res.sendStatus(200)
        
//     })
// })
mongoose.connect('mongodb://test:test@ds239557.mlab.com:39557/jt_social',(err) =>{
    if(!err){
        console.log('Connected to Mongo')
    }
});

app.use('/auth', auth.router)
app.listen(process.env.PORT || 3000)