var express = require('express');
var bodyParser = require('body-parser');
const Offre = require('./../models/offre');
const Message = require('./../models/message');
const User=require('../models/users')
const router = express.Router();

//var app = express();
//const socket = io('http://localhost:5000')
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
//var mongoose = require('mongoose');
var aname;
var idd;
var idz;
var clients = [];
var client;
var offre;
var userz = []

/*
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
*/

//app.set('view engine', 'ejs')

router.get('/messages', (req, res) => {
  var io = req.app.get('socketio');

  //var userz = req.app.get('userzz')
  io.on('connection', (socket) =>{
    console.log('a user is connected heeere', socket.id);
    
    userz[req.user.id] = socket.id;
    console.log("the username", req.user.id)
    //clients[idd] = socket.id;
    //console.log("the username", req.user.id)
  
  //socket.emit("user_connected", username);
  })
  //Message.find({name: { $in:[aname, req.user.name]},destinataire: { $in:[aname, req.user.name]}}
  Message.find({$or:[{name: aname, destinataire: req.user._id },{name: req.user.name, destinataire: idd }]},(err, messages)=> {
    res.send(messages);
  })
})


router.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})

router.get('/chat/:id', async(req, res)=>{
  var io = req.app.get('socketio');
  let clientsArray= []
  //const offre = await Offre.findById(req.params.id)
  const userr = await User.findById(req.params.id)
  console.log(userr.name)
  if(userr == null) res.redirect('/tous')
  aname = userr.name
  idd = userr.id
  
  //console.log("the username", aname,idd)
  //im trying smth here
   //const uzer = await User.find({id : req.user._id})
   //idz = uzer.id
   //console.log(idz)
  const messengers = await Message.find({destinataire : req.user._id, name :{$ne: req.user.name} }).distinct("username.id")
  console.log(messengers)
  messengers.forEach(async element => {
    const idis = await User.findById(element);
    clients[element] = idis.name;
    console.log("what should show",element)
    console.log("what shows",idis.name)
    //clientsArray.push(idis.name)
  });
  //console.log("the name is",aname)
  res.render('chatt', { userr: userr, user: req.user, io: io, messengers: messengers, clients: clients})
})

router.get('/chatt', async(req, res)=>{
  var io = req.app.get('socketio');
  const messengers = await Message.find({destinataire : req.user._id, name :{$ne: req.user.name} }).distinct("username.id")
  console.log(messengers)
  messengers.forEach(async element => {
    const idis = await User.findById(element);
    clients[element] = idis.name;
  });
  res.render('chattt', { user: req.user, io: io, messengers: messengers, clients: clients})
})
router.get('/', (req, res)=>{
  res.render('first')
})

router.post('/messages', async (req, res) => {
  var io = req.app.get('socketio');

  //var userz = req.app.get('connectionsss')
  /*
  io.on('connection', (socket) =>{
    console.log('a user is connected heeere', socket.id);
    
    userz[req.user.id] = socket.id;
    console.log("the username", message.username.id)
  
  //socket.emit("user_connected", username);
  })*/
  
  try{
    var message = new Message();

    message.destinataire = idd
    message.username = {
        id: req.user._id,
        name: req.user.name
    }
    message.message = req.body.message


    var savedMessage = await message.save()
      console.log('saved');

    var censored = await Message.findOne({message:'badword'});
      if(censored){ 
        await Message.remove({_id: censored.id})
    }else{
      var socketId = userz[idd]
      var socketId2 = userz[message.username.id]
      console.log("destso",socketId)
      console.log("emetso",socketId2)
      /*
      if(message.destinataire == req.user.id){
        socketId = userz[req.body.destinataire]
      }*/
      io.to(socketId).emit("message", message)
      //io.to(socketId2).emit("message", message)
      console.log("dest",message.destinataire)
      console.log("emetteur",req.user.id)
      //io.emit('message', message)
      console.log("emitted",message.name, message.message);
      
    }
        
      //res.sendStatus(200);
  }
  catch (error){
    //res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    //io.sockets.sockets[id].emit('identifier', data);   
    console.log('Message Posted')
  }

})


/*
var server = http.listen(3050, () => {
  console.log('server is running on port', server.address().port);
});
*/
module.exports = router;