const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const Todo =require('./model/todo');
// Connect to MongoDB
mongoose.connect('mongodb+srv://Kunal_Rathore:Kunal%4020@cluster0.6spjrhx.mongodb.net/todoal');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Middleware
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Todo Model
// const Todo = mongoose.model('Todo', {
//     title: String,
//     link: String,
//     done: Boolean,
//     position: Number,
// });

// Add Todo Route
app.post('/api/todos',async (req, res) => {
    try{
        const newTodo = new Todo({
            title: req.body.title,
            link: req.body.link,
            done: false,
            position: 0,
        });
        await newTodo.save()
           res.json(newTodo);
    }catch(err){
        console.log(err);
    }

    
});

// Get Todos Route
app.get('/api/todo', (req, res) => {
    Todo.find().then((todos) => {
        res.json(todos);
    });
});

// Update Todo Route
app.put('/api/todos/:id', (req, res) => {
    Todo.findByIdAndUpdate(
        req.params.id,
        { $set: { done: req.body.done } },
        { new: true }
    ).then((todo) => {
        res.json(todo);
    });
});

// Update Position Route
app.put('/api/todos/:id/position', (req, res) => {
    Todo.findByIdAndUpdate(
        req.params.id,
        { $set: { position: req.body.position } },
        { new: true }
    ).then((todo) => {
        res.json(todo);
    });
});

// Catch all other routes and return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
