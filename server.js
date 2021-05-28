require(`./models/db`)

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const colocController = require('./controllers/coloc.controller')

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(bodyParser.json());
app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({
    extname:'hbs',
    defaultLayout:'mainLayout',
    layoutsDir:__dirname + '/views/layouts/',
    //handlebars: allowInsecurePrototypeAccess(Handlebars),
}));
app.set('view engine','hbs');
const server = app.listen(3000,()=>{
    console.log(`Express server started at port : 3000`);
});
let io = require('socket.io')(server);
io.on('connection', (socket) => {
   
    // this function will be fired whenever a socket (browser tab) gets connected.
    
    // we are receiving a object named 'socket' which is an instance of connected client 
    
    socket.on('comment', (data) => {
         
         // this will be fired whenever a 'comment' event gets fired.
         
         // getting current timestamp
         
         data.time = Date()
         
         // sending back an event to all other clients named 'comment', which we are already listening in client side
         
         socket.broadcast.emit('comment', data)
     
     })
    
 });

 const Offre_demande = mongoose.model('Offre_demande');
//comments
// to save comments
app.post('/api/comments', (req, res) => {
    //const comment = new Comment({
        console.log('process..')
    let OID = req.body.ObjectID;
    const data = [{Owner: req.body.username,
    Text: req.body.comment}]
    console.log('process.. 2')
    //})
    //comment.save().then(response => {
    //    res.send(response)
    //})
    Offre_demande.findOne({_id:OID},(err,foundObject)=>{
        console.log('process.. 3')
        if(!err){
            if(!foundObject) {
                console.log('process.. 4')
                res.status(404).send();

            }else{
                console.log('process.. 5')
                data.forEach(function(value)
                    {foundObject.comment.push(value)});
                    
                //foundObject.comment.Text = dataText;
                //foundObject.comment.owner = dataOwner;
                foundObject.save().then(response => {
                        res.send(response)
                });
            }
        }else{
            console.log(err);
            res.status(500).send();
            console.log('process..9')

        }
    })
    console.log('process..6')
});
// to retrive comments
app.get('/api/comments', (req, res) => {
    let OID = req.body.ObjectID;
    let comments = []
    Offre_demande.findOne({_id:OID},(err,foundObject)=>{
        if(!err && foundObject){
            foundObject.comment.forEach(function(value)
            {comments.push(value)});
            res.send(comments)
        }
        else{
            if(!err)
                res.send('vide');
            else
                console.log(err)
        }
        
    });
});

app.use('/coloc',colocController );
