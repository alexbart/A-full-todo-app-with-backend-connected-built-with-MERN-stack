const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

router.use(protect);


const {
    getTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
} = require("../controllers/todoController");




router.get("/", getTodos);

router.post("/", createTodo);

router.put("/:id", updateTodo);

router.patch("/:id/toggle", toggleTodo);

router.delete("/:id", deleteTodo);

module.exports = router;