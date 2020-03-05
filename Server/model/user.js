const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:String,
        required:true,
        minlength: 8,
    },
    email: {
        type: String,
        required:String,
        unique: 1,
        
    },
    isAdmin: {
        type: Boolean,
        default:false,
    },
    createdAt: {
        type:Date,
        default:Date.now,
    },
    questionId: [{
        type: String, 
    }],
    bookmakrs: [{
        type: String,
    }],

},{timestamp:true})

const User = mongoose.model('User' , userSchema)

module.exports = {User}