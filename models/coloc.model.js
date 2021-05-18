const mongoose = require(`mongoose`)

var colocSchema = new mongoose.Schema({
    Nom:{
        type:String
    },
    Prix:{
        type:String,
        required: 'This field is required.'
    },
    Ville:{
        type:String,
        required: 'This field is required.'

    },
    Adresse:{
        type:String,
        required: 'This field is required.'
    },
    Type:{
        type:String,
        required: 'This field is required.'
    },
    Description: {
        type:String
    },
    img:{}
})

mongoose.model(`Offre_demande`,colocSchema);