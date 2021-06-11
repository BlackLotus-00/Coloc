const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
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
    message: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

messageSchema.pre('validate', function(next){
    if(this.username){
        this.name = this.username.name
    }

    next()
})

module.exports = mongoose.model('Message', messageSchema)

