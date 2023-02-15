import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
const app = express()

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000' ,"*"],
}))
const port = process.env.PORT || 5000;


const ratingSchema = new mongoose.Schema({
   title: { type: String },
    appRating: { type: Number},
    yourRating: { type: Number},
   
    
    createdOn: { type: Date, default: Date.now },
});
const ratingModel = mongoose.model('rating', ratingSchema);


app.post('/rating', (req, res) => {
let body = req.body;

if(!body.title || !body.appRating || !body.yourRating ){
console.log("please fill req fields")
res.send({
    message : "please fill req fields"
})

return;
}
 let newRating = ratingModel({
    title :body.title,
    appRating :body.appRating,
    yourRating :body.yourRating,
 })

 
 newRating.save((err, result) => {

    if (!err) {
        res.send({
            message: "rating is created" + result
        })
        console.log(result, "rating is created")
    } else {
        res.send({ message: "db error in saving rating" });
        console.log("db error in saving rating")

    }



})

})

app.get('/rating/:id' , (req,res)=>{
    ratingModel.findOne({id : req.params.id} , (err ,result)=>{
        if(!err){
            console.log("here is movie rating")
            res.send({
               
                data : result,
                message: "here is rating",

            })
        }
        else{
            console.log("error in getting rating of movie")
            res,send({
                message:"error in getting rating of movie",
               
            })
        }
    })
})


app.put('/rating/:id' ,(req,res)=>{
    let body = req.body;
    let id = req.params.id

    ratingModel.findByIdAndUpdate(id , body , {}, (err,result)=>{
        if(!err){
            console.log(result , "update rating")
            res.send({
                message : "rating updated"
            })
        }else{
            console.log(err , "error in updating")
            res.send({
                message : "error in updating"
            })

        }
    })
})


app.delete('/rating/:id' , (req ,res)=>{
    ratingModel.findOneAndDelete({id : req.params.id} , (err ,result)=>{
        if(!err){
            console.log("rating deleted")
            res.send({
                message : "rating deleted",
                data : result
            })
        }else{
            console.log("error in deleting rating");
            res.send({
                message : "err in deleting rating"
            })
        }
    })
})


app.get('/ratings' , (req ,res)=>{
ratingModel.find({}, (err ,result)=>{
    if(!err){
        console.log("all movie ratings")
        res.send({
            message : "all movie ratings",
            data : result
        })
    }else{
        console.log("error in getting allmovie ratings");
        res.send({
            message : "errror in getting all movie ratings"
        })
    }
})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


let dbURI = 'mongodb+srv://tasmiyah:web@cluster0.cj82tmo.mongodb.net/movieRatingWeb?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
