var http = require('http');
var path = require('path');
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
var mongoose = require('mongoose');
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded: false}));
const Todo = require('./models/todo.model');
const mongoDB = 'mongodb+srv://testConnection:b8RwqJYgo4hD1xhe@nodetodoexample-iqnde.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error:"));

var task = [];
var complete = [];

app.get('/', function(req, res){
    Todo.find(function(err, todo){
        if(err){
            console.log(err);
        }else{
            res.json(todo);
        }
    });
});

app.post('/', function(req, res){
    let newTodo = new Todo({
        item: req.body.newtask,
        done: false
    });
    newTodo.save(function(err, todo){
        if (err){
            res.json({"Error: ":err})
        }else{
            res.json({"Status: ": "Successful", "ObjectId": todo.id})
        }
    });
});

app.put('/', function(req, res){
    var id = req.body.check;
    var error = {};
    if(typeof id === "string"){
        Todo.updateOne({_id: id},{done: true}, function(err){
            if (err){
                error = {"Error: ":err};
            }
        });
    }else if (typeof id === "object"){
        for(var i = 0; i < id.length; i++){
            Todo.updateOne({_id: id[i]},{done: true}, function(err){
            if (err){
                error = {"Error: ":err};
            }
        });
        }
    }
    if(error){
        res.json(error);
    }else{
        res.json({"Status: ": "Successful"})
    }
});

app.delete("/", function(req, res){
    var deleteTask = req.body.delete;
    var error = {};
    if(typeof deleteTask === "string"){
        Todo.deleteOne({_id: deleteTask}, function(err){
            if (err){
                error = {"Error: ":err};
            }
        });
    }else if (typeof deleteTask === "object"){
        for(var i = 0; i < deleteTask.length; i++){
            Todo.deleteOne({_id: deleteTask}, function(err){
            if (err){
                error = {"Error: ":err};
            }
        });
        }
    }
    if(error){
        res.json(error);
    }else{
        res.json({"Status: ": "Successful"})
    }
});

http.createServer(app).listen(port, function(){
});

