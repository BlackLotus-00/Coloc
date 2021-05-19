const mongoose=require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        //required:true
    },
    password: {
        type: String,
        //required:true
    },
    birthday: {
        type: Date,
        //required:true
    },
    phone: {
        type: String
    },
    status: {
        type: String,
        //required:true
    },
    date: {
        type: Date,
        default:Date.now()
    },
    googleId: {
        type :String
    },
    displayName : {
        type: String
    },
    image: {
        type: String,
    },
    createdAt: {
        type:Date,
        default: Date.now
    }

});
const User=mongoose.model('User', UserSchema);
module.exports= User;