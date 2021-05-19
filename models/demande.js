const mongoose = require('mongoose')
const slugify = require('slugify')


const demandeSchema = new mongoose.Schema({
    username: {
        type: String
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
    slug: {
        type: String,
        required: true,
        unique: true
    }
})


demandeSchema.pre('validate', function(next){
    if(this.titre) {
        this.slug = slugify(this.titre, {lower: true, strict: true})
    }
    this.username = 'me'
    

    next()
})

module.exports = mongoose.model('Demande', demandeSchema)

