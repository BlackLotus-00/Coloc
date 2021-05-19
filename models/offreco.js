const mongoose = require('mongoose')
const slugify = require('slugify')


const offreSchema = new mongoose.Schema({
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
    image: {},
    prix: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})


offreSchema.pre('validate', function(next){
    if(this.titre) {
        this.slug = slugify(this.titre, {lower: true, strict: true})
    }
    this.username = 'me'
    

    next()
})

module.exports = mongoose.model('Offreco', offreSchema)

