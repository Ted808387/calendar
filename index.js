const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv/config');

const port = process.env.PORT || 3000;

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

server.use(bodyParser.json());

server.get('/calendar', (req, res) => {
    db.collection('calendar').find().toArray((err, result) => {
        if(err) throw err
        res.send({ data: result })
    })
})

server.post('/calendar', (req, res) => {
    console.log(req.body);
    db.collection('calendar').insertOne(req.body, (err, result) => {
        if (err) throw err
        console.log('saved to database')
        res.send(req.body);
    });
})

server.delete('/calendar/:id', (req, res) => {
    let params = Number(req.params.id)
    const id = { list: {id: params} }
    if(!id){
        res.sendStatus(403);
    }
    db.collection('calendar').deleteOne(id, (err, obj) => {
        if (err) throw err
        console.log('1 document deleted')
        res.send('delete success!')
    })
})

server.put('/calendar/:id', (req, res) => {
    console.log(req.params.id, req.body)
    const newvalus = {$set: req.body}
    const id = { list: { id: Number(req.params.id) } }
    db.collection('calendar').updateOne(id, newvalus, (err, obj) => {
        if (err) throw err
        console.log('1 document update')
        res.send('update success!')
    })
})


MongoClient.connect(process.env.DB_CONNECTION, (err, client) => {
    if(err) throw err;
    db = client.db('test-data')
    server.listen(port, () => {
        console.log('listening successful!!!!')
    })
})