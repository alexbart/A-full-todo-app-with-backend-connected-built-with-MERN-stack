import { AppLayout } from "../layouts/AppLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TodoInput } from "../components/todos/TodoInput";
import { TodoList } from "../components/todos/TodoList";
import { Bell } from "lucide-react";

import {
    getTodos,
    createTodo,
    toggleTodo,
    updateTodo,
    deleteTodo
} from "../api/todos";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export function Dashboard() {

    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { addNotification } = useNotifications();

    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [selectTodo, setSelectTodo] = useState(null);
    const [search, setSearch] = useState("");
    const [darkMode, setDarkMode] = useState(false);





    useEffect(() => {
        fetchTodos();
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
            addNotification(`New task created: "${title}"`, "success");
            fetchTodos(); // 👈 ALWAYS consistent with DB
        } catch (error) {
            console.log(error);
            addNotification("Failed to create task", "error");
        }
    };

    const handleToggle = async (id) => {
        try {
            const res = await toggleTodo(id);
            setTodos(prev =>
                prev.map(t => t._id === id ? res.data : t)
            );
            if (res.data.completed) {
                addNotification(`Task completed: "${res.data.title}"`, "success");
            } else {
                addNotification(`Task reopened: "${res.data.title}"`, "info");
            }
        } catch (error) {
            console.log(error);
            addNotification("Failed to toggle task", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            // Find the todo to get its title for notification
            const todoToDelete = todos.find(t => t._id === id);
            await deleteTodo(id);
            setTodos(todos.filter(t => t._id !== id));
            if (todoToDelete) {
                addNotification(`Task deleted: "${todoToDelete.title}"`, "warning");
            }
        } catch (error) {
            console.log(error);
            addNotification("Failed to delete task", "error");
        }
    };

    const startEdit = (todo) => {
        setEditingId(todo._id);
        setEditText(todo.title);
    };

    const saveEdit = async () => {
        try {
            const res = await updateTodo(editingId, { title: editText });
            setTodos(prev =>
                prev.map(t => t._id === editingId ? res.data : t)
            );
            addNotification(`Task updated: "${res.data.title}"`, "info");
        } catch (error) {
            console.log(error);
            addNotification("Failed to update task", "error");
        }

        setEditingId(null);
        setEditText("");
    };

    const filteredTodos = todos.filter(todo => {

        const matchesSearch =
            todo.title.toLowerCase().includes(search.toLowerCase());

        if (filter === "active")
            return !todo.completed && matchesSearch;

        if (filter === "completed")
            return todo.completed && matchesSearch;

        return matchesSearch;
    });

    const openTodo = (todo) => {
        setSelectTodo(todo);
    };







    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

return (
    <AppLayout
        user={user}
        search={search}
        setSearch={setSearch}
    >

        {/* PAGE HEADER */}
        <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.name} 
            </h1>

            <p className="text-gray-500 mt-1">
                Here’s your productivity overview today.
            </p>

        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* TOTAL */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">

                <p className="text-sm text-gray-500 mb-2">
                    Total Tasks
                </p>

                <h2 className="text-4xl font-bold text-blue-600">
                    {todos.length}
                </h2>

            </div>

            {/* COMPLETED */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">

                <p className="text-sm text-gray-500 mb-2">
                    Completed
                </p>

                <h2 className="text-4xl font-bold text-green-600">
                    {todos.filter(t => t.completed).length}
                </h2>

            </div>

            {/* PRODUCTIVITY */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">

                <p className="text-sm text-gray-500 mb-2">
                    Productivity
                </p>

                <h2 className="text-4xl font-bold text-purple-600">
                    {todos.length === 0
                        ? "0%"
                        : `${Math.round(
                            (todos.filter(t => t.completed).length / todos.length) * 100
                        )}%`
                    }
                </h2>

            </div>

        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-6 overflow-x-auto">




            <button
                onClick={() => setFilter("all")}
                className={`
                    px-4 py-2 rounded-xl font-medium transition
                    ${filter === "all"
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white border hover:bg-gray-50"
                    }
                `}
            >
                All
            </button>

            <button
                onClick={() => setFilter("active")}
                className={`
                    px-4 py-2 rounded-xl font-medium transition
                    ${filter === "active"
                        ? "bg-red-500 text-white shadow"
                        : "bg-white border hover:bg-gray-50"
                    }
                `}
            >
                Active
            </button>

            <button
                onClick={() => setFilter("completed")}
                className={`
                    px-4 py-2 rounded-xl font-medium transition
                    ${filter === "completed"
                        ? "bg-green-600 text-white shadow"
                        : "bg-white border hover:bg-gray-50"
                    }
                `}
            >
                Completed
            </button>

        </div>

        {/* TODO PANEL */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

            <div className="mb-6">
                <TodoInput onAdd={addTodo} />
            </div>

            <TodoList
                todos={filteredTodos}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onEdit={startEdit}
                onClick={openTodo}
            />

        </div>

        {/* EDIT MODAL */}
        {editingId && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">

                    <h2 className="text-xl font-bold mb-4">
                        Edit Task
                    </h2>

                    <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="
                            w-full border rounded-xl
                            p-3 mb-4
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                    <div className="flex justify-end gap-3">

                        <button
                            onClick={() => {
                                setEditingId(null);
                                setEditText("");
                            }}
                            className="
                                px-4 py-2 rounded-xl border
                                hover:bg-gray-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={saveEdit}
                            className="
                                px-4 py-2 rounded-xl
                                bg-blue-600 text-white
                                hover:bg-blue-700
                            "
                        >
                            Save Changes
                        </button>

                    </div>

                </div>

            </div>
        )}

    </AppLayout>
);
}
