const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// GET all todos
router.get("/", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

//CREATE todo 
router.post("/", async (req, res) => {
    const todo = await Todo.create(req.body);
    res.json(todo);
});

//UPDATE todo
router.put("/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id)

        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//DELETE todo
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        await Todo.findByIdAndDelete(id);

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;