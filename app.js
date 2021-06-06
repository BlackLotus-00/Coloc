const express= require('express')
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const PORT= process.nextTick.PORT || 5000;
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
var cookieParser = require('cookie-parser');
//passport config
require('./config/passport')(passport);



//ejs maybe?!
app.set('view engine', 'ejs');
// body parser, to get data from the form
//var urlencodedParser= bodyParser.urlencoded({ extended: false});
app.use( express.static( "public" ) );
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser());
//express-session middeleware 
app.use(session({
    secret: 'something doesnt matter',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()) //for flash-messages
//global vars for color_msgs
app.use((req,res,next)=> {
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    
    next();
})
//ROUTES
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/profil', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.get('/auth/google/callback', passport.authenticate('google'));
//app.use(express.urlencoded({ extended: true }));

//database
const db=require('./config/mdp').MongoURI;
const { Cookie } = require('express-session');
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('database connected'))
    .catch(err=> console.log(err))



app.listen(PORT, console.log(`server started on ${PORT}`))