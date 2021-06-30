const mongoose = require('mongoose')

const visiteSchema = new mongoose.Schema({
    username: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    name: {
        type: String,
    },
    destinataire: {
        type: String,
    },
    titre: {
        type: String,
    },
    lieu: {
        type: String,
    },
    date:{
        type: Date,
    },
    destname:{
        type: String,
    },
    approuver:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

visiteSchema.pre('validate', function(next){
    if(this.username){
        this.name = this.username.name
    }
    this.approuver = "pas encore"
    next()
})

module.exports = mongoose.model('Visite', visiteSchema)

