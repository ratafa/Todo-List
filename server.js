const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb+srv://aacz1203:asd88445522@cluster0.1aaxe.mongodb.net/TodoApp?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (error, client) {
    if (error) return console.log(error)
    db = client.db('TodoApp');

    db.collection('POST').insertOne({ 이름: 'John', _id: 100 }, function (error, result) {
        console.log('저장완료');
    });

    app.listen(8080, function () {
        console.log('listening on 8080')
    });
});

app.get('/pet', function (req, res) {
    res.send('펫용품 쇼핑할 수 있는 사이트입니다.');
});

app.get('/beauty', function (req, res) {
    res.send('펫용품 쇼핑할 수 있는 사이트입니다.');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', function (req, res) {
    res.sendFile(__dirname + '/write.html');
});

app.post('/add', function (req, res) {
    res.send('전송완료');
    console.log(req.body.title)
});
