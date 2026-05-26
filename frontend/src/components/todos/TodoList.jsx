import { TodoItem } from "./TodoItem"


export function TodoList({ todos, onDelete, onToggle, onEdit, onClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {todos.map((todo) => (
        <div
          key={todo._id}
          onClick={() => onClick(todo)}
          className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >

          {/* TITLE */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">
              {todo.title}
            </h3>

            {/* STATUS BADGE */}
            <span
              className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${todo.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {todo.completed ? "Completed" : "Active"}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center mt-4">

            {/* LEFT ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(todo._id);
                }}
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Toggle
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(todo);
                }}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Edit
              </button>
            </div>

            {/* DELETE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo._id);
              }}
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Delete
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}
