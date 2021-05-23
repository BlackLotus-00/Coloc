const express= require('express');
const router= express.Router();
router.use(express.static('./public'))
const path=require('path');
const User=require('../models/users')
const bcrypt=require('bcryptjs');
const passport=require('passport');
const multer = require('multer');
const moment = require('moment');
var cookieParser = require('cookie-parser');
router.use(cookieParser());
//GOOGLE
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID= '32169756545-292ks3srcagog06e62va2nbii7v20pka.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);
//login page
router.get('/login', (req,res) => {
    //res.sendFile(path.resolve('./public/login.html'))
    res.render('login')
})
/*
router.get('/google', checkAuthenticated, (req,res) => {
    //res.sendFile(path.resolve('./public/login.html'))
    res.render('google',{
        user: req.user
    });
});

router.get('/hello', checkAuthenticated,(req,res) => {
    //res.sendFile(path.resolve('./public/login.html'))
    res.render('hello',{
        user: req.user});
})
*/

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
/*router.get('/google', passport.authenticate('google'), (req, res) => {
    res.send('you reached the redirect URI');
});*/
//register page
router.get('/register', (req,res) => {
    //res.sendFile(path.resolve('./public/register.html'))
    res.render('register')
})
router.get('/profil', (req,res)=> {
    if(req.user.status == "status2"){
        res.render('pro1', {
            user: req.user
      });
    }else{
        res.render('pro2', {
            user: req.user
      });
    }
    
})
//edit the profile
//i need this in order to be able to edit the psp
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/images');
    },

    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
})

const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*3,
    }
})

//edit everything but the pdp

//rendering the  editprofil view
router.get('/edit/:id', async (req, res)=>{
    const user = await User.findById(req.params.id)
    if(user==null) res.redirect('/profil')
    if(req.user.status == "status2"){
        res.render('editprofil', {user: user });
    }else{
        res.render('editprofil2', {user: user });
    }
    
})

//the editing
router.put('/:id', upload.single('image'), (req, res, next)=> {
    
    var dataRecords={
        name: req.body.name,
        email: req.body.email,
        phone: req.body.telnum,
        birthday: req.body.datenaissance,
    }
    
    var update= User.findByIdAndUpdate(req.params.id, dataRecords)
    update.exec((err, data)=>{
        if(err) throw err;
        try {
            res.redirect('/profil')
        }catch(e) {
            res.render('/editprofil', { user: data})
        }
    })
})

//edit the profile picture
//rendering the editpdp view
router.get('/edit-pdp/:id', async (req, res)=>{
    const user = await User.findById(req.params.id)
    if(user==null) res.redirect('/profil')
    res.render('editpdp', {user: user })
})

//the editiing
router.put('/pdp/:id', upload.single('image'), (req, res, next)=> {
    if(req.file){
        var dataRecords={
            image: req.file.filename,
        }
    }else{
        console.log('damn')
    }

    var update= User.findByIdAndUpdate(req.params.id, dataRecords)
    update.exec((err, data)=>{
        if(err) throw err;
        try {
            res.redirect('/profil')
        }catch(e) {
            res.render('users/editprofil', { user: data})
        }
    })
})



//register handle:
router.post('/register', (req,res)=> {
    //console.log(req.body)
    const {name, email,password,password2,birthday,status,phone}=req.body;
    let errors= [];
    //check required fields
    if(!name || !email || !password || !password2 || !birthday || !status) {
        errors.push({ msg: 'Veuillez remplir tous les champs'})
    }
    
    //check passwords match
    if(password !== password2) {
        errors.push({ msg: 'erreur au niveau du mot de passe'});
    }
    //password 6 caracters long
    if(password.length <6) {
        errors.push({ msg:'mot de passe trop court (plus de caracteres)'})
    }
    if (errors.length >0 ){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            birthday,
            status,
            phone
        });
    }else {
        //validation set
        //res.send('ok')
        User.findOne({ email: email})
            .then(user=> {
                if (user) {
                    //user already exists in dtaabase
                    errors.push({ msg: "L'adresse email existe déja"})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        birthday,
                        status,
                        phone
                    });

                } else {
                    // now we're facing a new user, we shold encrypt his password!! => bcrypt
                    const newUser= new User({
                        name, //vequivalent of name: name (es6)
                        email,
                        password,
                        birthday,
                        status,
                        phone
                    });
                    //console.log(newUser);
                    //hash password
                    bcrypt.genSalt(10, (err,salt)=> 
                    bcrypt.hash(newUser.password, salt,(err,hash)=> {
                        if(err=> console.log(err));
                        newUser.password=hash;
                        //save the new user
                        newUser.save()
                                .then(user=> {
                                    req.flash('success_msg', 'Vous etes enregistré.')//to disp^lay the message we need to add it on messages.ejs!!
                                    //not working unless login.ejs!! 
                                    //res.send('<script>alert("you are now registered")</script>'); 
                                    res.redirect('/users/login');
                                    //res.send('<script>alert("you are now registered")</script>'); 
                                    
        
                                })
                                .catch(err=> console.log(err))


                    }))
                }
            })
    }
   
});

//login with google

router.post('/google',(req,res)=> {
    let token= req.body.token;

    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        //console.log(payload);

      }
        verify()
        .then(()=>{
        res.cookie('session-token', token);
        res.send('success')
    })
        .catch(console.error);
      
})
function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        //user.picture = payload.picture;
        
      }
      verify()
        .then(()=>{
          req.user = user;
          next();
        })
        .catch(err=>{
          res.redirect('/login')
      })

}
//login Handle
router.post('/login',(req,res,next)=> {
    passport.authenticate('local', {
        successRedirect: '/profil',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req,res,next);
    
});

//logout handle
router.get('/logout',(req,res)=> {
    req.logout();
    req.flash('success_msg', 'vous etes deconnecté');
    res.redirect('/users/login')
});
//login with google


module.exports= router;