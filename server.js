require(`./models/db`)

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
//const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const colocController = require('./controllers/coloc.controller')

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(bodyParser.json())
app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({
    extname:'hbs',
    defaultLayout:'mainLayout',
    layoutsDir:__dirname + '/views/layouts/',
    //handlebars: allowInsecurePrototypeAccess(Handlebars),
}));
app.set('view engine','hbs');

app.listen(3000,()=>{
    console.log(`Express server started at port : 3000`);
});

app.use('/coloc',colocController );
