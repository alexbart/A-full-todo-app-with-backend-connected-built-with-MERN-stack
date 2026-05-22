export function TodoItem({ todo, onDelete, onToggle }) {
    return (
        <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">

            {/* Checkbox */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo._id)}
                    className="w-4 h-4"
                />

                <span
                    className={`cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""
                        }`}
                >
                    {todo.title}
                </span>
            </div>

            {/* Delete */}
            <button
                onClick={() => onDelete(todo._id)}
                className="text-red-500"
            >
                Delete
            </button>
        </div>
    );
}