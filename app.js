const express= require('express')
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const PORT= process.nextTick.PORT || 5000;
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const methodOverride = require('method-override')
var cookieParser = require('cookie-parser');
//passport config
require('./config/passport')(passport);

app.use(methodOverride('_method'))
/**************************** */
var http = require('http').Server(app);
var io = require('socket.io')(http);
/*
io.emit('message', "message");
console.log(" twas emitted");
io.on('message', ()=>{
    console.log(" twas emitted , here");
});

*/
//var userz = []
//var username = 1
/*
io.on('connection', (socket) =>{
  console.log('a user is connected', socket.id);
  //
  userz[user.id] = socket.id;
    console.log("the username", req.user.id)
  //socket.on("user_connected",(username)=>{
  //    userz[username] = socket.id;
    //  console.log("the username", username)
  //});
  //socket.emit("user_connected", username);
})
*/

//var connections = [];
app.set('socketio', io);
/*
app.set('connectionsss', connections);
io.set('authorization', function(handshake, callback) {
  if (handshake.headers.cookie) {
    cookieParser(handshake, null, function(err) {
      // Use depends on whether you have signed cookies
      // handshake.sessionID = handshake.cookies[session_key];
      handshake.sessionID = handshake.signedCookies[session_key];

      session_store.get(handshake.sessionID, function(err, session) {
        if (err || !session) {
          callback('Error or no session.', false);
        } else {
          handshake.session = session;
          callback(null, true);
        }
      });
    });
  } else {
    callback('No session cookie found.', false);
  }
});
io.sockets.on('connection', function(socket) {
  var session = socket.handshake.sessionl
  socket.set('pseudo', session.user, function() {
    socket.emit('pseudoStatus', 'ok');
    connections[session.user] = socket.id;
  });
});
*/
/************************************ */
//ejs maybe?! yes ejs here you tell the server that your view are ejs files
app.set('view engine', 'ejs');
// body parser, to get data from the form
//var urlencodedParser= bodyParser.urlencoded({ extended: false});
app.use( express.static( "public" ) );
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser());
mongoose.set('useFindAndModify', false);
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
app.use('/auth', require('./routes/auth'))
app.use('/offresco', require('./routes/offresco'))
app.use('/demandes', require('./routes/demandes'))
app.use('/offres', require('./routes/offres'))
app.use('/visites', require('./routes/visites'))
app.use('/contacter', require('./routes/chat'))
app.get('/auth/google/callback', passport.authenticate('google'));
//app.use(express.urlencoded({ extended: true }));
app.get('/talk',(req,res)=>{
    res.render('chatt')
})
//database
const db=require('./config/mdp').MongoURI;
const { Cookie } = require('express-session');
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('database connected'))
    .catch(err=> console.log(err))

//app.listen(PORT, console.log(`server started on ${PORT}`))
var server = http.listen(PORT, () => {
    console.log('server is running on port', server.address().port);
  });