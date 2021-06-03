var express = require('express')
const router = express.Router();
const path = require('path');
var app = express();
const nodemailer=require('nodemailer');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

app.use( express.static( "public" ) )

router.get('/accueil2',function(req,res){
    res.sendFile(path.join(__dirname+'/public/accueil2.html'));
  });

  app.use('/', router);
router.post('/accueil2/sent',(req,res)=>{
  const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
    user:"coloc2021.9@gmail.com",
    pass: "20202021ENIM"
}
  })
  var textBody = `From: ${req.body.NOM} Email:${req.body.Email} MESSAGE: ${req.body.Message}`;
  //var textBody = ('From: '+req.body.Nom + 'Email:'  + req.body.email+'; MESSAGE:', + req.body.message);
  var htmlBody = `<h2>Mail Form Contact Form<h2/><p>from: ${req.body.NOM}</p><a href='mailto:${req.body.Email}'>${req.body.Email}</a><p>${req.body.Message}</p>`;
  var mail = {
      from: "coloc2021.9@gmail.com",
      to: `coloc2021.9@gmail.com`,
      subject: "Mail Form Contact Form",
      text: textBody,
      html:htmlBody
      
}
transporter.sendMail(mail, function(err, info){
  if(err){
      console.log(err);
      res.json({message: " an error occured;" + err});
  }
  else{
      res.json({message: `message sent with ID: ${info.messageId}`});
  }
}); });

     
app.listen(4000)

console.log("connecting")






