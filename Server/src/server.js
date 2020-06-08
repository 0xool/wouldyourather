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
const session = require('express-session')

const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcryptjs')
const isAuth = require('../MiddleWere/is-auth')

var app = express()
const store = new MongoStore({
    url:config.DATABASE
})

store.on('error', function(error) {
    console.log(error);
  });
   

const {Question} = require('../model/question.js')
const {User} = require('../model/user.js')
const {ClientConfig} = require('../model/cleintConfig.js')


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
//=====================================================================
// ======================= Initialization ======================= 
mongoose.Promise = global.Promise
mongoose.connect(config.DATABASE , { useNewUrlParser: true,useUnifiedTopology: true}).then(() => {
console.log("Connected to Database");
generateReport()

}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});


app.use(session({secret:'12340987',resave:false,saveUninitialized:false,store:store}))
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

//=====================================================================
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
//=====================================================================
// CONTROL PANEL API:


//=====================================================================
// User API :

app.post('/api/createUser', (req,res) => {
    if (req.body.username == null) {
        res.status(400).send({
            errorMessage : 'No username  has been entered'
        })
        return
    }
    if (req.body.password == null) {
        res.status(400).send({
            errorMessage : 'No Password has been entered'
        })
        return
    }
    if (req.body.email == null) {
        res.status(400).send({
            errorMessage : 'No Emai has been entered'
        })
        return
    }
    const pass = req.body.password
    return bcrypt.hash(pass,12).then((hash) => {
        
        const user = new User({
            email:req.body.email,
            password:hash,
            username:req.body.username
        })
        user.save((err,doc) => {
            console.log(err)
            if (err){
                if(err.name == 'MongoError'){
                if(err.keyPattern.email == 1){
                    return res.status(400).json({
                        message:'ایمیل وارد شده تکراری می باشد',
                        err:err
                })
                }
            }

            if (err.name == 'ValidationError'){
                    return res.status(400).json({
                        message:'رمز عبور وارد شده کمتر از ۸ حرف می باشد',
                        err:err
                    })
                }
            }

            res.status(200).json({
                post:true,
                id:user._id
            })
        })

    })
})
//=====================================================================
app.post('/api/adminLogin', (req,res) => {
    User.findOne( {$and : [{username:req.body.username},{isAdmin:true}]}, (err,doc) => {                
        if (doc){
            bcrypt.compare(req.body.password,doc.password).then((com) => {
                if (com) {
                    req.session.isLoggedIn = true
                    console.log(req.session.isLoggedIn)
                    res.status(200).json({
                        auth:true,
                        session:req.session,
                        message: "WELCOME.",
                        doc:doc
                    })
                }else{
                    res.status(400).json({
                        message: 'Username and Password Incorrect',
                    })
                }
            })            
                return
        }else{
            res.status(400).json({
                message: 'No such user exists',
            })
        }
    })
})
//=====================================================================
app.post('/api/userLogin', (req,res) => {
    User.findOne( {$and : [{email:req.body.email}]}, (err,doc) => {  
        if (doc){
            bcrypt.compare(req.body.password,doc.password).then((com) => {
                if (com) {
                    req.session.isLoggedIn = true
                    res.status(200).json({
                        auth:true,
                        message: "خوش آمدید",
                        doc:doc
                    })
                }else{
                    res.status(400).json({
                        message: 'نام کاربر یا رمز عبور اشتباه می باشد',
                    })
                }
            })            
                return
        }else{
            res.status(400).json({
                message: 'نام کاربر وارد شده وجود ندارد',
            })
        }
    })
})
//=====================================================================
app.post('/api/vote', (req,res) => {
    
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
//=====================================================================
app.get('/api/getQuestionById' , (req,res) => {
    let id = req.query.id    
    Question.findById(id , (err,doc) => {
        if (err) return res.status(400).send(err)
        res.send(doc)
    })
})
//=====================================================================
app.get('api/getUserQuestionsByID' , (req,res) => {
    let id = req.query.id
    User.findById(id,(err,doc) => {
        if (err) return res.status(400).send(err)
        res.send(doc)
    })  
})
//=====================================================================
app.get('api/getUserBookmarksByID' , (req,res) => {
    let id = req.query.id
    User.findById(id,(err,doc) => {
        if (err) return res.status(400).send(err)
        res.json({
            response: 'success',
            doc: doc,
        })
    })  
})
//=====================================================================
app.get('/api/getAllQuestion' , (req,res) => {

    ClientConfig.countDocuments((err,count) => {
        if(count == 0){
            const newConfig = new ClientConfig()
            newConfig.save((err,doc) => {
                if (err){
                    res.status(400).send(err)
                }
            })

            Question.find().exec((err,doc) => 
            {
        
                if (err){
                    res.status(400).send(err)
                }
        
                ClientConfig.find((err,data) => {
                    // console.log(data)
                    res.json({
                        doc:doc,
                        clientConfig: data,
                    })
                })
        
            })
            return
        }

        Question.find().exec((err,doc) => 
        {
            console.log(doc)
            if (err){
                res.status(400).send(err)
            }
    
            ClientConfig.find((err,data) => {
                // console.log(data)
                res.json({
                    doc:doc,
                    clientConfig: data,
                })
            })
    
        })
    })

 
})
//=====================================================================
app.get('/api/getClientConfig' , (req,res) => {
    ClientConfig.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, config) {
        if(err)  return res.status(400).send(err)
        res.send(config)
    })
})
//=====================================================================
app.get('/api/getAllVerifiedQuestion' , (req,res) => {
    Question.find({isVerified:{$eq: true}} , (err,doc) => {
        if (err) return res.status(400).send(err)
        res.send(doc)
    })
})
//=====================================================================
app.post('/api/getBatchQuestionUpdate' , (req,res) => {
    console.log(req.body.questionBatch)
    var arr = req.body.questionBatch;
    var arrayToUpdate = []
    for (q of arr){
        arrayToUpdate.push(q.questionId)
    }

    Question.find({_id:{$in:arrayToUpdate}},(err,doc) => {
        
        if (err) return res.status(400).send(err)

        res.send(doc)
    })
})
//=====================================================================
app.get('/api/getQuestionAfterBundle' , (req,res) => {
    Question.find({bundleVersion: {$gt : req.query.bundleVersion}} , (err,doc) =>{
        if (err){
            res.status(400).send(err)
        }
        res.send(doc)
    })
})
//=====================================================================
app.get('/api/getQuestion' , (req,res) => {
    let skip = parseInt(req.query.skip)
    let limit = parseInt(req.query.limit)
    let order = req.query.order

    Question.find().skip(skip).sort({_id:order}).limit(limit).exec((err,doc)=> {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})
//=====================================================================
// USER API :

app.get('/api/isUserAuth', (req,res) => {
    isAuth(req.query,res , () => {
        res.status(200).json({
            auth:true,
        })
    })
})
//=====================================================================
app.get('/api/getAllUsers' , (req,res) => {
    User.find().exec((err,doc) => 
    {
        if (err){
            res.status(400).send(err)
        }
        res.send(doc)
    })
})
//=====================================================================
app.get('/api/getAllUserQuestions' , (req,res) => {
    User.findById(req.query._id).exec((err,doc) => 
    {
        if (err  || doc == null){
            res.status(400).send(err)
        }else{
            Question.find({$and :   [{'_id' : {$in : doc.questionId}}/*{isVerified:true}*/]},(err,qDoc) => {
                res.send(qDoc)                
            })    
        }            
    })
})
//=====================================================================
app.get('/api/getAllUserBookmarks' , (req,res) => {
    User.findById(req.query._id).exec((err,doc) => 
    {
        if (err || doc == null){
            res.status(400).send(err)
        }   
                 
        Question.find({$and :   [{'_id' : {$in : doc.bookmakrs}}]},(err,qDoc) => {
            res.send(qDoc)                
        })                
    })
})
//=====================================================================
// ======================= Update ==========================
// CONTROL PANEL API:
app.post('/api/updateControlSegment', (req,res)=> {
    ClientConfig.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, config) {
        
        // type check error or handeling after mongoose callback error
        var update = {}
        if(req.body.buyUsComponentLimit){
            update.buyUsComponentLimit = req.body.buyUsComponentLimit
        }
        if(req.body.buyUsPopUpTimer){
            update.buyUsPopUpTimer = req.body.buyUsPopUpTimer
        }
        if(req.body.buyUsPopUpTimer){
            update.buyUsPopUpTimer = req.body.buyUsPopUpTimer
        }
        if(req.body.buyUsPopUpText){
            update.buyUsPopUpText = req.body.buyUsPopUpText
        }
        if(req.body.rateUsFirstText){
            update.rateUsFirstText = req.body.rateUsFirstText
        }
        if(req.body.rateUsSecondText){
            update.rateUsSecondText = req.body.rateUsSecondText
        }
        if(req.body.buyUsFirstText){
            update.buyUsFirstText = req.body.buyUsFirstText
        }
        if(req.body.buyUsSecondText){
            update.buyUsSecondText = req.body.buyUsSecondText
        }
        if(req.body.addQuestionRuleText){
            update.addQuestionRuleText = req.body.addQuestionRuleText
        }
        if(req.body.shareUsShakeAnimationStart){
            update.shareUsShakeAnimationStart = req.body.shareUsShakeAnimationStart
        }
        if(req.body.shareUsTutorialAnimationStart){
            update.shareUsTutorialAnimationStart = req.body.shareUsTutorialAnimationStart
        }
        if(req.body.showPopUpAdLimit){
            update.showPopUpAdLimit = req.body.showPopUpAdLimit
        }
        
        ClientConfig.findByIdAndUpdate(config._id,update,{useFindAndModify:false}, (err,doc) => {
            if (err){
                return res.status(400).send(err)
            }

            res.json({
                success:true,
                update:update
            })
        })
      });
})

