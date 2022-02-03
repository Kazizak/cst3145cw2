const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const mongoClient = require('mongodb').MongoClient;
let db;
mongoClient.connect('mongodb+srv://kazi:Labour23@cst3145cw2.wptfc.mongodb.net/cst3145cw2?retryWrites=true&w=majority/',(err,client) =>{
    db = client.db('cst3145cw2');
})

app.use(express.json());

app.param('collectionName',(req,res,next,collectionName) =>{
    req.collection = db.collection
    (collectionName);
    return next();
});
app.get('/',(req,res,next) =>{
    res.send("Select a collection with /collection/collectionName");
});
app.get('/collection/:collectionName',(req,res,next)=>{
    req.collection.find({}).toArray((e,results)=>
    {
        if(e) return next(e);
        res.send(results);
    })
});
app.post('/collection/:collectionName',(req,res,next) =>{
    req.collection.insert(req.body,(e,results) => {
        if(e) return next(e);
        res.send(results.ops);
    })
})
app.listen(3000, ()=>{
    console.log('Express is running in in port 3000');
})