const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({

    questionId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    firstQuestion:{
        type:String,
        required:String
    },
    secondQuestion:{
        type:String,
        required:String,
    },bundleVersion:{
        type:Number,
        default:-1,
    },
    firstQuestionVoteNumber: {
        type:Number,
        default:0,
    },
    secondQuestionVoteNumber: {
        type:Number,
        default:0,
    },
    created: {
        type: Date,
        default:Date.now,
    },
    isVerified: {
        type:Boolean,
        default:false,
    }
},{timestamp:true})

const Question = mongoose.model('Question' , questionSchema)

module.exports = {Question}