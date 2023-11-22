// Create web server using express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test');

// Create schema
var commentSchema = new Schema({
    name: String,
    comment: String,
    time: String
});

// Create model
var Comment = mongoose.model('Comment', commentSchema);

// Create middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({dest: '/tmp/'}).array('image'));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp',
    cookie: {maxAge: 80000},
    resave: false,
    saveUninitialized: true
}));

// Set view engine
app.set('views', './views');
app.set('view engine', 'jade');

// Show index page
app.get('/', function(req, res) {
    console.log(req.session);
    if(req.session.isVisit) {
        console.log(req.session);
        req.session.isVisit++;
        res.send('<p>views: ' + req.session.isVisit + '</p>');
    } else {
        req.session.isVisit = 1;
        res.send('welcome to this page for the first time');
    }
});

// Show comment page
app.get('/comment', function(req, res) {
    res.render('comment');
});

// Post comment
app.post('/comment', function(req, res) {
    var name = req.body.name;
    var comment = req.body.comment;
    var time = new Date().toLocaleString();
    var comment = new Comment({
        name: name,
        comment: comment,
        time: time
    });
    comment.save(function(err, comment) {
        if(err) {
            console.log(err);
        }
        console.log('save comment success');
        res.redirect('/comment');
    });
});

// Get comment list
app.get('/commentlist', function(req, res) {
    Comment.find({}, function(err, comments) {
        if(err) {
            console
