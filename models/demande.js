const mongoose = require('mongoose')


const demandeSchema = new mongoose.Schema({
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
    type :{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    activer: {
        type: String
    }
})

demandeSchema.pre('validate', function(next){
    this.activer = "Active"

    next()
})


module.exports = mongoose.model('Demande', demandeSchema)

