const Todo = require("../models/Todo");

// GET todos (user-specific)
exports.getTodos = async (req, res) => {
    const todos = await Todo.find({ user: req.user.userId });
    res.json(todos);
};

// CREATE todo
exports.createTodo = async (req, res) => {
    const todo = await Todo.create({
        title: req.body.title,
        user: req.user.userId,
    });

    res.json(todo);
};

// UPDATE todo
exports.updateTodo = async (req, res) => {
    const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        req.body,
        { new: true }
    );

    res.json(todo);
};

// TOGGLE todo
exports.toggleTodo = async (req, res) => {
    const todo = await Todo.findOne({
        _id: req.params.id,
        user: req.user.userId,
    });

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
    await Todo.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId,
    });

    res.json({ message: "Deleted" });
};