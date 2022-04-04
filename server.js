const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { list } = require('mongodb/lib/gridfs/grid_store');
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
// html이 아닌 ejs로 파일명을 바꿔주면 서버데이터를 html에 바인딩 가능
app.use('/public', express.static('public'));
// staic 파일(데이터 변경에 영향을 받지 않는 파일 ex.css파일)을 보관하기 위해 public 파일을 사용할 거라고 선언
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');


var db;
MongoClient.connect('mongodb+srv://aacz1203:asd88445522@cluster0.1aaxe.mongodb.net/TodoApp?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (error, client) {
    if (error) return console.log(error)
    db = client.db('TodoApp');

    // db.collection('POST').insertOne({ 이름: 'John', _id: 100 }, function (error, result) {
    //     console.log('저장완료');
    // });

    app.listen(8080, function () {
        console.log('서버에 연결되었습니다.')
    });
});

// app.get('/pet', function (req, res) {
//     res.send('펫용품 쇼핑할 수 있는 사이트입니다.');
// });

// app.get('/beauty', function (req, res) {
//     res.send('펫용품 쇼핑할 수 있는 사이트입니다.');
// });

app.get('/', function (req, res) {
    // res.sendFile(__dirname + '/index.html');
    // html 파일을 서버에 연결시킬 때는 sendFile을 사용
    res.render('index.ejs');
    // ejs 파일을 서버에 연결시킬 떄는 render을 사용
});

app.get('/write', function (req, res) {
    // res.sendFile(__dirname + '/write.ejs');
    res.render('write.ejs');
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
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('POST').deleteOne(req.body, function(error, result){
        console.log('삭제완료');
        res.status(200).send({message : '성공했습니다'});
        // 실제로 요청이 성공했는지를 알려줘야지 list.ejs에서 요청 반응을 함
        // 그렇기에 ejs랑 호환을 하려면 서버쪽에서 요청 성공이 했는지 알려주는 것이 중요함
    });
});


app.get('/detail/:id', function(req, res){
    db.collection('POST').findOne({_id : parseInt(req.params.id)}, function(error, result){
        // 뭔가 오류가 난다면 보내는 데이터나 받는 데이터의 형태가 스트링인지 정수인지 확인해보기
        console.log('result');
        res.render('detail.ejs', { data : result });
        // res.status(400).send('페이지를 찾을 수 없습니다.');
        // 없는 _id로 파라미터 요청 시, 에러 페이지를 띄워줌.
    });
}); 

app.get('/edit/:id', function (req, res) {
    // res.sendFile(__dirname + '/write.ejs');
    db.collection('POST').findOne({_id : parseInt(req.params.id)}, function (error, result) {
        console.log(result)
        res.render('edit.ejs', { post : result });
    });
});
