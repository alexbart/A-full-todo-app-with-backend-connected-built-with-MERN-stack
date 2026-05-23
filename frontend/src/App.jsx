import { useState, useEffect } from "react";
import { TodoInput } from "./components/TodoInput";
import { TodoList } from "./components/TodoList";
import { getTodos, createTodo, toggleTodo, updateTodo, deleteTodo } from "./api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");


  // GET todos
  const fetchTodos = async () => {
    try {
      const res = await getTodos();
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ADD todo
  const addTodo = async (title) => {
    try {
      const res = await createTodo({ title });
      setTodos([res.data, ...todos]);
    } catch (error) {
      console.log(error);
    }
  };

  // TOGGLE todo
  const handleToggle = async (id) => {
    try {
      const res = await toggleTodo(id);

      setTodos(
        todos.map((todo) =>
          todo._id === id ? res.data : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Start edit
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.title);
  };

  // Save edit
  const saveEdit = async () => {
    try {
      const res = await updateTodo(editingId, {
        title: editText,
      });

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === res.data._id ? res.data : todo
        )
      );

      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE todo
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }


  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    } else if (filter === "completed") {
      return todo.completed;
    } else {
      return true;
    }
  });




  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Todo App
        </h1>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded ${filter === "active" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
          >
            Active
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
          >
            Completed
          </button>
        </div>

        {editingId && (
          <div className="flex gap-2 mb-4">
            <input
              className="border p-2 flex-1 rounded"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />

            <button
              onClick={saveEdit}
              className="bg-green-600 text-white px-3 rounded"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditingId(null);
                setEditText("");
              }}
              className="bg-gray-300 px-3 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        <TodoInput onAdd={addTodo} />

        <TodoList todos={filteredTodos} onDelete={handleDelete} onToggle={handleToggle} onEdit={startEdit} />
      </div>
    </div>
  );

}


export default App;