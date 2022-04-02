const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { list } = require('mongodb/lib/gridfs/grid_store');
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
// html이 아닌 ejs로 파일명을 바꿔주면 서버데이터를 html에 바인딩 가능

var db;
MongoClient.connect('mongodb+srv://aacz1203:asd88445522@cluster0.1aaxe.mongodb.net/TodoApp?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (error, client) {
    if (error) return console.log(error)
    db = client.db('TodoApp');

    // db.collection('POST').insertOne({ 이름: 'John', _id: 100 }, function (error, result) {
    //     console.log('저장완료');
    // });

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
    db.collection('counter').findOne({ name: '게시물갯수' }, function (error, result) {
        var postCounter = result.totalPost
        // findeOne은 collection의 데이터 중 한 개의 데이터만 찾고 싶을 때 사용
        // let이나 const보다 var을 사용한 이유는 var의 범위가 {}가 아닌 funtion의 범위이기 때문
        
        db.collection('POST').insertOne({ _id : (postCounter + 1), 제목: req.body.title, 날짜: req.body.date }, function (error, result) {
            console.log('저장완료');
            db.collection('counter').updateOne({name:'게시물갯수'}, { $inc : {totalPost:1} }, function(error, result) {
                // $inc는 기본값에 더해줄 값을 설정 가능. 하지만 어떤 값을 변경할지 설정할 떄는 {totalPost}와 같은 오퍼레이터 형태로 기입 필요.
                if(error) {return console.log(error)};
                res.send('전송완료');
            });
        });
    });
});             

app.get('/list', function (req, res) {
    db.collection('POST').find().toArray(function (error, result) {
        console.log(result);
        // POST 콜렉션의 모든 데이터를 가져와서 콘솔에 찍어줍니다.
        res.render('list.ejs', { posts: result });
        // 찾은 데이터를 ejs 파일 속 posts라는 변수에 바인딩 해줍니다.
    });
});

app.delete('/delete', function(req, res){
    console.log(req.body)
    req.body._id = parseInt(req.body._id);
    db.collection('POST').deleteOne(req.body, function(error, result){
        console.log('삭제완료');
    })
})