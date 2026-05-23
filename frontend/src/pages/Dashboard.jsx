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

    useEffect(() => {
        console.log("editingId changed:", editingId);
    }, [editingId]);

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
        <div className="min-h-screen bg-gray-100 ">
            {/* NAVBAR */}
            <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">

                {/* LEFT: App name */}
                <h1 className="text-xl font-bold text-blue-600">
                    Todo SaaS
                </h1>

                {/* RIGHT: User */}
                <div
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <img
                        src={user?.profileImage || "/default-avatar.png"}
                        className="w-9 h-9 rounded-full border object-cover"
                    />

                    <div className="text-right">
                        <p className="text-sm font-semibold">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            View profile
                        </p>
                    </div>
                </div>
            </header>
            {/* MAIN CONTENT */}
            <main className="p-6 max-w-6xl mx-auto">

                {/* GREETING BANNER */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Hi, {user?.name}
                    </h2>
                    <p className="text-gray-500">
                        Here’s what you need to get done today
                    </p>
                </div>

                {/* ACTION BAR */}
                <div className="flex justify-between items-center mb-4">

                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1 rounded ${filter === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-white border"
                                }`}
                        >
                            All
                        </button>

                        <button
                            onClick={() => setFilter("active")}
                            className={`px-3 py-1 rounded ${filter === "active"
                                ? "bg-red-500 text-white"
                                : "bg-white border"
                                }`}
                        >
                            Active
                        </button>

                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-3 py-1 rounded ${filter === "completed"
                                ? "bg-green-600 text-white"
                                : "bg-white border"
                                }`}
                        >
                            Completed
                        </button>
                    </div>

                    <button
                        onClick={() => navigate("/profile")}
                        className="bg-gray-900 text-white px-4 py-2 rounded"
                    >
                        My Profile
                    </button>
                </div>
                {/* EDIT MODAL (SaaS STYLE) */}
                {editingId && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">

                            <h2 className="text-lg font-bold mb-4">
                                Edit Todo
                            </h2>

                            <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full border p-2 rounded mb-4"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditText("");
                                    }}
                                    className="px-3 py-1 border rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={saveEdit}
                                    className="px-3 py-1 bg-blue-600 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TODO SECTION */}
                <div className="bg-white rounded-xl shadow p-4">

                    <TodoInput onAdd={addTodo} />

                    <TodoList
                        todos={filteredTodos}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                        onEdit={startEdit}
                        onClick={openTodo}
                    />
                </div>

            </main>
        </div>
    );
}
