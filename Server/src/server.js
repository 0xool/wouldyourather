const express = require("express")
const bodyParse = require("body-parser")
const cookieParser = require("cookie-parser")

const mongoose = require("mongoose")
const pather = require('path')
const config = require("./config.js").get(process.env.NODE_ENV) 

const util = require('util')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline)
const stringify = require('csv-stringify')
const fs = require('fs')
// const fsp = require('fs').promises

var app = express()
const {Question} = require('../model/question.js')
const {User} = require('../model/user.js')

async function generateReport(){
    //create query cursor
    let  questionCursor= Question.find({}).cursor({transform:(question)=>{        
        let {_id:questionId,firstQuestionVoteNumber,secondQuestionVoteNumber,firstQuestion,secondQuestion}= question.toObject()
        return {questionId,firstQuestionVoteNumber,secondQuestionVoteNumber,firstQuestion,secondQuestion}
    }})
    //create object to csv transformer
    let csvStream = stringify({
            header: true,
            columns: {
               questionId: 'questionId',
               firstQuestionVoteNumber:'firstQuestionVoteNumber',
               secondQuestionVoteNumber: 'secondQuestionVoteNumber',
               firstQuestion:'firstQuestion',
               secondQuestion:'secondQuestion',
            }
        })        
    //create a file sink
    let dst = `./Question.csv`
    await pipeline(questionCursor,csvStream,fs.createWriteStream(dst))
    console.log('report generated')
}

mongoose.Promise = global.Promise
mongoose.connect(config.DATABASE , { useNewUrlParser: true,useUnifiedTopology: true}).then(() => {
console.log("Connected to Database");
generateReport()

}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

app.use(bodyParse.json())
app.use(cookieParser())
app.use(express.static(pather.join(__dirname, '../../client/build')))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });


// ======================= Post =======================

// Question API :
app.post('/api/postQuestion', (req,res) => {
    const question = new Question(req.body)
    question.save((err,doc) => {
        if (err){
            return res.status(400).send(err)
        }

        res.status(200).json({
            post:true,
            id : question._id,
        })
    })

})

// User API :

app.post('/api/createUser', (req,res) => {
    const user = new User(req.body)
    user.save((err,doc) => {
        if (err){
            return res.status(400).send(err)
        }

        res.status(200).json({
            post:true,
            id:user._id
        })
    })
})

app.post('/api/adminLogin', (req,res) => {
    User.find( {$and : [{username:req.body.username},{password:req.body.password},{isAdmin:true}]}, (err,doc) => {
        
        if (doc.length > 0){
            res.status(200).json({
                auth:true,
                message: "WELCOME.",
                doc:doc
            })
             return
        }
        res.status(400).json({
            message: 'Username or Password Incorrect or Not Admin',
        })
    })
})

app.post('/api/vote', (req,res) => {
    console.log('man wtf :((')
    if (req.body._id == null){
        res.status(400).send({
            errorMessage : 'No Question Id has been entered'
        })
        return
    }
    if (req.body.voteNumber == null || req.body.voteNumber > 2 || req.body.voteNumber < 1){
        res.status(400).send({
            errorMessage : 'Wrong voteNumber format.'
        })
        return
    }
    var number = parseInt(req.body.voteNumber)
    console.log(number)
    switch (number) {
        case Number(1):
            Question.findByIdAndUpdate(req.body._id,{ $inc : {firstQuestionVoteNumber:1}}, {new:true} , (err,doc) => {
                if (err){
                    return res.status(400).send(err)
                }
                res.json({
                    success:true,
                    doc:doc,
                    id:req.body._id
                })
            })
            break;
        case Number(2):
            Question.findByIdAndUpdate(req.body._id,{$inc : {secondQuestionVoteNumber:1}} , (err,doc) => {
                if (err){
                    return res.status(400).send(err)
                }
                res.json({
                    success:true,
                    doc:doc
                })
            })
            break;
    
        default:
            res.status(400).json({
                message: 'Not correct voteNumber value',
            })
            break;
    }
    //question number : 1-2
    //add one vote to firstQuestionVoteNumber if 1 
    //add one vote to secondQuestionVoteNumber if 2 
    User.find({_id: req.body._id}, (err,doc) => {
        if (err) return res.status(400).send(err)


        
    })

})


// ======================= Get ==========================

// Get Unverified Questions
app.get('/api/getUnverifiedQuestions',(req,res) => {
    Question.find({isVerified:{$eq: false}} , (err,doc) => {
        if (err) return res.status(400).send(err)
        res.send(doc)
    })
})


app.get('/api/getQuestionById' , (req,res) => {
    let id = req.query.id

    Question.findById(id , (err,doc) => {
        if (err) return res.status(400).send(err)
        res.send(doc)
    })
})

app.get('/api/getAllQuestion' , (req,res) => {
    Question.find().exec((err,doc) => 
    {
        if (err){
            res.status(400).send(err)
        }
        res.send(doc)
    })
})


app.get('/api/getQuestion' , (req,res) => {
    let skip = parseInt(req.query.skip)
    let limit = parseInt(req.query.limit)
    let order = req.query.order

    Question.find().skip(skip).sort({_id:order}).limit(limit).exec((err,doc)=> {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})

// USER API :

app.get('/api/getAllUsers' , (req,res) => {
    User.find().exec((err,doc) => 
    {
        if (err){
            res.status(400).send(err)
        }
        res.send(doc)
    })
})

// ======================= Update ==========================
// QUESTION API :
app.post('/api/validateQuestionById', (req,res)=> {
    Question.findByIdAndUpdate(req.body._id, {isVerified:true}, {new:true}, (err,doc)=>{
        if (err){
            return res.status(400).send(err)
        }

        res.json({
            success:true,
            doc:doc
        })
    })
})
// USER API :
app.post('/api/makeUserAdmingByID', (req,res)=> {
    User.findByIdAndUpdate(req.body._id, {isAdmin:true}, {new:true}, (err,doc)=>{
        if (err){
            return res.status(400).send(err)
        }

        res.json({
            success:true,
            doc:doc
        })
    })
})
app.post('/api/addToUserQuestionById', (req,res)=> {
    if (req.body.q_id == null){
        res.status(400).send({
            errorMessage : 'No Question Id has been entered'
        })
        return
    }
    User.findByIdAndUpdate(req.body._id, {$addToSet : {questionId:req.body.q_id}}, {new:true}, (err,doc)=>{
        if (err){
            return res.status(400).send(err)
        }

        res.json({
            success:true,
            doc:doc
        })
    })
})

app.post('/api/addBookmark', (req,res)=> {
    if (req.body.q_id == null){
        res.status(400).send({
            errorMessage : 'No Question Id has been entered'
        })
        return
    }
    User.findByIdAndUpdate(req.body._id, {$addToSet : {bookmakrs:req.body.q_id}}, {new:true}, (err,doc)=>{
        res.json({
            success:true,
            doc:doc
        })
    })
})
// ======================= Delete ==========================
// QUESTION API :
app.delete("/api/deleteQuestionById",(req,res) => {
    Question.findByIdAndDelete(req.body._id,(err,doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})
// USER API :
app.delete("/api/deleteUserById",(req,res) => {
    User.findByIdAndDelete(req.body._id,(err,doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})




const port = process.env.port || 3001
app.listen(port)