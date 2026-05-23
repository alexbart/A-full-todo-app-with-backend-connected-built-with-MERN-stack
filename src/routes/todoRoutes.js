const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
    getTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
} = require("../controllers/todoController");

router.use(protect);

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.patch("/:id/toggle", toggleTodo);
router.delete("/:id", deleteTodo);

module.exports = router;