import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TodoInput } from "../components/TodoInput";
import { TodoList } from "../components/TodoList";
import { getMe } from "../api/auth";

import {
    getTodos,
    createTodo,
    toggleTodo,
    updateTodo,
    deleteTodo
} from "../api/todos";
// 👈correct place
import { clearAccessToken } from "../api/client";

export default function Dashboard() {

    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [selectTodo, setSelectTodo] = useState(null);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);





    useEffect(() => {
        fetchTodos();
        fetchUser();
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
        setTodos(prev =>
            prev.map(t => t._id === id ? res.data : t)
        );
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
        clearAccessToken();
        navigate("/login");
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
    });

    const openTodo = (todo) => {
        setSelectTodo(todo);
    };

    const fetchUser = async () => {
        try {
            const data = await getMe();
            setUser(data);
        } catch (err) {
            console.log("Profile error:", err);
        }
        finally {
            setUserLoading(false);
        }
    };





    if (loading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">

                <div className="flex justify-between items-center mb-6">

                    {/* LEFT: Greeting */}
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">
                            Hi, {user?.name || "User"} 👋
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Welcome back to your tasks
                        </p>
                    </div>

                    {/* RIGHT: Profile */}
                    <div
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <img
                            src={user?.profileImage || "/default-avatar.png"}
                            className="w-10 h-10 rounded-full border"
                        />

                        <span className="font-medium">
                            {user?.name}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/profile")}
                    className="bg-gray-800 text-white px-3 py-1 rounded mb-4"
                >
                    My Profile
                </button>

                <div className="flex justify-center gap-3 mb-6">

                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1 rounded border ${filter === "all"
                                ? "bg-blue-600 text-white"
                                : "text-blue-600 border-blue-600"
                            }`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setFilter("active")}
                        className={`px-3 py-1 rounded border ${filter === "active"
                                ? "bg-red-600 text-white"
                                : "text-red-600 border-red-600"
                            }`}
                    >
                        Active
                    </button>

                    <button
                        onClick={() => setFilter("completed")}
                        className={`px-3 py-1 rounded border ${filter === "completed"
                                ? "bg-green-600 text-white"
                                : "text-green-600 border-green-600"
                            }`}
                    >
                        Completed
                    </button>

                </div>

                {selectTodo && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96">

                            <h2 className="text-xl font-bold mb-2">
                                {selectTodo?.title}
                            </h2>

                            <p className="text-gray-600">
                                Status: {selectTodo?.completed ? "Completed" : "Active"}
                            </p>

                            <button
                                className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() => setSelectTodo(null)}
                            >
                                Close
                            </button>

                        </div>
                    </div>
                )}
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
                    onClick={openTodo}
                />
            </div>
        </div>
    );
}
