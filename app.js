var http = require('http');
var path = require('path');
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ encoded: true}));
var task = ["clean", "cook"];
var complete = ["eat", "sleep"];


app.get('/', function(req, res){
    res.render('index',{task:task, complete: complete});
});

app.post('/addtask', function(req, res){
    var newTask = req.body.newtask;
    task.push(newTask);
    res.redirect("/");
});

app.post('/removetask', function(req, res){
    res.redirect("/");
});

http.createServer(app).listen(port, function(){

});