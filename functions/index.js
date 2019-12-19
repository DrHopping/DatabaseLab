//#region
const functions = require('firebase-functions');
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var firebase = require('firebase')
const admin = require('firebase-admin')
exports.app = functions.https.onRequest(app);

//app.use(express.static('public'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());
var config = {
    apiKey: "AIzaSyDDGH3SYwTNaENhy__1YahOn5_ljyk_cKE",
    authDomain: "databaseproject-8ce06.firebaseapp.com",
    databaseURL: "https://databaseproject-8ce06.firebaseio.com",
    projectId: "databaseproject-8ce06",
    storageBucket: "databaseproject-8ce06.appspot.com",
    messagingSenderId: "854938284711",
    appId: "1:854938284711:web:e9d6f22f0f216a70d9e182"
};

firebase.initializeApp(config)
const db = firebase.database();
//#endregion

let data;
var ref = db.ref('students');
ref.on('value', snap => {
    data = snap.val()
});


const getRecords = (data) => {
    var keys = Object.keys(data)
    let students = [];
    keys.forEach(key => {
        students.push(data[key]);
    });
    return students;
}

const addStudent = (firstName, lastName, math, physics, english, history) => {
    var ref = db.ref('students');
    var data = {
        firstName: firstName,
        lastName: lastName,
        math: math,
        physics: physics,
        english: english,
        history: history
    }
    ref.push(data);
}

app.get('/', (req, res) => {
    var students = getRecords(data);
    res.render('list.html', {
        students: students
    });
})

app.get('/student.json', (req, res) => {
    res.json(getRecords(data))
})

app.get('/add', (req, res) => {
    res.render('add.html')
    //addStudent('Dima', 'Taranyk', '80', '76', '84', '91')
})

app.post('/add', (req, res) => {
    addStudent(req.body.firstName, req.body.lastName, req.body.math, req.body.physics, req.body.english, req.body.history)
    res.redirect('/')
})

app.post('/', (req, res) => {
    addScore(req.body.name, req.body.score)
    res.redirect('/')
})

app.post('/info', (req, res) => {
    res.render('info.html', {
        student: getRecords(data)[Number.parseInt(req.body.studentId)]
    })
})

app.get('/delete', (req, res) => {
    res.redirect('/')
})

app.get('/info', (req, res) => {
    res.redirect('/')
})

app.post('/delete', (req, res) => {
    var id = Number.parseInt(req.body.studentId);
    var keys = Object.keys(data)
    ref.child(keys[id]).remove()
    res.redirect('/')
})