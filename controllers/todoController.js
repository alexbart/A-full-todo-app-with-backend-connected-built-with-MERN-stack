const Todo = require("../models/Todo");

// GET all todos
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({
            userId: req.user.userId
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE todo
exports.createTodo = async (req, res) => {
    try {
        const todo = await Todo.create({
            title: req.body.title,
            userId: req.user.userId,
        });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE todo
exports.updateTodo = async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            {$set: req.body},
            { new: true }
        );

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// TOGGLE todo
exports.toggleTodo = async (req, res) => {
    try {
        const todo = await Todo.findById({
            _id: req.params.id,
            userId: req.user.userId
        });

        todo.completed = !todo.completed;

        const updated = await todo.save();

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};