//=====================================================================
app.post('/api/updatePasswordHash' , (req,res) => {
    
    User.findById(req.body.id, (err,doc) => {
        const pass = doc.password
        return bcrypt.hash(pass,12).then((hash) => {
            User.findByIdAndUpdate(req.body.id,{password:hash}, {new:true} , (err,doc) => {
                if (err) {
                    return res.status(400).send(err)
                }

                res.json({
                    success:true,
                    doc:doc,
                })
            })
        }).catch((err) => {
            console.log(err)
        })
    })
})
//=====================================================================
// QUESTION API :

app.post('/api/updateQuestion', (req,res)=> {
    Question.findByIdAndUpdate(req.body.id, {firstQuestion:req.body.firstQuestion,secondQuestion:req.body.secondQuestion}, {new:true}, (err,doc)=>{
        if (err){
            return res.status(400).send(err)
        }

        res.json({
            success:true,
            doc:doc
        })
    })
})
//=====================================================================
app.post('/api/validateQuestionById', (req,res)=> {
    Question.countDocuments({isVerified:true},(err,count) => {
        if (err){
            return res.status(400).send(err)
        }
        var bundleVersion = count + 1
        Question.findOneAndUpdate({_id:req.body._id,isVerified:false}, {isVerified:true,bundleVersion:bundleVersion}, {new:true,useFindAndModify: false}, (err,doc)=>{
            if (err){
                return res.status(400).send(err)
            }
    
            res.json({
                success:true,
                doc:doc
            })
        })
    })
})
//=====================================================================
app.post('/api/validateAll', (req,res)=> {

        Question.find({isVerified:false},(err,doc) => {
                Question.countDocuments({isVerified:true},(err,count) => {
                    if (err){
                        return res.status(400).send(err)
                    }
                    var c = count + 1
                    for (q of doc){
                        Question.findByIdAndUpdate(q._id,{isVerified:true,bundleVersion:c},{new:true}, (err,doc) => {
                            if (err){
                                return res.status(400).send(err)
                            }
                            console.log(doc)
                        })
                        c += 1
                    }
                    res.json({
                        success:true,
                        doc:doc
                    })
                })
    })
})
//=====================================================================
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
//=====================================================================
app.post("/api/deleteUserQuestionById",(req,res) => {
    User.findByIdAndUpdate(req.body._id,{$pullAll: {questionId:req.body.questionId}},(err,doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})
//=====================================================================
app.post("/api/deleteUserBookmarkById",(req,res) => {
    User.findByIdAndUpdate(req.body._id,{$pullAll: {bookmakrs:req.body.bookmarkId}},(err,doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})
//=====================================================================
app.post('/api/addToUserQuestionById', (req,res)=> {
    if (req.body.q_id == null){
        res.status(400).send({
            errorMessage : 'No Question Id(q_id) has been entered'
        })
        return
    }
    if (req.body._id == null) {
        res.status(400).send({
            errorMessage : 'No User Id(_id) has been entered'
        })
        return
    }

    Question.findById(req.body.q_id,(err,doc) => {

        if (err || doc == null){
            return res.status(400).json({
                message : 'question does not exist',
                err : err,
            })            
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
})
//=====================================================================
app.post('/api/addBookmark', (req,res)=> {

    if (req.body.q_id == null){
        res.status(400).send({
            errorMessage : 'No Question Id has been entered'
        })
        return
    }
    if (req.body._id == null){
        res.status(400).send({
            errorMessage: 'No User ID has been entered'
        })
    }

    Question.findById(req.body.q_id,(err,doc) => {

        if (err || doc == null){
            return res.status(400).json({
                message : 'question does not exist',
                err : err,
            })            
        }
        User.findByIdAndUpdate(req.body._id, {$addToSet : {bookmakrs:req.body.q_id}}, {new:true}, (err,doc)=>{
            if (err){
                return res.status(400).send(err)
            }
    
            res.json({
                success:true,
                doc:doc
            })
        })

    })
})
// ======================= Delete ==========================
// QUESTION API :
app.delete("/api/deleteQuestionById",(req,res) => {
    Question.findByIdAndDelete(req.body.id,(err,doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})
//=====================================================================
app.delete("/api/deleteAllQuestion",(req,res) => {
    Question.deleteMany({},(err) =>  {
        console.log(err)
    })
})
//=====================================================================
// USER API :
app.delete("/api/deleteUserById",(req,res) => {
    User.findByIdAndDelete(req.body.id,(err,doc) => {
        if (err) res.status(400).send(err)
        res.send(doc)
    })
})

//=====================================================================



const port = process.env.port || 3001
app.listen(port)
