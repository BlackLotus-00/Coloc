const mongoose = require('mongoose')


const offreSchema = new mongoose.Schema({
    username: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    titre: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    ville:{
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    nbchambre: {
        type : Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    image: {
        type: []
    },
    prix: {
        type: String,
        required: true
    },
    activer: {
        type: String
    }
})

offreSchema.pre('validate', function(next){
    this.activer = "Active"

    next()
})

module.exports = mongoose.model('Offre', offreSchema)

