const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
const mongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
let db;
mongoClient.connect('mongodb+srv://kazi:Labour23@cst3145cw2.wptfc.mongodb.net/',(err,client) =>{
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
app.get('/collection/:collectionName/:sortby/:order',(req,res,next)=>
{
    req.collection.find({},{sort:[[req.params.sortby , parseInt(req.params.order)]]})
    .toArray((e, results)=>
    {
        if(e) return next(e);
        res.send(results);
    })
})
app.get('/collection/:collectionName/:searchTerm',(req,res,next)=>
{
    //'.*'+req.params.searchTerm+'.*'
    var srch = "/"+req.params.searchTerm+"/";
    req.collection.find({"subject": {'$in': srch}}).toArray((e,results)=>
    {
        if(e) return next(e);
        res.send(results);
    })
})
app.post('/collection/:collectionName',(req,res,next) =>{
    req.collection.insert(req.body,(e,results) => {
        if(e) return next(e);
        res.send(results);
    })
})
const ObjectID = require('mongodb').ObjectID;
app.put('/collection/:collectionName/:id',(req,res,next) =>{
    req.collection.update(
        {_id: new ObjectID(req.params.id)},
        {$set : req.body},
        {safe:true, multi:false},
        (e,result)=>{
            if(e) return next(e);
            res.send((result.matchedCount === 1) ? {msg : 'success'} :{msg:'error'})
            console.log(result);
        })
})
app.listen(port, ()=>{
    console.log('Express is running in in (heroku)port' + port);
})
//(sort:[[req.params.sortby , parseInt(req.params.order)]]
// cst3145cw2?retryWrites=true&w=majority/