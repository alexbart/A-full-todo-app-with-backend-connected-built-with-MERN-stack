import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { TodoInput } from "../components/TodoInput";
import { TodoList } from "../components/TodoList";

import {
    getTodos,
    createTodo,
    toggleTodo,
    updateTodo,
    deleteTodo
} from "../api/todos";

import { logout } from "../../../src/utils/auth"; // 👈correct place

export default function Dashboard() {

    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await getTodos();
            setTodos(res.data);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (title) => {
        try {
            await createTodo({ title });
            fetchTodos(); // 👈 ALWAYS consistent with DB
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggle = async (id) => {
        const res = await toggleTodo(id);
        setTodos(todos.map(t => t._id === id ? res.data : t));
    };

    const handleDelete = async (id) => {
        await deleteTodo(id);
        setTodos(todos.filter(t => t._id !== id));
    };

    const startEdit = (todo) => {
        setEditingId(todo._id);
        setEditText(todo.title);
    };

    const saveEdit = async () => {
        const res = await updateTodo(editingId, { title: editText });

        setTodos(prev =>
            prev.map(t => t._id === editingId ? res.data : t)
        );

        setEditingId(null);
        setEditText("");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">
                        Todo App
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex justify-center gap-2 mb-4">
                    <button onClick={() => setFilter("all")}>All</button>
                    <button onClick={() => setFilter("active")}>Active</button>
                    <button onClick={() => setFilter("completed")}>Completed</button>
                </div>

                {editingId && (
                    <div className="flex gap-2 mb-4">
                        <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="border p-2 flex-1"
                        />
                        <button onClick={saveEdit}>Save</button>
                    </div>
                )}

                <TodoInput onAdd={addTodo} />

                <TodoList
                    todos={filteredTodos}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onEdit={startEdit}
                />
            </div>
        </div>
    );
}