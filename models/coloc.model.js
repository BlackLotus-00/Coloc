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
    img:{
        type:[]
    },
    comment: {
        type:[],
        Text:{
            type:String
        },
        owner:{
            type:String
        }
    }
});

//var CommentShema = new mongoose.Schema({
//    annonce_id:{
//        type:String,
//    },
//    comment:{
//        type:String
//    },
//    owner:{
//        type:String
//    }
//});
//
mongoose.model(`Offre_demande`,colocSchema);
//mongoose.model(`Commentaire`,CommentShema);

