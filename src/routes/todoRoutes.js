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

router.get("/", protect, getTodos);
router.post("/", protect, createTodo);
router.put("/:id", protect, updateTodo);
router.patch("/:id/toggle", protect, toggleTodo);
router.delete("/:id", protect, deleteTodo);

module.exports = router;