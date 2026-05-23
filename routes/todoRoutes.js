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
        console.log("PUT BODY:", req.body);

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    title: req.body.title, // ONLY update title
                }
            },
            { new: true }
        );

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// TOGGLE 
router.patch("/:id/toggle", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        todo.completed = !todo.completed;

        const updated = await todo.save();

        res.json(updated);
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